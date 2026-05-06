<script setup>
import { ref, computed, watch } from 'vue'

// ─── difficulty ───────────────────────────────────────────────────────────────
const difficulty = ref(1)

// ─── helpers ──────────────────────────────────────────────────────────────────
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randOp(ops) {
  return ops[Math.floor(Math.random() * ops.length)]
}

// Round to avoid floating-point noise (3 decimal places is plenty for these sums)
function round(n) {
  return Math.round(n * 1000) / 1000
}

// ─── formula generation ───────────────────────────────────────────────────────
/**
 * A Step describes the state of the formula at a particular BODMAS stage.
 *   tokens       : Array<{text, segment}>  – every display token with its colour group
 *   activeSegment: string                  – which BODMAS group the user must solve now
 *   expectedAnswer: number                 – what we expect the user to type
 *   hint         : string                  – short "solve X OP Y" label shown below
 *
 * Instead of tracking absolute token indices across mutations, we pre-compute
 * a fresh token snapshot for every step.  This is simpler, correct, and easy
 * to maintain.
 */

function tok(text, segment) {
  return { text: String(text), segment }
}

/**
 * Build all steps for a formula without Orders (difficulty 1-2):
 *
 *   ( a OP1 b ) OP2 c OP3 e
 *
 * Step 1 – Brackets : solve  a OP1 b → R1
 * Step 2 – DivMul  : solve  R1 OP2 c → R2
 * Step 3 – AddSub  : solve  R2 OP3 e → R3  (final answer)
 */
function buildStepsSimple(diff) {
  const maxN = diff <= 2 ? 9 : 20

  // Retry iteratively to avoid unbounded recursion on degenerate cases
  for (let attempt = 0; attempt < 20; attempt++) {
    // brackets
    const a   = randInt(1, maxN)
    const b   = randInt(1, maxN)
    const op1 = randOp(['+', '-'])
    const R1  = round(op1 === '+' ? a + b : a - b)
    if (R1 <= 0) continue

    // DivMul – ensure clean integer result when dividing
    const op2 = randOp(['×', '÷'])
    let c, R2
    if (op2 === '÷') {
      c = randInt(2, 5)
      if (R1 % c !== 0) continue
      R2 = round(R1 / c)
    } else {
      c  = randInt(2, diff <= 2 ? 9 : maxN)
      R2 = round(R1 * c)
    }

    const op3 = randOp(['+', '-'])
    const e   = randInt(1, maxN)
    const R3  = round(op3 === '+' ? R2 + e : R2 - e)

    const allSegments = ['brackets', 'divmul', 'addsub']

    const step1Tokens = [
      tok('(', 'brackets'), tok(a, 'brackets'), tok(op1, 'brackets'),
      tok(b, 'brackets'),   tok(')', 'brackets'),
      tok(op2, 'divmul'),   tok(c, 'divmul'),
      tok(op3, 'addsub'),   tok(e, 'addsub'),
    ]

    const step2Tokens = [
      tok(R1, 'divmul'), tok(op2, 'divmul'), tok(c, 'divmul'),
      tok(op3, 'addsub'), tok(e, 'addsub'),
    ]

    const step3Tokens = [
      tok(R2, 'addsub'), tok(op3, 'addsub'), tok(e, 'addsub'),
    ]

    return {
      segments: allSegments,
      steps: [
        { tokens: step1Tokens, activeSegment: 'brackets', expectedAnswer: R1,
          hint: `${a} ${op1} ${b}` },
        { tokens: step2Tokens, activeSegment: 'divmul',   expectedAnswer: R2,
          hint: `${R1} ${op2} ${c}` },
        { tokens: step3Tokens, activeSegment: 'addsub',   expectedAnswer: R3,
          hint: `${R2} ${op3} ${e}` },
      ],
      answer: R3,
    }
  }

  // Fallback: guaranteed-valid formula (2 + 3) × 4 + 1 = 21
  return {
    segments: ['brackets', 'divmul', 'addsub'],
    steps: [
      { tokens: [tok('(','brackets'),tok(2,'brackets'),tok('+','brackets'),tok(3,'brackets'),tok(')','brackets'),tok('×','divmul'),tok(4,'divmul'),tok('+','addsub'),tok(1,'addsub')],
        activeSegment: 'brackets', expectedAnswer: 5, hint: '2 + 3' },
      { tokens: [tok(5,'divmul'),tok('×','divmul'),tok(4,'divmul'),tok('+','addsub'),tok(1,'addsub')],
        activeSegment: 'divmul', expectedAnswer: 20, hint: '5 × 4' },
      { tokens: [tok(20,'addsub'),tok('+','addsub'),tok(1,'addsub')],
        activeSegment: 'addsub', expectedAnswer: 21, hint: '20 + 1' },
    ],
    answer: 21,
  }
}

/**
 * Build all steps for a formula with Orders (difficulty 3+):
 *
 *   ( a OP1 b ) OP2 base^exp OP3 e
 *
 * Step 1 – Brackets : solve  a OP1 b → R1
 * Step 2 – Orders   : solve  base^exp → R2
 * Step 3 – DivMul   : solve  R1 OP2 R2 → R3
 * Step 4 – AddSub   : solve  R3 OP3 e  → R4  (final answer)
 */
function buildStepsWithOrders(diff) {
  const maxN  = diff <= 5 ? 20 : 50

  for (let attempt = 0; attempt < 20; attempt++) {
    // brackets
    const a   = randInt(1, maxN)
    const b   = randInt(1, maxN)
    const op1 = randOp(['+', '-'])
    const R1  = round(op1 === '+' ? a + b : a - b)
    if (R1 <= 0) continue

    // orders
    const base = randInt(2, diff <= 5 ? 4 : 6)
    const exp  = randInt(2, 3)
    const R2   = Math.pow(base, exp)

    // DivMul between R1 and R2
    const op2 = randOp(['×', '÷'])
    let R3
    if (op2 === '÷') {
      if (R1 % R2 !== 0) continue
      R3 = round(R1 / R2)
    } else {
      R3 = round(R1 * R2)
    }

    // add/sub tail
    const op3 = randOp(['+', '-'])
    const e   = randInt(1, maxN)
    const R4  = round(op3 === '+' ? R3 + e : R3 - e)

    const allSegments = ['brackets', 'orders', 'divmul', 'addsub']

    const step1Tokens = [
      tok('(', 'brackets'),   tok(a, 'brackets'),   tok(op1, 'brackets'),
      tok(b, 'brackets'),     tok(')', 'brackets'),
      tok(op2, 'divmul'),
      tok(base, 'orders'),    tok('^', 'orders'),    tok(exp, 'orders'),
      tok(op3, 'addsub'),     tok(e, 'addsub'),
    ]

    const step2Tokens = [
      tok(R1, 'divmul'),
      tok(op2, 'divmul'),
      tok(base, 'orders'),  tok('^', 'orders'),  tok(exp, 'orders'),
      tok(op3, 'addsub'),   tok(e, 'addsub'),
    ]

    const step3Tokens = [
      tok(R1, 'divmul'),    tok(op2, 'divmul'),  tok(R2, 'divmul'),
      tok(op3, 'addsub'),   tok(e, 'addsub'),
    ]

    const step4Tokens = [
      tok(R3, 'addsub'),    tok(op3, 'addsub'),  tok(e, 'addsub'),
    ]

    return {
      segments: allSegments,
      steps: [
        { tokens: step1Tokens, activeSegment: 'brackets', expectedAnswer: R1,
          hint: `${a} ${op1} ${b}` },
        { tokens: step2Tokens, activeSegment: 'orders',   expectedAnswer: R2,
          hint: `${base} ^ ${exp}` },
        { tokens: step3Tokens, activeSegment: 'divmul',   expectedAnswer: R3,
          hint: `${R1} ${op2} ${R2}` },
        { tokens: step4Tokens, activeSegment: 'addsub',   expectedAnswer: R4,
          hint: `${R3} ${op3} ${e}` },
      ],
      answer: R4,
    }
  }

  // Fallback: (3 + 4) × 2^3 + 1 = 57
  return {
    segments: ['brackets', 'orders', 'divmul', 'addsub'],
    steps: [
      { tokens: [tok('(','brackets'),tok(3,'brackets'),tok('+','brackets'),tok(4,'brackets'),tok(')','brackets'),tok('×','divmul'),tok(2,'orders'),tok('^','orders'),tok(3,'orders'),tok('+','addsub'),tok(1,'addsub')],
        activeSegment: 'brackets', expectedAnswer: 7, hint: '3 + 4' },
      { tokens: [tok(7,'divmul'),tok('×','divmul'),tok(2,'orders'),tok('^','orders'),tok(3,'orders'),tok('+','addsub'),tok(1,'addsub')],
        activeSegment: 'orders', expectedAnswer: 8, hint: '2 ^ 3' },
      { tokens: [tok(7,'divmul'),tok('×','divmul'),tok(8,'divmul'),tok('+','addsub'),tok(1,'addsub')],
        activeSegment: 'divmul', expectedAnswer: 56, hint: '7 × 8' },
      { tokens: [tok(56,'addsub'),tok('+','addsub'),tok(1,'addsub')],
        activeSegment: 'addsub', expectedAnswer: 57, hint: '56 + 1' },
    ],
    answer: 57,
  }
}

function generateFormula(diff) {
  return diff >= 3 ? buildStepsWithOrders(diff) : buildStepsSimple(diff)
}

// ─── state ────────────────────────────────────────────────────────────────────
const formula       = ref(null)   // { segments, steps, answer }
const stepIndex     = ref(0)
const hoveredSeg    = ref(null)   // segment type string, for hover-highlight
const selectedSeg   = ref(null)   // segment type string, for click mode
const userInput     = ref('')
const feedback      = ref('')     // 'correct' | 'wrong' | ''
const wrongGuess    = ref('')
const finished      = ref(false)
const score         = ref(0)
const totalPlayed   = ref(0)
const streak        = ref(0)

// ─── computed ─────────────────────────────────────────────────────────────────
const isLowDifficulty = computed(() => difficulty.value <= 3)

const currentStep = computed(() => formula.value?.steps[stepIndex.value] ?? null)

const SEGMENT_META = {
  brackets: { label: 'Brackets',                emoji: '🔵',
    colour: 'text-blue-300   bg-blue-900/50   border-blue-400',
    hover:  'bg-blue-700/70  scale-110 border-current' },
  orders:   { label: 'Orders (Powers)',          emoji: '🟡',
    colour: 'text-yellow-300 bg-yellow-900/50 border-yellow-400',
    hover:  'bg-yellow-700/70 scale-110 border-current' },
  divmul:   { label: 'Division / Multiplication',emoji: '🟠',
    colour: 'text-orange-300 bg-orange-900/50 border-orange-400',
    hover:  'bg-orange-700/70 scale-110 border-current' },
  addsub:   { label: 'Addition / Subtraction',   emoji: '🟢',
    colour: 'text-green-300  bg-green-900/50  border-green-400',
    hover:  'bg-green-700/70  scale-110 border-current' },
}

function tokenClass(t) {
  const step = currentStep.value
  if (!t.segment || !step) return 'text-hp-gold font-mono font-bold text-2xl'

  const meta = SEGMENT_META[t.segment]
  const base = 'rounded px-1 py-0.5 border transition-all duration-150 font-mono font-bold text-2xl'
  const isActive  = t.segment === step.activeSegment
  const isHovered = isLowDifficulty.value && t.segment === hoveredSeg.value
  const isClicked = !isLowDifficulty.value && t.segment === selectedSeg.value && isActive

  if (!isActive) return `${base} ${meta.colour} opacity-30 border-transparent cursor-default`
  if (isHovered || isClicked) return `${base} ${meta.colour} ${meta.hover}`
  return `${base} ${meta.colour} border-transparent ${!isLowDifficulty.value ? 'cursor-pointer hover:border-current' : 'cursor-default'}`
}

const legend = computed(() => {
  if (!formula.value) return []
  const step = currentStep.value
  return formula.value.segments.map((seg, i) => {
    const segStepIdx = formula.value.steps.findIndex(s => s.activeSegment === seg)
    return {
      seg,
      meta: SEGMENT_META[seg],
      done:   segStepIdx < stepIndex.value,
      active: step?.activeSegment === seg,
    }
  })
})

// ─── actions ──────────────────────────────────────────────────────────────────
function newFormula() {
  formula.value     = generateFormula(difficulty.value)
  stepIndex.value   = 0
  hoveredSeg.value  = null
  selectedSeg.value = null
  userInput.value   = ''
  feedback.value    = ''
  wrongGuess.value  = ''
  finished.value    = false
}

function onTokenClick(t) {
  if (isLowDifficulty.value) return
  const step = currentStep.value
  if (!step || t.segment !== step.activeSegment) return
  selectedSeg.value = t.segment
  userInput.value   = ''
  feedback.value    = ''
}

function advanceStep(revealAnswer = false) {
  const step = currentStep.value
  if (!step) return

  if (revealAnswer) {
    // skip: show the answer and move on without scoring
    selectedSeg.value = null
    userInput.value   = ''
    feedback.value    = ''
    wrongGuess.value  = ''
    stepIndex.value++
    if (stepIndex.value >= formula.value.steps.length) finished.value = true
    return
  }

  const parsed = Number(userInput.value)
  if (isNaN(parsed) || userInput.value === '') return

  if (round(parsed) === step.expectedAnswer) {
    selectedSeg.value = null
    userInput.value   = ''
    feedback.value    = 'correct'
    wrongGuess.value  = ''
    stepIndex.value++

    if (stepIndex.value >= formula.value.steps.length) {
      finished.value = true
      score.value++
      totalPlayed.value++
      streak.value++
    }
  } else {
    feedback.value  = 'wrong'
    wrongGuess.value = userInput.value
    streak.value    = 0
    totalPlayed.value++
  }
}

function handleKey(e) {
  if (e.key === 'Enter') advanceStep()
}

watch(difficulty, () => newFormula())
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
        {{ isLowDifficulty
          ? '👆 Hover mode – hover over the formula or legend to highlight BODMAS groups'
          : '🖱️ Click mode – click the highlighted part of the formula to solve it' }}
      </span>
    </div>

    <!-- Main card -->
    <div class="bg-gradient-to-br from-hp-burgundy/80 to-purple-900/80 backdrop-blur rounded-xl p-8 w-full max-w-3xl border-4 border-hp-gold/50 shadow-2xl">

      <!-- Formula display -->
      <div class="flex flex-wrap justify-center items-center gap-1 mb-8 min-h-[4rem]">
        <template v-if="currentStep">
          <span
            v-for="(t, i) in currentStep.tokens"
            :key="i"
            :class="tokenClass(t)"
            @mouseover="isLowDifficulty ? hoveredSeg = t.segment : null"
            @mouseleave="isLowDifficulty ? hoveredSeg = null : null"
            @click="onTokenClick(t)"
          >{{ t.text }}</span>
        </template>
      </div>

      <!-- BODMAS Legend -->
      <div class="flex flex-wrap gap-2 justify-center mb-6">
        <div
          v-for="item in legend"
          :key="item.seg"
          class="flex items-center gap-1 px-3 py-1 rounded-full border text-sm font-bold transition-all duration-150"
          :class="[
            item.meta.colour,
            item.done   ? 'opacity-30' : '',
            item.active ? 'ring-2 ring-white/50 scale-105' : '',
            isLowDifficulty && hoveredSeg === item.seg ? 'scale-110 ring-2 ring-white/70' : '',
          ]"
          @mouseover="isLowDifficulty ? hoveredSeg = item.seg : null"
          @mouseleave="isLowDifficulty ? hoveredSeg = null : null"
        >
          {{ item.meta.emoji }} {{ item.meta.label }}
          <span v-if="item.done"   class="ml-1">✓</span>
          <span v-else-if="item.active && !finished" class="ml-1 animate-pulse">←</span>
        </div>
      </div>

      <!-- Step instructions -->
      <div v-if="!finished" class="text-center mb-4">
        <template v-if="isLowDifficulty">
          <p class="text-hp-gold/80 mb-2 text-sm">
            Step {{ stepIndex + 1 }} of {{ formula?.steps.length }}:
            Solve the
            <span class="font-bold" :class="SEGMENT_META[currentStep?.activeSegment]?.colour.split(' ')[0]">
              {{ SEGMENT_META[currentStep?.activeSegment]?.label }}
            </span>
            part
          </p>
          <p class="text-hp-gold text-xl mb-3 font-mono font-bold">
            {{ currentStep?.hint }}
          </p>
        </template>
        <template v-else>
          <p v-if="selectedSeg === null" class="text-hp-gold/80 mb-2 text-sm">
            👆 Click the
            <span class="font-bold" :class="SEGMENT_META[currentStep?.activeSegment]?.colour.split(' ')[0]">
              {{ SEGMENT_META[currentStep?.activeSegment]?.label }}
            </span>
            part of the formula
          </p>
          <p v-else class="text-hp-gold/80 mb-2 text-sm font-mono font-bold text-lg">
            {{ currentStep?.hint }}
          </p>
        </template>
      </div>

      <!-- Answer input -->
      <div v-if="!finished && (isLowDifficulty || selectedSeg !== null)" class="flex flex-col items-center gap-3">
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
            @click="advanceStep()"
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
          ❌ {{ wrongGuess }} is wrong – try again!
        </p>

        <button
          @click="advanceStep(true)"
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
