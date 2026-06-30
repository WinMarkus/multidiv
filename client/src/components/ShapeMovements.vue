<script setup>
import { computed, onMounted, ref } from 'vue'
import { useTheme } from '../composables/useTheme'

const { activeHouseName, activeHouseEmoji, activeHousePointsLabel } = useTheme()

const levelNames = {
  1: 'Apprentice',
  2: 'Novice',
  3: 'Adept',
  4: 'Expert',
  5: 'Master',
  6: 'Grandmaster',
  7: 'Archmage',
  8: 'Legend',
  9: 'Mythical',
  10: 'Godlike'
}

const shapePoints = {
  triangle: '90,18 158,154 22,154',
  square: '34,34 146,34 146,146 34,146',
  kite: '90,14 148,88 90,166 32,88',
  shield: '90,16 146,44 132,124 90,164 48,124 34,44',
  flag: '34,34 148,56 120,96 148,138 34,116',
  arrow: '30,68 98,68 98,36 156,90 98,144 98,112 30,112'
}

const challenges = [
  {
    level: 1,
    mode: 'choice',
    title: 'Mirror Shield Spell',
    question: 'Which spell changed the shield?',
    shape: 'shield',
    answer: 'Flip',
    target: { x: 0, y: 0, rotation: 0, flipX: true },
    hint: 'A flip creates a mirror image.'
  },
  {
    level: 1,
    mode: 'choice',
    title: 'Sliding Tile Charm',
    question: 'Which spell moved the square without turning it?',
    shape: 'square',
    answer: 'Slide',
    target: { x: 50, y: 0, rotation: 0, flipX: false },
    hint: 'A slide moves a shape but keeps it facing the same way.'
  },
  {
    level: 2,
    mode: 'choice',
    title: 'Turning Triangle Charm',
    question: 'Which spell changed the triangle by rotating it?',
    shape: 'triangle',
    answer: 'Turn',
    target: { x: 0, y: 0, rotation: 90, flipX: false },
    hint: 'A turn rotates the shape around a point.'
  },
  {
    level: 2,
    mode: 'cast',
    title: 'Slide to the Glowing Rune',
    question: 'Cast movement spells until the triangle sits on the glowing ghost shape.',
    shape: 'triangle',
    target: { x: 60, y: 0, rotation: 0, flipX: false },
    hint: 'Use Slide → once.'
  },
  {
    level: 3,
    mode: 'cast',
    title: 'Turn the Hogwarts Tile',
    question: 'Turn the kite until it matches the ghost shape.',
    shape: 'kite',
    target: { x: 0, y: 0, rotation: 90, flipX: false },
    hint: 'Use a 90° turn.'
  },
  {
    level: 3,
    mode: 'cast',
    title: 'Flip the Flag',
    question: 'Flip the flag so it becomes the mirror image.',
    shape: 'flag',
    target: { x: 0, y: 0, rotation: 0, flipX: true },
    hint: 'Use the Flip spell once.'
  },
  {
    level: 5,
    mode: 'cast',
    title: 'Advanced Transfiguration',
    question: 'Create the target by combining a turn, a slide, and a flip.',
    shape: 'arrow',
    target: { x: 60, y: 0, rotation: 90, flipX: true },
    hint: 'Try Turn, Flip, and Slide →.'
  },
  {
    level: 3,
    mode: 'mirror',
    title: 'Butterfly Mirror Crest',
    question: 'Click the empty squares on the right side to complete the mirror image.',
    pattern: [[2, 0], [1, 1], [2, 1], [0, 2], [1, 3], [2, 4], [1, 5]],
    hint: 'Each filled square needs a matching square across the golden mirror line.'
  },
  {
    level: 4,
    mode: 'mirror',
    title: 'Symmetric Castle Window',
    question: 'Build the missing half of the castle window.',
    pattern: [[1, 0], [2, 0], [0, 1], [2, 1], [1, 2], [2, 3], [0, 4], [1, 5], [2, 5]],
    hint: 'Count how far each square is from the mirror line.'
  },
  {
    level: 4,
    mode: 'creature',
    title: 'Cut-Piece Fish',
    question: 'Drag, rotate, and flip the cut pieces into the ghost outlines to make a fish.',
    board: { width: 420, height: 300 },
    pieces: [
      { id: 'body', label: 'body diamond', points: '0,-46 72,0 0,46 -72,0', color: '#FFD700', start: { x: 72, y: 78, rotation: 0, flipX: false }, target: { x: 196, y: 144, rotation: 0, flipX: false } },
      { id: 'tail-top', label: 'tail top', points: '0,-34 42,34 -42,34', color: '#4ECDC4', start: { x: 74, y: 204, rotation: 90, flipX: false }, target: { x: 100, y: 116, rotation: 270, flipX: false } },
      { id: 'tail-bottom', label: 'tail bottom', points: '0,-34 42,34 -42,34', color: '#95E1D3', start: { x: 178, y: 236, rotation: 270, flipX: false }, target: { x: 100, y: 172, rotation: 270, flipX: true } },
      { id: 'fin', label: 'fin', points: '0,-28 34,28 -34,28', color: '#FF6B6B', start: { x: 296, y: 230, rotation: 180, flipX: false }, target: { x: 204, y: 104, rotation: 180, flipX: false } }
    ],
    hint: 'Match each colored piece to its ghost outline.'
  },
  {
    level: 6,
    mode: 'creature',
    title: 'Tangram Owl Familiar',
    question: 'Re-order the cut shapes to create the owl familiar.',
    board: { width: 420, height: 320 },
    pieces: [
      { id: 'body', label: 'body triangle', points: '0,-56 64,58 -64,58', color: '#FFD700', start: { x: 72, y: 84, rotation: 180, flipX: false }, target: { x: 210, y: 180, rotation: 0, flipX: false } },
      { id: 'head', label: 'head square', points: '-38,-38 38,-38 38,38 -38,38', color: '#AA96DA', start: { x: 80, y: 230, rotation: 0, flipX: false }, target: { x: 210, y: 96, rotation: 45, flipX: false } },
      { id: 'left-wing', label: 'left wing', points: '0,-42 48,42 -48,42', color: '#4ECDC4', start: { x: 196, y: 254, rotation: 270, flipX: false }, target: { x: 148, y: 172, rotation: 325, flipX: false } },
      { id: 'right-wing', label: 'right wing', points: '0,-42 48,42 -48,42', color: '#95E1D3', start: { x: 314, y: 250, rotation: 90, flipX: false }, target: { x: 272, y: 172, rotation: 35, flipX: false } },
      { id: 'beak', label: 'beak', points: '0,-20 24,20 -24,20', color: '#F38181', start: { x: 330, y: 82, rotation: 180, flipX: false }, target: { x: 210, y: 130, rotation: 180, flipX: false } }
    ],
    hint: 'The owl is symmetric: wings belong left and right, the beak points down.'
  }
]

const difficulty = ref(1)
const currentChallenge = ref(null)
const selectedAnswer = ref('')
const transform = ref(defaultTransform())
const selectedMirrorCells = ref([])
const pieces = ref([])
const selectedPieceId = ref(null)
const draggingPieceId = ref(null)
const dragOffset = ref({ x: 0, y: 0 })
const boardRef = ref(null)
const showFeedback = ref(false)
const feedback = ref('')
const streak = ref(0)
const score = ref(0)
const attempts = ref(0)
const housePoints = ref(0)

const mirrorGrid = { width: 8, height: 6 }

const difficultyLabel = computed(() => levelNames[difficulty.value] || 'Apprentice')
const scorePercentage = computed(() => attempts.value === 0 ? 0 : Math.round((score.value / attempts.value) * 100))
const selectedPiece = computed(() => pieces.value.find(piece => piece.id === selectedPieceId.value) || null)
const typeLabel = computed(() => {
  if (!currentChallenge.value) return 'Shape Movements'
  return {
    choice: 'Flip · Slide · Turn',
    cast: 'Interactive Transformation',
    mirror: 'Symmetry Builder',
    creature: 'Cut-Shape Creature'
  }[currentChallenge.value.mode]
})

function defaultTransform() {
  return { x: 0, y: 0, rotation: 0, flipX: false }
}

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

function normalizeRotation(rotation) {
  return ((rotation % 360) + 360) % 360
}

function rotationDistance(a, b) {
  const diff = Math.abs(normalizeRotation(a) - normalizeRotation(b))
  return Math.min(diff, 360 - diff)
}

function newChallenge() {
  const available = challenges.filter(challenge => challenge.level <= difficulty.value)
  currentChallenge.value = clone(available[Math.floor(Math.random() * available.length)])
  selectedAnswer.value = ''
  transform.value = defaultTransform()
  selectedMirrorCells.value = []
  selectedPieceId.value = null
  draggingPieceId.value = null
  showFeedback.value = false
  feedback.value = ''

  pieces.value = currentChallenge.value.mode === 'creature'
    ? currentChallenge.value.pieces.map(piece => ({ ...piece, ...piece.start }))
    : []
}

function onDifficultyChange() {
  newChallenge()
}

function shapeTransform(baseX, baseY, state = defaultTransform()) {
  const scaleX = state.flipX ? -1 : 1
  return `translate(${baseX + state.x} ${baseY + state.y}) translate(90 90) rotate(${normalizeRotation(state.rotation)}) scale(${scaleX} 1) translate(-90 -90)`
}

function sameTransform(a, b) {
  return a.x === b.x
    && a.y === b.y
    && normalizeRotation(a.rotation) === normalizeRotation(b.rotation)
    && Boolean(a.flipX) === Boolean(b.flipX)
}

function castSpell(action) {
  if (showFeedback.value) return

  if (action === 'flip') transform.value.flipX = !transform.value.flipX
  if (action === 'left') transform.value.x = Math.max(transform.value.x - 60, -60)
  if (action === 'right') transform.value.x = Math.min(transform.value.x + 60, 60)
  if (action === 'up') transform.value.y = Math.max(transform.value.y - 45, -45)
  if (action === 'down') transform.value.y = Math.min(transform.value.y + 45, 45)
  if (action === 'turn-left') transform.value.rotation = normalizeRotation(transform.value.rotation - 90)
  if (action === 'turn-right') transform.value.rotation = normalizeRotation(transform.value.rotation + 90)
  if (action === 'reset') transform.value = defaultTransform()
}

function cellKey(x, y) {
  return `${x}:${y}`
}

function isLeftCell(x, y) {
  return currentChallenge.value?.pattern?.some(([cellX, cellY]) => cellX === x && cellY === y) || false
}

function targetMirrorKeys() {
  if (!currentChallenge.value?.pattern) return []
  return currentChallenge.value.pattern.map(([x, y]) => cellKey(mirrorGrid.width - 1 - x, y))
}

function isSelectedCell(x, y) {
  return selectedMirrorCells.value.includes(cellKey(x, y))
}

function toggleCell(x, y) {
  if (x < mirrorGrid.width / 2 || showFeedback.value) return

  const key = cellKey(x, y)
  selectedMirrorCells.value = selectedMirrorCells.value.includes(key)
    ? selectedMirrorCells.value.filter(selectedKey => selectedKey !== key)
    : [...selectedMirrorCells.value, key]
}

function mirrorIsCorrect() {
  const targetKeys = targetMirrorKeys()
  return targetKeys.length === selectedMirrorCells.value.length
    && targetKeys.every(key => selectedMirrorCells.value.includes(key))
}

function pieceTransform(piece) {
  return `translate(${piece.x} ${piece.y}) rotate(${normalizeRotation(piece.rotation)}) scale(${piece.flipX ? -1 : 1} 1)`
}

function svgPoint(event) {
  const rect = boardRef.value.getBoundingClientRect()
  const board = currentChallenge.value.board
  return {
    x: ((event.clientX - rect.left) / rect.width) * board.width,
    y: ((event.clientY - rect.top) / rect.height) * board.height
  }
}

function startDrag(event, piece) {
  if (showFeedback.value) return

  selectedPieceId.value = piece.id
  draggingPieceId.value = piece.id
  const point = svgPoint(event)
  dragOffset.value = { x: point.x - piece.x, y: point.y - piece.y }
  event.currentTarget.setPointerCapture?.(event.pointerId)
}

function dragPiece(event) {
  if (!draggingPieceId.value) return

  event.preventDefault()
  const piece = pieces.value.find(item => item.id === draggingPieceId.value)
  if (!piece) return

  const point = svgPoint(event)
  const board = currentChallenge.value.board
  piece.x = Math.min(Math.max(point.x - dragOffset.value.x, 30), board.width - 30)
  piece.y = Math.min(Math.max(point.y - dragOffset.value.y, 30), board.height - 30)
}

function stopDrag() {
  draggingPieceId.value = null
}

function rotateSelected(delta) {
  if (!selectedPiece.value || showFeedback.value) return
  selectedPiece.value.rotation = normalizeRotation(selectedPiece.value.rotation + delta)
}

function flipSelected() {
  if (!selectedPiece.value || showFeedback.value) return
  selectedPiece.value.flipX = !selectedPiece.value.flipX
}

function pieceIsPlaced(piece) {
  const target = piece.target
  return Math.hypot(piece.x - target.x, piece.y - target.y) <= 26
    && rotationDistance(piece.rotation, target.rotation) <= 8
    && Boolean(piece.flipX) === Boolean(target.flipX)
}

function creatureIsCorrect() {
  return pieces.value.length > 0 && pieces.value.every(pieceIsPlaced)
}

function submitAnswer() {
  if (!currentChallenge.value || showFeedback.value) return
  if (currentChallenge.value.mode === 'choice' && !selectedAnswer.value) return

  attempts.value++

  let isCorrect = false
  if (currentChallenge.value.mode === 'choice') isCorrect = selectedAnswer.value === currentChallenge.value.answer
  if (currentChallenge.value.mode === 'cast') isCorrect = sameTransform(transform.value, currentChallenge.value.target)
  if (currentChallenge.value.mode === 'mirror') isCorrect = mirrorIsCorrect()
  if (currentChallenge.value.mode === 'creature') isCorrect = creatureIsCorrect()

  if (isCorrect) {
    score.value++
    streak.value++
    housePoints.value += 15

    const oldDifficulty = difficulty.value
    if (streak.value > 0 && streak.value % 4 === 0) {
      difficulty.value = Math.min(difficulty.value + 1, 10)
    }

    feedback.value = difficulty.value > oldDifficulty
      ? `${activeHouseEmoji.value} Brilliant spellwork! 15 points to ${activeHouseName.value}. Level up to ${difficultyLabel.value}!`
      : `${activeHouseEmoji.value} Brilliant spellwork! 15 points to ${activeHouseName.value}.`

    showFeedback.value = true
    setTimeout(newChallenge, 2400)
  } else {
    streak.value = 0
    feedback.value = `Not quite yet. ${currentChallenge.value.hint}`
    showFeedback.value = true

    setTimeout(() => {
      showFeedback.value = false
      feedback.value = ''
    }, 3200)
  }
}

onMounted(newChallenge)
</script>

<template>
  <div class="container mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-center">
    <div class="absolute top-4 left-4 flex gap-2">
      <router-link
        to="/"
        class="bg-hp-burgundy hover:bg-hp-burgundy/80 text-hp-gold font-hp px-4 py-2 rounded-lg border-2 border-hp-gold/50 transition-all duration-300 hover:scale-105 shadow-lg"
      >
        ← Back
      </router-link>
      <router-link
        to="/shapes-quiz"
        class="bg-hp-burgundy hover:bg-hp-burgundy/80 text-hp-gold font-hp px-4 py-2 rounded-lg border-2 border-hp-gold/50 transition-all duration-300 hover:scale-105 shadow-lg"
      >
        📐 Shapes Quiz
      </router-link>
    </div>

    <div class="text-center mb-8 max-w-4xl">
      <h1 class="text-5xl font-hp text-hp-gold mb-2 drop-shadow-lg">
        🪄 Shape Movement Charms 🪞
      </h1>
      <p class="text-xl text-hp-gold/80">
        Flip, slide, turn, mirror, and transfigure cut shapes into new creatures.
      </p>
    </div>

    <div class="bg-hp-navy/50 backdrop-blur rounded-lg p-4 mb-6 w-full max-w-4xl border-2 border-hp-gold/30">
      <div class="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
        <div>
          <p class="text-hp-gold/70 text-sm">Level</p>
          <p class="text-2xl font-bold text-hp-gold">{{ difficulty }}</p>
        </div>
        <div>
          <p class="text-hp-gold/70 text-sm">{{ activeHousePointsLabel }}</p>
          <p class="text-2xl font-bold text-hp-gold">{{ activeHouseEmoji }} {{ housePoints }}</p>
        </div>
        <div>
          <p class="text-hp-gold/70 text-sm">Streak</p>
          <p class="text-2xl font-bold text-hp-gold">🔥 {{ streak }}</p>
        </div>
        <div>
          <p class="text-hp-gold/70 text-sm">Solved</p>
          <p class="text-2xl font-bold text-hp-gold">{{ score }}/{{ attempts }}</p>
        </div>
        <div>
          <p class="text-hp-gold/70 text-sm">Score</p>
          <p class="text-2xl font-bold text-hp-gold">{{ scorePercentage }}%</p>
        </div>
      </div>
    </div>

    <div class="mb-6 flex items-center gap-3">
      <label for="movement-difficulty" class="text-hp-gold font-hp text-lg">Difficulty:</label>
      <select
        id="movement-difficulty"
        v-model="difficulty"
        @change="onDifficultyChange"
        class="bg-hp-navy/80 text-hp-gold border-2 border-hp-gold/50 rounded-lg px-4 py-2 font-hp focus:outline-none focus:ring-2 focus:ring-hp-gold focus:border-transparent backdrop-blur"
      >
        <option v-for="(_, level) in levelNames" :key="level" :value="Number(level)">
          {{ levelNames[level] }} ({{ level }})
        </option>
      </select>
    </div>

    <div v-if="currentChallenge" class="bg-gradient-to-br from-hp-burgundy/80 to-purple-900/80 backdrop-blur rounded-xl p-6 sm:p-8 w-full max-w-4xl border-4 border-hp-gold/50 shadow-2xl">
      <div class="text-center mb-6">
        <div class="inline-block bg-hp-navy/50 px-6 py-2 rounded-lg border border-hp-gold/30">
          <p class="text-hp-gold/70 text-sm mb-1">{{ typeLabel }}</p>
          <p class="text-sm text-hp-gold/60">{{ difficultyLabel }} Level · {{ currentChallenge.title }}</p>
        </div>
      </div>

      <p class="text-3xl font-hp text-hp-gold text-center mb-6 drop-shadow-lg">
        {{ currentChallenge.question }}
      </p>

      <div v-if="currentChallenge.mode === 'choice'" class="space-y-6">
        <svg viewBox="0 0 420 190" class="w-full max-w-2xl mx-auto rounded-xl bg-hp-navy/70 border-2 border-hp-gold/30 shadow-lg">
          <defs>
            <marker id="movement-arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#FFD700" />
            </marker>
          </defs>
          <g :transform="shapeTransform(18, 6)">
            <polygon :points="shapePoints[currentChallenge.shape]" fill="#FFD700" stroke="#FFF3B0" stroke-width="4" />
          </g>
          <line x1="186" y1="95" x2="230" y2="95" stroke="#FFD700" stroke-width="4" marker-end="url(#movement-arrowhead)" />
          <g :transform="shapeTransform(226, 6, currentChallenge.target)">
            <polygon :points="shapePoints[currentChallenge.shape]" fill="#4ECDC4" stroke="#FFF3B0" stroke-width="4" />
          </g>
        </svg>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            v-for="option in ['Flip', 'Slide', 'Turn']"
            :key="option"
            @click="selectedAnswer = option"
            :class="[
              'px-6 py-4 text-xl font-hp rounded-lg border-2 transition-all duration-300 hover:scale-105',
              selectedAnswer === option ? 'bg-hp-gold text-hp-navy border-hp-gold shadow-lg' : 'bg-white/10 text-hp-gold border-hp-gold/50 hover:bg-hp-gold/20'
            ]"
          >
            {{ option }}
          </button>
        </div>
      </div>

      <div v-if="currentChallenge.mode === 'cast'" class="space-y-6">
        <svg viewBox="0 0 360 220" class="w-full max-w-2xl mx-auto rounded-xl bg-hp-navy/70 border-2 border-hp-gold/30 shadow-lg">
          <g :transform="shapeTransform(90, 20, currentChallenge.target)" opacity="0.28">
            <polygon :points="shapePoints[currentChallenge.shape]" fill="#FFFFFF" stroke="#FFD700" stroke-width="5" stroke-dasharray="8 6" />
          </g>
          <g :transform="shapeTransform(90, 20, transform)">
            <polygon :points="shapePoints[currentChallenge.shape]" fill="#FFD700" stroke="#FFF3B0" stroke-width="4" />
          </g>
        </svg>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button @click="castSpell('flip')" class="movement-button">🪞 Flip</button>
          <button @click="castSpell('turn-left')" class="movement-button">↺ Turn</button>
          <button @click="castSpell('turn-right')" class="movement-button">↻ Turn</button>
          <button @click="castSpell('reset')" class="movement-button">♻ Reset</button>
          <button @click="castSpell('left')" class="movement-button">← Slide</button>
          <button @click="castSpell('right')" class="movement-button">Slide →</button>
          <button @click="castSpell('up')" class="movement-button">↑ Slide</button>
          <button @click="castSpell('down')" class="movement-button">Slide ↓</button>
        </div>
      </div>

      <div v-if="currentChallenge.mode === 'mirror'" class="space-y-6">
        <div class="grid gap-1 mx-auto max-w-md" :style="{ gridTemplateColumns: `repeat(${mirrorGrid.width}, minmax(0, 1fr))` }">
          <button
            v-for="cell in mirrorGrid.width * mirrorGrid.height"
            :key="cell"
            @click="toggleCell((cell - 1) % mirrorGrid.width, Math.floor((cell - 1) / mirrorGrid.width))"
            :class="[
              'aspect-square rounded-md border transition-all duration-200',
              ((cell - 1) % mirrorGrid.width) === 3 ? 'border-r-4 border-r-hp-gold' : 'border-hp-gold/25',
              isLeftCell((cell - 1) % mirrorGrid.width, Math.floor((cell - 1) / mirrorGrid.width))
                ? 'bg-hp-gold shadow-lg cursor-default'
                : isSelectedCell((cell - 1) % mirrorGrid.width, Math.floor((cell - 1) / mirrorGrid.width))
                  ? 'bg-blue-400 scale-95 shadow-lg'
                  : ((cell - 1) % mirrorGrid.width) >= mirrorGrid.width / 2
                    ? 'bg-white/10 hover:bg-hp-gold/20 cursor-pointer'
                    : 'bg-white/5 cursor-default'
            ]"
            :aria-label="`Mirror grid cell ${cell}`"
          />
        </div>
        <p class="text-center text-hp-gold/70">The golden line is the mirror. Only the right side is clickable.</p>
      </div>

      <div v-if="currentChallenge.mode === 'creature'" class="space-y-5">
        <svg
          ref="boardRef"
          :viewBox="`0 0 ${currentChallenge.board.width} ${currentChallenge.board.height}`"
          class="w-full max-w-3xl mx-auto rounded-xl bg-hp-navy/70 border-2 border-hp-gold/30 shadow-lg touch-none select-none"
          @pointermove="dragPiece"
          @pointerup="stopDrag"
          @pointerleave="stopDrag"
        >
          <rect :width="currentChallenge.board.width" :height="currentChallenge.board.height" fill="transparent" />

          <g v-for="piece in currentChallenge.pieces" :key="`target-${piece.id}`" :transform="pieceTransform(piece.target)" opacity="0.26">
            <polygon :points="piece.points" fill="#FFFFFF" stroke="#FFD700" stroke-width="4" stroke-dasharray="8 6" />
          </g>

          <g
            v-for="piece in pieces"
            :key="piece.id"
            :transform="pieceTransform(piece)"
            class="cursor-grab active:cursor-grabbing"
            @pointerdown.stop="startDrag($event, piece)"
          >
            <polygon :points="piece.points" :fill="piece.color" :stroke="pieceIsPlaced(piece) ? '#86EFAC' : '#FFF3B0'" stroke-width="4" />
          </g>
        </svg>

        <div class="bg-hp-navy/50 rounded-lg border border-hp-gold/20 p-4">
          <p class="text-center text-hp-gold/80 mb-3">
            Selected piece: <span class="font-bold text-hp-gold">{{ selectedPiece ? selectedPiece.label : 'tap or drag a piece' }}</span>
          </p>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <button @click="rotateSelected(-45)" :disabled="!selectedPiece" class="movement-button disabled:opacity-40">↺ 45°</button>
            <button @click="rotateSelected(45)" :disabled="!selectedPiece" class="movement-button disabled:opacity-40">45° ↻</button>
            <button @click="flipSelected" :disabled="!selectedPiece" class="movement-button disabled:opacity-40">🪞 Flip</button>
          </div>
        </div>
      </div>

      <div class="mt-8 flex flex-col items-center gap-4">
        <button
          @click="submitAnswer"
          class="w-full max-w-md bg-hp-gold hover:bg-hp-bronze text-hp-navy font-hp font-bold px-8 py-4 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg text-xl"
        >
          Cast Shape Spell ✨
        </button>

        <div v-if="showFeedback" class="text-center">
          <p class="text-2xl font-hp" :class="feedback.includes('Brilliant') ? 'text-green-400' : 'text-yellow-400'">
            {{ feedback }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.movement-button {
  @apply bg-white/10 text-hp-gold border-2 border-hp-gold/50 rounded-lg px-4 py-3 font-hp font-bold transition-all duration-300 hover:bg-hp-gold/20 hover:scale-105;
}
</style>
