<script setup>
import { ref, computed, onMounted } from 'vue'

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

const movementOptions = ['Flip', 'Slide', 'Turn']

const shapePolygons = {
  triangle: '90,20 154,150 26,150',
  square: '40,40 140,40 140,140 40,140',
  rectangle: '28,55 152,55 152,125 28,125',
  kite: '90,16 146,86 90,164 38,86',
  shield: '90,18 146,44 132,122 90,162 48,122 34,44',
  flag: '38,32 142,54 118,96 142,138 38,116',
  hexagon: '90,20 143,52 143,128 90,160 37,128 37,52',
  arrow: '34,70 98,70 98,38 154,90 98,142 98,110 34,110'
}

const challengeTemplates = [
  {
    level: 1,
    mode: 'movement-choice',
    title: 'Mirror Shield Spell',
    question: 'Which spell changed the shield?',
    baseShape: 'shield',
    resultTransform: { flipX: true },
    answer: 'Flip',
    options: movementOptions,
    hint: 'A flip makes a mirror image, like looking into the Mirror of Erised.'
  },
  {
    level: 1,
    mode: 'movement-choice',
    title: 'Sliding Tile Charm',
    question: 'Which spell moved the square without turning it?',
    baseShape: 'square',
    resultTransform: { translateX: 42 },
    answer: 'Slide',
    options: movementOptions,
    hint: 'A slide moves a shape while it keeps facing the same way.'
  },
  {
    level: 2,
    mode: 'movement-choice',
    title: 'Turning Triangle Charm',
    question: 'Which spell changed the triangle by rotating it?',
    baseShape: 'triangle',
    resultTransform: { rotate: 90 },
    answer: 'Turn',
    options: movementOptions,
    hint: 'A turn rotates the shape around a point.'
  },
  {
    level: 2,
    mode: 'movement-cast',
    title: 'Slide to the Glowing Rune',
    question: 'Cast movement spells until the triangle sits on the glowing ghost shape.',
    baseShape: 'triangle',
    targetTransform: { translateX: 60, translateY: 0, rotate: 0, flipX: false },
    hint: 'Try one Slide → spell.'
  },
  {
    level: 3,
    mode: 'movement-cast',
    title: 'Turn the Hogwarts Tile',
    question: 'Turn the kite until it matches the ghost shape.',
    baseShape: 'kite',
    targetTransform: { translateX: 0, translateY: 0, rotate: 90, flipX: false },
    hint: 'Use a Turn spell. A quarter-turn is 90 degrees.'
  },
  {
    level: 3,
    mode: 'movement-cast',
    title: 'Flip the Flag',
    question: 'Flip the flag so it becomes the mirror image.',
    baseShape: 'flag',
    targetTransform: { translateX: 0, translateY: 0, rotate: 0, flipX: true },
    hint: 'Use the Flip spell once.'
  },
  {
    level: 5,
    mode: 'movement-cast',
    title: 'Advanced Transfiguration',
    question: 'Create the target by combining a turn, a slide, and a flip.',
    baseShape: 'arrow',
    targetTransform: { translateX: 60, translateY: 0, rotate: 90, flipX: true },
    hint: 'This one needs more than one spell: turn, flip, then slide.'
  },
  {
    level: 3,
    mode: 'mirror-grid',
    title: 'Butterfly Mirror Crest',
    question: 'Click the empty squares on the right side to complete the mirror image.',
    pattern: [[2, 0], [1, 1], [2, 1], [0, 2], [1, 3], [2, 4], [1, 5]],
    hint: 'Every filled square on the left needs a matching square the same distance from the mirror line.'
  },
  {
    level: 4,
    mode: 'mirror-grid',
    title: 'Symmetric Castle Window',
    question: 'Build the missing half of the castle window.',
    pattern: [[1, 0], [2, 0], [0, 1], [2, 1], [1, 2], [2, 3], [0, 4], [1, 5], [2, 5]],
    hint: 'Count how far each left square is from the golden mirror line.'
  },
  {
    level: 4,
    mode: 'creature-builder',
    title: 'Cut-Piece Fish',
    creature: 'fish',
    question: 'Drag the cut pieces into the ghost outlines to make a fish.',
    board: { width: 420, height: 300 },
    pieces: [
      { id: 'body', label: 'body diamond', points: '0,-46 72,0 0,46 -72,0', color: '#FFD700', start: { x: 72, y: 78, rotation: 0, flipX: false }, target: { x: 196, y: 144, rotation: 0, flipX: false } },
      { id: 'tail-top', label: 'tail top', points: '0,-34 42,34 -42,34', color: '#4ECDC4', start: { x: 74, y: 204, rotation: 90, flipX: false }, target: { x: 100, y: 116, rotation: -90, flipX: false } },
      { id: 'tail-bottom', label: 'tail bottom', points: '0,-34 42,34 -42,34', color: '#95E1D3', start: { x: 178, y: 236, rotation: -90, flipX: false }, target: { x: 100, y: 172, rotation: -90, flipX: true } },
      { id: 'fin', label: 'fin', points: '0,-28 34,28 -34,28', color: '#FF6B6B', start: { x: 296, y: 230, rotation: 180, flipX: false }, target: { x: 204, y: 104, rotation: 180, flipX: false } }
    ],
    hint: 'Match the ghost outlines. Rotate pieces if a triangle points the wrong way.'
  },
  {
    level: 6,
    mode: 'creature-builder',
    title: 'Tangram Owl Familiar',
    creature: 'owl',
    question: 'Re-order the cut shapes to create the owl familiar.',
    board: { width: 420, height: 320 },
    pieces: [
      { id: 'body', label: 'body triangle', points: '0,-56 64,58 -64,58', color: '#FFD700', start: { x: 72, y: 84, rotation: 180, flipX: false }, target: { x: 210, y: 180, rotation: 0, flipX: false } },
      { id: 'head', label: 'head square', points: '-38,-38 38,-38 38,38 -38,38', color: '#AA96DA', start: { x: 80, y: 230, rotation: 0, flipX: false }, target: { x: 210, y: 96, rotation: 45, flipX: false } },
      { id: 'left-wing', label: 'left wing', points: '0,-42 48,42 -48,42', color: '#4ECDC4', start: { x: 196, y: 254, rotation: -90, flipX: false }, target: { x: 148, y: 172, rotation: -35, flipX: false } },
      { id: 'right-wing', label: 'right wing', points: '0,-42 48,42 -48,42', color: '#95E1D3', start: { x: 314, y: 250, rotation: 90, flipX: false }, target: { x: 272, y: 172, rotation: 35, flipX: false } },
      { id: 'beak', label: 'beak', points: '0,-20 24,20 -24,20', color: '#F38181', start: { x: 330, y: 82, rotation: 180, flipX: false }, target: { x: 210, y: 130, rotation: 180, flipX: false } }
    ],
    hint: 'The owl is symmetric: wings belong left and right, the beak points down.'
  }
]

const currentChallenge = ref(null)
const selectedAnswer = ref('')
const score = ref(0)
const totalChallenges = ref(0)
const streak = ref(0)
const ravenclaw = ref(0)
const difficulty = ref(1)
const feedback = ref('')
const showFeedback = ref(false)
const currentTransform = ref(defaultTransform())
const selectedMirrorCells = ref([])
const currentPieces = ref([])
const selectedPieceId = ref(null)
const draggingPieceId = ref(null)
const dragOffset = ref({ x: 0, y: 0 })
const boardRef = ref(null)

const mirrorGrid = { width: 8, height: 6 }

const scorePercentage = computed(() => {
  if (totalChallenges.value === 0) return 0
  return Math.round((score.value / totalChallenges.value) * 100)
})

const difficultyLabel = computed(() => levelNames[difficulty.value] || 'Apprentice')

const challengeTypeLabel = computed(() => {
  if (!currentChallenge.value) return 'Shape Movements'

  switch (currentChallenge.value.mode) {
    case 'movement-choice': return 'Flip · Slide · Turn'
    case 'movement-cast': return 'Interactive Transformation'
    case 'mirror-grid': return 'Symmetry Builder'
    case 'creature-builder': return 'Cut-Shape Creature'
    default: return 'Shape Movements'
  }
})

const selectedPiece = computed(() => {
  return currentPieces.value.find(piece => piece.id === selectedPieceId.value) || null
})

function defaultTransform() {
  return { translateX: 0, translateY: 0, rotate: 0, flipX: false }
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

function shapePoints(shape) {
  return shapePolygons[shape] || shapePolygons.square
}

function movementChoiceTransform(transform = {}, side = 'before') {
  const baseX = side === 'after' ? 226 : 18
  const tx = transform.translateX || 0
  const ty = transform.translateY || 0
  const rotate = transform.rotate || 0
  const scaleX = transform.flipX ? -1 : 1

  return `translate(${baseX + tx} ${6 + ty}) translate(90 90) rotate(${rotate}) scale(${scaleX} 1) translate(-90 -90)`
}

function movementCastTransform(transform = {}) {
  const tx = transform.translateX || 0
  const ty = transform.translateY || 0
  const rotate = normalizeRotation(transform.rotate || 0)
  const scaleX = transform.flipX ? -1 : 1

  return `translate(${180 + tx} ${110 + ty}) rotate(${rotate}) scale(${scaleX} 1) translate(-90 -90)`
}

function sameTransform(a, b) {
  return (a.translateX || 0) === (b.translateX || 0)
    && (a.translateY || 0) === (b.translateY || 0)
    && normalizeRotation(a.rotate || 0) === normalizeRotation(b.rotate || 0)
    && Boolean(a.flipX) === Boolean(b.flipX)
}

function generateChallenge() {
  const possibleChallenges = challengeTemplates.filter(challenge => challenge.level <= difficulty.value)
  const randomChallenge = clone(possibleChallenges[Math.floor(Math.random() * possibleChallenges.length)])

  currentChallenge.value = randomChallenge
  selectedAnswer.value = ''
  feedback.value = ''
  showFeedback.value = false
  currentTransform.value = defaultTransform()
  selectedMirrorCells.value = []
  selectedPieceId.value = null
  draggingPieceId.value = null

  if (randomChallenge.mode === 'creature-builder') {
    currentPieces.value = randomChallenge.pieces.map(piece => ({
      ...piece,
      x: piece.start.x,
      y: piece.start.y,
      rotation: piece.start.rotation,
      flipX: piece.start.flipX
    }))
  } else {
    currentPieces.value = []
  }
}

function onDifficultyChange() {
  generateChallenge()
}

function selectOption(option) {
  if (showFeedback.value) return
  selectedAnswer.value = option
}

function applyMovementAction(action) {
  if (showFeedback.value) return

  switch (action) {
    case 'slide-left':
      currentTransform.value.translateX = Math.max(currentTransform.value.translateX - 60, -60)
      break
    case 'slide-right':
      currentTransform.value.translateX = Math.min(currentTransform.value.translateX + 60, 60)
      break
    case 'slide-up':
      currentTransform.value.translateY = Math.max(currentTransform.value.translateY - 45, -45)
      break
    case 'slide-down':
      currentTransform.value.translateY = Math.min(currentTransform.value.translateY + 45, 45)
      break
    case 'turn-left':
      currentTransform.value.rotate = normalizeRotation(currentTransform.value.rotate - 90)
      break
    case 'turn-right':
      currentTransform.value.rotate = normalizeRotation(currentTransform.value.rotate + 90)
      break
    case 'flip':
      currentTransform.value.flipX = !currentTransform.value.flipX
      break
    case 'reset':
      currentTransform.value = defaultTransform()
      break
  }
}

function mirrorTargetCells() {
  if (!currentChallenge.value?.pattern) return []
  return currentChallenge.value.pattern.map(([x, y]) => [mirrorGrid.width - 1 - x, y])
}

function cellKey(x, y) {
  return `${x}:${y}`
}

function isLeftPatternCell(x, y) {
  return currentChallenge.value?.pattern?.some(([cellX, cellY]) => cellX === x && cellY === y) || false
}

function isTargetMirrorCell(x, y) {
  return mirrorTargetCells().some(([cellX, cellY]) => cellX === x && cellY === y)
}

function isSelectedMirrorCell(x, y) {
  return selectedMirrorCells.value.includes(cellKey(x, y))
}

function toggleMirrorCell(x, y) {
  if (x < mirrorGrid.width / 2 || showFeedback.value) return

  const key = cellKey(x, y)
  if (selectedMirrorCells.value.includes(key)) {
    selectedMirrorCells.value = selectedMirrorCells.value.filter(selectedKey => selectedKey !== key)
  } else {
    selectedMirrorCells.value = [...selectedMirrorCells.value, key]
  }
}

function mirrorIsCorrect() {
  const targetKeys = mirrorTargetCells().map(([x, y]) => cellKey(x, y))
  if (targetKeys.length !== selectedMirrorCells.value.length) return false
  return targetKeys.every(key => selectedMirrorCells.value.includes(key))
}

function transformPiece(piece) {
  return `translate(${piece.x} ${piece.y}) rotate(${normalizeRotation(piece.rotation || 0)}) scale(${piece.flipX ? -1 : 1} 1)`
}

function transformTarget(target) {
  return `translate(${target.x} ${target.y}) rotate(${normalizeRotation(target.rotation || 0)}) scale(${target.flipX ? -1 : 1} 1)`
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
  dragOffset.value = {
    x: point.x - piece.x,
    y: point.y - piece.y
  }

  event.currentTarget.setPointerCapture?.(event.pointerId)
}

function dragPiece(event) {
  if (!draggingPieceId.value || !currentChallenge.value) return

  event.preventDefault()
  const piece = currentPieces.value.find(item => item.id === draggingPieceId.value)
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

function nudgeSelected(dx, dy) {
  if (!selectedPiece.value || showFeedback.value || !currentChallenge.value) return

  const board = currentChallenge.value.board
  selectedPiece.value.x = Math.min(Math.max(selectedPiece.value.x + dx, 30), board.width - 30)
  selectedPiece.value.y = Math.min(Math.max(selectedPiece.value.y + dy, 30), board.height - 30)
}

function pieceIsPlaced(piece) {
  const target = piece.target
  const distance = Math.hypot(piece.x - target.x, piece.y - target.y)

  return distance <= 26
    && rotationDistance(piece.rotation, target.rotation) <= 8
    && Boolean(piece.flipX) === Boolean(target.flipX)
}

function creatureIsCorrect() {
  return currentPieces.value.length > 0 && currentPieces.value.every(piece => pieceIsPlaced(piece))
}

function submitAnswer() {
  if (!currentChallenge.value || showFeedback.value) return
  if (currentChallenge.value.mode === 'movement-choice' && !selectedAnswer.value) return

  totalChallenges.value++

  let isCorrect = false
  switch (currentChallenge.value.mode) {
    case 'movement-choice':
      isCorrect = selectedAnswer.value === currentChallenge.value.answer
      break
    case 'movement-cast':
      isCorrect = sameTransform(currentTransform.value, currentChallenge.value.targetTransform)
      break
    case 'mirror-grid':
      isCorrect = mirrorIsCorrect()
      break
    case 'creature-builder':
      isCorrect = creatureIsCorrect()
      break
  }

  if (isCorrect) {
    score.value++
    streak.value++
    ravenclaw.value += 15

    const oldDifficulty = difficulty.value
    if (streak.value > 0 && streak.value % 4 === 0) {
      difficulty.value = Math.min(difficulty.value + 1, 10)
    }

    feedback.value = difficulty.value > oldDifficulty
      ? `🦅 Brilliant spellwork! 15 points to Ravenclaw. Level up to ${difficultyLabel.value}!`
      : '🦅 Brilliant spellwork! 15 points to Ravenclaw.'
    showFeedback.value = true

    setTimeout(() => {
      generateChallenge()
    }, 2400)
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

onMounted(() => {
  generateChallenge()
})
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
          <p class="text-hp-gold/70 text-sm">Ravenclaw Points</p>
          <p class="text-2xl font-bold text-blue-400">🦅 {{ ravenclaw }}</p>
        </div>
        <div>
          <p class="text-hp-gold/70 text-sm">Streak</p>
          <p class="text-2xl font-bold text-hp-gold">🔥 {{ streak }}</p>
        </div>
        <div>
          <p class="text-hp-gold/70 text-sm">Solved</p>
          <p class="text-2xl font-bold text-hp-gold">{{ score }}/{{ totalChallenges }}</p>
        </div>
        <div>
          <p class="text-hp-gold/70 text-sm">Score</p>
          <p class="text-2xl font-bold text-hp-gold">{{ scorePercentage }}%</p>
        </div>
      </div>
    </div>

    <div class="mb-6 flex items-center gap-3">
      <label for="movement-difficulty" class="text-hp-gold font-hp text-lg">
        Difficulty:
      </label>
      <select
        id="movement-difficulty"
        v-model="difficulty"
        @change="onDifficultyChange"
        class="bg-hp-navy/80 text-hp-gold border-2 border-hp-gold/50 rounded-lg px-4 py-2 font-hp focus:outline-none focus:ring-2 focus:ring-hp-gold focus:border-transparent backdrop-blur"
      >
        <option :value="1">Apprentice (1)</option>
        <option :value="2">Novice (2)</option>
        <option :value="3">Adept (3)</option>
        <option :value="4">Expert (4)</option>
        <option :value="5">Master (5)</option>
        <option :value="6">Grandmaster (6)</option>
        <option :value="7">Archmage (7)</option>
        <option :value="8">Legend (8)</option>
        <option :value="9">Mythical (9)</option>
        <option :value="10">Godlike (10)</option>
      </select>
    </div>

    <div v-if="currentChallenge" class="bg-gradient-to-br from-hp-burgundy/80 to-purple-900/80 backdrop-blur rounded-xl p-6 sm:p-8 w-full max-w-4xl border-4 border-hp-gold/50 shadow-2xl">
      <div class="text-center mb-6">
        <div class="inline-block bg-hp-navy/50 px-6 py-2 rounded-lg border border-hp-gold/30">
          <p class="text-hp-gold/70 text-sm mb-1">{{ challengeTypeLabel }}</p>
          <p class="text-sm text-hp-gold/60">{{ difficultyLabel }} Level · {{ currentChallenge.title }}</p>
        </div>
      </div>

      <p class="text-3xl font-hp text-hp-gold text-center mb-6 drop-shadow-lg">
        {{ currentChallenge.question }}
      </p>

      <div v-if="currentChallenge.mode === 'movement-choice'" class="space-y-6">
        <svg viewBox="0 0 420 190" class="w-full max-w-2xl mx-auto rounded-xl bg-hp-navy/70 border-2 border-hp-gold/30 shadow-lg">
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#FFD700" />
            </marker>
          </defs>
          <g :transform="movementChoiceTransform({}, 'before')">
            <polygon :points="shapePoints(currentChallenge.baseShape)" fill="#FFD700" stroke="#FFF3B0" stroke-width="4" />
          </g>
          <line x1="186" y1="95" x2="230" y2="95" stroke="#FFD700" stroke-width="4" marker-end="url(#arrowhead)" />
          <g :transform="movementChoiceTransform(currentChallenge.resultTransform, 'after')">
            <polygon :points="shapePoints(currentChallenge.baseShape)" fill="#4ECDC4" stroke="#FFF3B0" stroke-width="4" />
          </g>
        </svg>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            v-for="option in currentChallenge.options"
            :key="option"
            @click="selectOption(option)"
            :class="[
              'px-6 py-4 text-xl font-hp rounded-lg border-2 transition-all duration-300 hover:scale-105',
              selectedAnswer === option
                ? 'bg-hp-gold text-hp-navy border-hp-gold shadow-lg'
                : 'bg-white/10 text-hp-gold border-hp-gold/50 hover:bg-hp-gold/20'
            ]"
          >
            {{ option }}
          </button>
        </div>
      </div>

      <div v-if="currentChallenge.mode === 'movement-cast'" class="space-y-6">
        <svg viewBox="0 0 360 220" class="w-full max-w-2xl mx-auto rounded-xl bg-hp-navy/70 border-2 border-hp-gold/30 shadow-lg">
          <line x1="180" y1="12" x2="180" y2="208" stroke="#FFD700" stroke-width="2" stroke-dasharray="8 8" opacity="0.25" />
          <g :transform="movementCastTransform(currentChallenge.targetTransform)" opacity="0.28">
            <polygon :points="shapePoints(currentChallenge.baseShape)" fill="#FFFFFF" stroke="#FFD700" stroke-width="5" stroke-dasharray="8 6" />
          </g>
          <g :transform="movementCastTransform(currentTransform)">
            <polygon :points="shapePoints(currentChallenge.baseShape)" fill="#FFD700" stroke="#FFF3B0" stroke-width="4" />
          </g>
        </svg>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button @click="applyMovementAction('flip')" class="movement-button">🪞 Flip</button>
          <button @click="applyMovementAction('turn-left')" class="movement-button">↺ Turn</button>
          <button @click="applyMovementAction('turn-right')" class="movement-button">↻ Turn</button>
          <button @click="applyMovementAction('reset')" class="movement-button">♻ Reset</button>
          <button @click="applyMovementAction('slide-left')" class="movement-button">← Slide</button>
          <button @click="applyMovementAction('slide-right')" class="movement-button">Slide →</button>
          <button @click="applyMovementAction('slide-up')" class="movement-button">↑ Slide</button>
          <button @click="applyMovementAction('slide-down')" class="movement-button">Slide ↓</button>
        </div>
      </div>

      <div v-if="currentChallenge.mode === 'mirror-grid'" class="space-y-6">
        <div class="grid gap-1 mx-auto max-w-md" :style="{ gridTemplateColumns: `repeat(${mirrorGrid.width}, minmax(0, 1fr))` }">
          <button
            v-for="cell in mirrorGrid.width * mirrorGrid.height"
            :key="cell"
            @click="toggleMirrorCell((cell - 1) % mirrorGrid.width, Math.floor((cell - 1) / mirrorGrid.width))"
            :class="[
              'aspect-square rounded-md border transition-all duration-200',
              ((cell - 1) % mirrorGrid.width) === 3 ? 'border-r-4 border-r-hp-gold' : 'border-hp-gold/25',
              isLeftPatternCell((cell - 1) % mirrorGrid.width, Math.floor((cell - 1) / mirrorGrid.width))
                ? 'bg-hp-gold shadow-lg cursor-default'
                : isSelectedMirrorCell((cell - 1) % mirrorGrid.width, Math.floor((cell - 1) / mirrorGrid.width))
                  ? 'bg-blue-400 scale-95 shadow-lg'
                  : ((cell - 1) % mirrorGrid.width) >= mirrorGrid.width / 2
                    ? 'bg-white/10 hover:bg-hp-gold/20 cursor-pointer'
                    : 'bg-white/5 cursor-default'
            ]"
            :aria-label="`Mirror grid cell ${cell}`"
          />
        </div>
        <p class="text-center text-hp-gold/70">
          The golden line is the mirror. Only the right side is clickable.
        </p>
      </div>

      <div v-if="currentChallenge.mode === 'creature-builder'" class="space-y-5">
        <svg
          ref="boardRef"
          :viewBox="`0 0 ${currentChallenge.board.width} ${currentChallenge.board.height}`"
          class="w-full max-w-3xl mx-auto rounded-xl bg-hp-navy/70 border-2 border-hp-gold/30 shadow-lg touch-none select-none"
          @pointermove="dragPiece"
          @pointerup="stopDrag"
          @pointerleave="stopDrag"
        >
          <rect :width="currentChallenge.board.width" :height="currentChallenge.board.height" fill="transparent" />

          <g
            v-for="piece in currentChallenge.pieces"
            :key="`target-${piece.id}`"
            :transform="transformTarget(piece.target)"
            opacity="0.26"
          >
            <polygon :points="piece.points" fill="#FFFFFF" stroke="#FFD700" stroke-width="4" stroke-dasharray="8 6" />
          </g>

          <g
            v-for="piece in currentPieces"
            :key="piece.id"
            :transform="transformPiece(piece)"
            class="cursor-grab active:cursor-grabbing transition-opacity"
            :opacity="selectedPieceId && selectedPieceId !== piece.id ? 0.78 : 1"
            @pointerdown.stop="startDrag($event, piece)"
          >
            <polygon
              :points="piece.points"
              :fill="piece.color"
              :stroke="pieceIsPlaced(piece) ? '#86EFAC' : '#FFF3B0'"
              stroke-width="4"
            />
          </g>
        </svg>

        <div class="bg-hp-navy/50 rounded-lg border border-hp-gold/20 p-4">
          <p class="text-center text-hp-gold/80 mb-3">
            Selected piece: <span class="font-bold text-hp-gold">{{ selectedPiece ? selectedPiece.label : 'tap or drag a piece' }}</span>
          </p>
          <div class="grid grid-cols-2 sm:grid-cols-6 gap-3">
            <button @click="rotateSelected(-45)" :disabled="!selectedPiece" class="movement-button disabled:opacity-40">↺ 45°</button>
            <button @click="rotateSelected(45)" :disabled="!selectedPiece" class="movement-button disabled:opacity-40">45° ↻</button>
            <button @click="flipSelected" :disabled="!selectedPiece" class="movement-button disabled:opacity-40">🪞 Flip</button>
            <button @click="nudgeSelected(-8, 0)" :disabled="!selectedPiece" class="movement-button disabled:opacity-40">← Nudge</button>
            <button @click="nudgeSelected(8, 0)" :disabled="!selectedPiece" class="movement-button disabled:opacity-40">Nudge →</button>
            <button @click="nudgeSelected(0, -8)" :disabled="!selectedPiece" class="movement-button disabled:opacity-40">↑ Nudge</button>
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
