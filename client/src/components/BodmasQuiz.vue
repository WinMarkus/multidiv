<script setup>
import { ref, computed, watch } from 'vue'

// ─── difficulty ───────────────────────────────────────────────────────────────
const difficulty = ref(1)

// ─── formula generation ───────────────────────────────────────────────────────

/**
 * A "segment" is one independently-evaluable chunk of the expression.
 * It carries:
 *   - tokens : string[]   raw tokens that make up this chunk (for display)
 *   - value  : number     the numeric result of evaluating those tokens
 *   - type   : string     label used for the colour highlight ('brackets'|'orders'|'divmul'|'addsub')
 */

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randOp(ops) {
  return ops[Math.floor(Math.random() * ops.length)]
}

/**
 * Evaluate a flat list of tokens like ['3', '+', '4', '*', '2']
 * following standard operator precedence (no brackets here – brackets are
 * pre-evaluated by the step system).
 */
function evalTokens(tokens) {
  // copy so we can mutate
  let toks = [...tokens]

  // pass 1: exponentiation (^)
  let i = 1
  while (i < toks.length) {
    if (toks[i] === '^') {
      const result = Math.pow(Number(toks[i - 1]), Number(toks[i + 1]))
      toks.splice(i - 1, 3, String(result))
    } else {
      i += 2
    }
  }

  // pass 2: × and ÷
  i = 1
  while (i < toks.length) {
    if (toks[i] === '×' || toks[i] === '÷') {
      const a = Number(toks[i - 1])
      const b = Number(toks[i + 1])
      const result = toks[i] === '×' ? a * b : a / b
      toks.splice(i - 1, 3, String(Math.round(result * 1000) / 1000))
    } else {
      i += 2
    }
  }

  // pass 3: + and -
  i = 1
  while (i < toks.length) {
    if (toks[i] === '+' || toks[i] === '-') {
      const result = Number(toks[i - 1]) + (toks[i] === '+' ? 1 : -1) * Number(toks[i + 1])
      toks.splice(i - 1, 3, String(Math.round(result * 1000) / 1000))
    } else {
      i += 2
    }
  }

  return Number(toks[0])
}

/**
 * Generate a formula appropriate for the difficulty level.
 *
 * Returns { displayTokens, segments, answer }
 *   displayTokens : string[]    – the full expression token list for rendering
 *   segments      : Segment[]   – ordered list of steps the user must solve
 *   answer        : number      – final numeric answer
 */
function generateFormula(diff) {
  // scale numbers with difficulty
  const maxN = diff <= 2 ? 9 : diff <= 5 ? 20 : 50

  // ── build a bracket sub-expression ────────────────────────────────────────
  const a = randInt(1, maxN)
  const b = randInt(1, maxN)
  const bracketOp = randOp(['+', '-'])
  const bracketTokens = ['(', String(a), bracketOp, String(b), ')']
  const bracketValue = evalTokens([String(a), bracketOp, String(b)])

  // ── optionally add an exponent (orders) for diff >= 3 ─────────────────────
  let ordersTokens = null
  let ordersValue = null
  const useOrders = diff >= 3

  // pick a small base and exponent so numbers stay manageable
  if (useOrders) {
    const base = randInt(2, diff <= 5 ? 4 : 6)
    const exp  = randInt(2, 3)
    ordersTokens = [String(base), '^', String(exp)]
    ordersValue  = Math.pow(base, exp)
  }

  // ── build a multiply/divide pair ───────────────────────────────────────────
  const c  = diff >= 4 ? randInt(2, maxN) : randInt(2, 9)
  // for division, ensure clean integer result
  const d  = diff >= 4 ? randInt(2, 9) : randInt(2, 5)
  const mulDiv = useOrders ? '×' : randOp(['×', '÷'])
  // if dividing use c*d so result is integer
  let mulDivTokens, mulDivValue
  if (mulDiv === '÷') {
    mulDivTokens = [String(c * d), '÷', String(d)]
    mulDivValue  = c
  } else {
    mulDivTokens = [String(c), '×', String(d)]
    mulDivValue  = c * d
  }

  // ── addition / subtraction tail ────────────────────────────────────────────
  const e      = randInt(1, maxN)
  const addOp  = randOp(['+', '-'])

  // ── assemble full token list ───────────────────────────────────────────────
  // Pattern (diff < 3):  (a op b) × c + e
  // Pattern (diff >= 3): (a op b) × c^exp + e   (orders appear as separate segment)
  let displayTokens = []
  const segments = []

  // Segment 0: brackets
  displayTokens.push(...bracketTokens)
  segments.push({
    indices: [...Array(bracketTokens.length).keys()],  // positions 0..4
    tokens:  bracketTokens,
    value:   bracketValue,
    type:    'brackets',
    label:   'Brackets',
    emoji:   '🔵',
  })

  // connect bracket result to the rest with ×
  displayTokens.push('×')

  if (useOrders) {
    // Segment 1: orders (e.g. 3^2)
    const ordersStart = displayTokens.length
    displayTokens.push(...ordersTokens)
    segments.push({
      indices: [ordersStart, ordersStart + 1, ordersStart + 2],
      tokens:  ordersTokens,
      value:   ordersValue,
      type:    'orders',
      label:   'Orders (Powers)',
      emoji:   '🟡',
    })

    // Segment 2: the bracket × orders result – both already computed above
    // We'll handle this implicitly: after solving brackets and orders, the
    // product is a new ÷/× segment that the system resolves automatically.
    // For simplicity we add a separate division/multiplication segment.
    displayTokens.push('+', ...mulDivTokens)
    // mulDiv segment uses the tokens that appear literally
    const mulStart = displayTokens.indexOf(mulDivTokens[0], ordersStart + 3 + 1)
    segments.push({
      indices: [mulStart, mulStart + 1, mulStart + 2],
      tokens:  mulDivTokens,
      value:   mulDivValue,
      type:    'divmul',
      label:   'Division / Multiplication',
      emoji:   '🟠',
    })

    // final add/sub with e
    const eIdx = displayTokens.length
    displayTokens.push(addOp, String(e))
    const addStart = eIdx
    segments.push({
      indices: [addStart, addStart + 1],
      tokens:  [addOp, String(e)],
      // value is evaluated at the end after prior segments resolved
      value:   null, // computed lazily
      type:    'addsub',
      label:   'Addition / Subtraction',
      emoji:   '🟢',
    })
  } else {
    // Segment 1: multiply/divide
    const mulStart = displayTokens.length
    displayTokens.push(...mulDivTokens)
    segments.push({
      indices: [mulStart, mulStart + 1, mulStart + 2],
      tokens:  mulDivTokens,
      value:   mulDivValue,
      type:    'divmul',
      label:   'Division / Multiplication',
      emoji:   '🟠',
    })

    // Segment 2: add/sub
    const addStart = displayTokens.length
    displayTokens.push(addOp, String(e))
    segments.push({
      indices: [addStart, addStart + 1],
      tokens:  [addOp, String(e)],
      value:   null,
      type:    'addsub',
      label:   'Addition / Subtraction',
      emoji:   '🟢',
    })
  }

  // compute the final answer by evaluating the full expression
  const flatForEval = displayTokens.filter(t => t !== '(' && t !== ')')
  const answer = evalTokens(flatForEval)

  // for the addsub segment, just store the operator+operand; value computed after prior
  // steps resolved – we'll do it interactively.

  return { displayTokens, segments, answer: Math.round(answer * 1000) / 1000 }
}

// ─── state ────────────────────────────────────────────────────────────────────

const formula    = ref(null)      // { displayTokens, segments, answer }
const stepIndex  = ref(0)         // which segment the user is currently working on
const resolvedTokens = ref([])    // copy of displayTokens with solved parts replaced
const hoveredType = ref(null)     // for hover-highlight mode
const selectedSegIdx = ref(null)  // for click mode
const userInput  = ref('')
const feedback   = ref('')        // 'correct' | 'wrong' | ''
const wrongGuess = ref('')
const finished   = ref(false)
const score      = ref(0)
const totalPlayed = ref(0)
const streak     = ref(0)

// ─── computed ─────────────────────────────────────────────────────────────────

const isLowDifficulty = computed(() => difficulty.value <= 3)

const currentSegment = computed(() => {
  if (!formula.value) return null
  return formula.value.segments[stepIndex.value] ?? null
})

/**
 * Build a rich token list for rendering, annotating each token with its
 * segment membership and whether it's the active/hovered segment.
 */
const richTokens = computed(() => {
  if (!formula.value) return []
  const toks = resolvedTokens.value
  return toks.map((tok, idx) => {
    // find which segment owns this index
    const seg = formula.value.segments.find(s => s.indices.includes(idx))
    const segIdx = formula.value.segments.indexOf(seg)
    const isDone  = segIdx < stepIndex.value
    const isCurrent = segIdx === stepIndex.value
    const isHovered = isLowDifficulty.value && seg && seg.type === hoveredType.value
    const isSelected = !isLowDifficulty.value && segIdx === selectedSegIdx.value

    return {
      tok, idx, seg, segIdx, isDone, isCurrent, isHovered, isSelected,
    }
  })
})

const segmentColour = {
  brackets: 'text-blue-300  bg-blue-900/50  border-blue-400',
  orders:   'text-yellow-300 bg-yellow-900/50 border-yellow-400',
  divmul:   'text-orange-300 bg-orange-900/50 border-orange-400',
  addsub:   'text-green-300  bg-green-900/50  border-green-400',
}

const segmentHoverColour = {
  brackets: 'bg-blue-700/70  scale-110',
  orders:   'bg-yellow-700/70 scale-110',
  divmul:   'bg-orange-700/70 scale-110',
  addsub:   'bg-green-700/70  scale-110',
}

function tokenClass(rt) {
  if (!rt.seg) return 'text-hp-gold'
  const base = 'rounded px-1 py-0.5 border transition-all duration-150 cursor-default font-mono font-bold text-2xl'

  if (rt.isDone) return `${base} opacity-40 border-transparent text-hp-gold/40`

  const colour = segmentColour[rt.seg.type] ?? 'text-hp-gold'

  if (rt.isHovered || rt.isSelected) {
    return `${base} ${colour} ${segmentHoverColour[rt.seg.type]} border-current`
  }
  return `${base} ${colour} border-transparent`
}

// ─── legend shown at low difficulty ──────────────────────────────────────────
const legend = computed(() => {
  if (!formula.value) return []
  return formula.value.segments.map((s, i) => ({
    ...s,
    stepNum: i + 1,
    done: i < stepIndex.value,
    active: i === stepIndex.value,
  }))
})

// ─── actions ──────────────────────────────────────────────────────────────────

function newFormula() {
  const f = generateFormula(difficulty.value)
  formula.value = f
  resolvedTokens.value = [...f.displayTokens]
  stepIndex.value = 0
  hoveredType.value = null
  selectedSegIdx.value = null
  userInput.value = ''
  feedback.value = ''
  wrongGuess.value = ''
  finished.value = false
}

function onSegmentClick(rt) {
  if (isLowDifficulty.value) return          // hover mode – no click needed
  if (rt.isDone) return                       // already solved
  if (!rt.seg) return                         // operator between segments
  // only allow clicking the CURRENT (next to solve) segment
  if (rt.segIdx !== stepIndex.value) return
  selectedSegIdx.value = rt.segIdx
  userInput.value = ''
  feedback.value = ''
}

function submitStep() {
  if (!currentSegment.value) return
  const seg = currentSegment.value
  const parsed = Number(userInput.value)
  if (isNaN(parsed) || userInput.value.trim() === '') return

  // For the last addsub segment we need to compute the expected value on the fly
  // because it involves the already-resolved values of prior segments.
  let expected = seg.value
  if (seg.type === 'addsub') {
    // At this point resolvedTokens has all prior segments replaced.
    // Evaluate the whole remaining expression.
    const flat = resolvedTokens.value.filter(t => t !== '(' && t !== ')')
    expected = Math.round(evalTokens(flat) * 1000) / 1000
  }

  if (Math.round(parsed * 1000) / 1000 === expected) {
    // Replace the segment tokens in resolvedTokens with the result
    // We replace the tokens at the segment indices with the value (first index)
    // and empty strings (remaining indices) – then we filter empties for eval
    // but keep them for index stability.
    const newToks = [...resolvedTokens.value]
    seg.indices.forEach((absIdx, ii) => {
      newToks[absIdx] = ii === 0 ? String(expected) : ''
    })
    resolvedTokens.value = newToks

    stepIndex.value++
    selectedSegIdx.value = null
    userInput.value = ''
    feedback.value = 'correct'
    wrongGuess.value = ''

    // check if all steps done
    if (stepIndex.value >= formula.value.segments.length) {
      finished.value = true
      score.value++
      totalPlayed.value++
      streak.value++
    }
  } else {
    feedback.value = 'wrong'
    wrongGuess.value = userInput.value
    streak.value = 0
    totalPlayed.value++
  }
}

function handleKey(e) {
  if (e.key === 'Enter') submitStep()
}

function skipToNext() {
  // reveal answer for current step
  const seg = currentSegment.value
  if (!seg) return
  let expected = seg.value
  if (seg.type === 'addsub') {
    const flat = resolvedTokens.value.filter(t => t !== '(' && t !== ')')
    expected = Math.round(evalTokens(flat) * 1000) / 1000
  }
  const newToks = [...resolvedTokens.value]
  seg.indices.forEach((absIdx, ii) => {
    newToks[absIdx] = ii === 0 ? String(expected) : ''
  })
  resolvedTokens.value = newToks
  stepIndex.value++
  selectedSegIdx.value = null
  userInput.value = ''
  feedback.value = ''
  wrongGuess.value = ''
  if (stepIndex.value >= formula.value.segments.length) {
    finished.value = true
  }
}

// regenerate when difficulty changes
watch(difficulty, () => newFormula())

// kick off
newFormula()
</script>

<template>
  <div class="container mx-auto px-4 py-8 min-h-screen flex flex-col items-center">

    <!-- Navigation -->
    <div class="w-full flex justify-between items-start mb-6">
      <router-link
        to="/"
        class="bg-hp-burgundy hover:bg-hp-burgundy/80 text-hp-gold font-hp px-4 py-2 rounded-lg border-2 border-hp-gold/50 transition-all duration-300 hover:scale-105 shadow-lg"
      >
        ← Back to Math Academy
      </router-link>
    </div>

    <!-- Header -->
    <div class="text-center mb-6">
      <h1 class="text-4xl font-hp text-hp-gold mb-1 drop-shadow-lg">
        🧮 BODMAS Wizard 🧮
      </h1>
      <p class="text-hp-gold/70 text-sm">
        Brackets · Orders · Division · Multiplication · Addition · Subtraction
      </p>
    </div>

    <!-- Stats + Difficulty -->
    <div class="bg-hp-navy/50 backdrop-blur rounded-lg p-4 mb-6 w-full max-w-3xl border-2 border-hp-gold/30">
      <div class="flex flex-wrap gap-4 items-center justify-between">
        <div class="flex gap-6 text-center">
          <div>
            <p class="text-hp-gold/70 text-xs">Streak</p>
            <p class="text-xl font-bold text-hp-gold">🔥 {{ streak }}</p>
          </div>
          <div>
            <p class="text-hp-gold/70 text-xs">Score</p>
            <p class="text-xl font-bold text-hp-gold">{{ score }} / {{ totalPlayed }}</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <label class="text-hp-gold font-hp">Difficulty:</label>
          <select
            v-model="difficulty"
            class="bg-hp-navy/80 text-hp-gold border-2 border-hp-gold/50 rounded-lg px-3 py-1 font-hp focus:outline-none focus:ring-2 focus:ring-hp-gold"
          >
            <option :value="1">Apprentice (1)</option>
            <option :value="2">Novice (2)</option>
            <option :value="3">Adept (3)</option>
            <option :value="4">Expert (4)</option>
            <option :value="5">Master (5)</option>
            <option :value="6">Grandmaster (6)</option>
            <option :value="7">Archmage (7)</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Mode badge -->
    <div class="mb-4">
      <span
        class="px-4 py-1 rounded-full text-sm font-bold border-2"
        :class="isLowDifficulty
          ? 'bg-blue-900/50 text-blue-300 border-blue-400'
          : 'bg-purple-900/50 text-purple-300 border-purple-400'"
      >
        {{ isLowDifficulty ? '👆 Hover mode – hover to highlight BODMAS groups' : '🖱️ Click mode – click the part to solve next' }}
      </span>
    </div>

    <!-- Main card -->
    <div class="bg-gradient-to-br from-hp-burgundy/80 to-purple-900/80 backdrop-blur rounded-xl p-8 w-full max-w-3xl border-4 border-hp-gold/50 shadow-2xl">

      <!-- Formula display -->
      <div class="flex flex-wrap justify-center items-center gap-1 mb-8 min-h-[4rem]">
        <template v-for="rt in richTokens" :key="rt.idx">
          <span
            v-if="rt.tok !== ''"
            :class="tokenClass(rt)"
            @mouseover="isLowDifficulty && rt.seg ? hoveredType = rt.seg.type : null"
            @mouseleave="isLowDifficulty ? hoveredType = null : null"
            @click="onSegmentClick(rt)"
            :style="!isLowDifficulty && rt.seg && rt.segIdx === stepIndex && !rt.isDone ? 'cursor:pointer' : ''"
          >
            {{ rt.tok }}
          </span>
        </template>
      </div>

      <!-- BODMAS Legend (always visible, highlights on hover in low-diff mode) -->
      <div class="flex flex-wrap gap-2 justify-center mb-6">
        <div
          v-for="item in legend"
          :key="item.type"
          class="flex items-center gap-1 px-3 py-1 rounded-full border text-sm font-bold transition-all duration-150"
          :class="[
            segmentColour[item.type],
            item.done ? 'opacity-30' : '',
            item.active ? 'ring-2 ring-white/50 scale-105' : '',
            isLowDifficulty && hoveredType === item.type ? 'scale-110 ring-2 ring-white/70' : ''
          ]"
          @mouseover="isLowDifficulty ? hoveredType = item.type : null"
          @mouseleave="isLowDifficulty ? hoveredType = null : null"
        >
          {{ item.emoji }} {{ item.label }}
          <span v-if="item.done" class="ml-1">✓</span>
          <span v-else-if="item.active && !finished" class="ml-1 animate-pulse">←</span>
        </div>
      </div>

      <!-- Step instructions -->
      <div v-if="!finished" class="text-center mb-4">
        <template v-if="isLowDifficulty">
          <!-- Low difficulty: show current step info + auto-input -->
          <p class="text-hp-gold/80 mb-2 text-sm">
            Step {{ stepIndex + 1 }} of {{ formula?.segments.length }}:
            Solve the
            <span class="font-bold" :class="segmentColour[currentSegment?.type]?.split(' ')[0]">
              {{ currentSegment?.label }}
            </span>
            part
          </p>
          <p class="text-hp-gold text-lg mb-3 font-mono">
            {{ currentSegment?.tokens?.join(' ') }}
          </p>
        </template>
        <template v-else>
          <!-- High difficulty: prompt user to click a segment -->
          <p v-if="selectedSegIdx === null" class="text-hp-gold/80 mb-2 text-sm">
            👆 Click the part of the formula you want to solve next
            <span class="text-hp-gold/50 text-xs block mt-1">(Solve in BODMAS order)</span>
          </p>
          <p v-else class="text-hp-gold/80 mb-2 text-sm">
            Solve:
            <span class="font-mono text-hp-gold font-bold">
              {{ formula?.segments[selectedSegIdx]?.tokens?.join(' ') }}
            </span>
          </p>
        </template>
      </div>

      <!-- Answer input -->
      <div v-if="!finished && (isLowDifficulty || selectedSegIdx !== null)" class="flex flex-col items-center gap-3">
        <div class="flex gap-2 w-full max-w-sm">
          <input
            v-model="userInput"
            @keydown="handleKey"
            type="number"
            placeholder="Your answer…"
            class="flex-1 px-4 py-3 text-xl text-center bg-white/10 border-2 border-hp-gold/50 rounded-lg text-hp-gold placeholder-hp-gold/30 focus:outline-none focus:ring-2 focus:ring-hp-gold"
            autofocus
          />
          <button
            @click="submitStep"
            class="bg-hp-gold hover:bg-hp-bronze text-hp-navy font-hp font-bold px-5 py-3 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
          >
            ✓
          </button>
        </div>

        <!-- Feedback -->
        <p v-if="feedback === 'correct'" class="text-green-400 font-bold text-lg animate-bounce">
          ✅ Correct! Keep going!
        </p>
        <p v-else-if="feedback === 'wrong'" class="text-yellow-400 font-bold text-lg">
          ❌ Not quite – {{ wrongGuess }} is wrong. Try again!
        </p>

        <button
          @click="skipToNext"
          class="text-hp-gold/50 hover:text-hp-gold/80 text-xs underline transition-colors"
        >
          Show answer &amp; skip
        </button>
      </div>

      <!-- Finished state -->
      <div v-if="finished" class="text-center">
        <p class="text-4xl font-hp text-hp-gold mb-2 drop-shadow-lg">🎉 Formula Solved! 🎉</p>
        <p class="text-hp-gold/80 mb-6 text-lg">
          Answer: <span class="font-bold text-hp-gold text-2xl">{{ formula?.answer }}</span>
        </p>
        <button
          @click="newFormula"
          class="bg-hp-gold hover:bg-hp-bronze text-hp-navy font-hp font-bold px-8 py-4 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg text-xl"
        >
          Next Formula ✨
        </button>
      </div>
    </div>

    <!-- How-to hint (collapsible) -->
    <details class="mt-6 w-full max-w-3xl bg-hp-navy/50 border border-hp-gold/20 rounded-lg p-4 text-hp-gold/70 text-sm">
      <summary class="cursor-pointer font-bold text-hp-gold/80 mb-2">📖 How does BODMAS work?</summary>
      <ol class="list-decimal list-inside space-y-1 mt-2">
        <li><span class="text-blue-300 font-bold">B</span>rackets – solve anything inside ( ) first</li>
        <li><span class="text-yellow-300 font-bold">O</span>rders – powers and roots next (e.g. 3²)</li>
        <li><span class="text-orange-300 font-bold">D</span>ivision and <span class="text-orange-300 font-bold">M</span>ultiplication – left to right</li>
        <li><span class="text-green-300 font-bold">A</span>ddition and <span class="text-green-300 font-bold">S</span>ubtraction – left to right</li>
      </ol>
    </details>

  </div>
</template>

<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
  appearance: textfield;
}
</style>
