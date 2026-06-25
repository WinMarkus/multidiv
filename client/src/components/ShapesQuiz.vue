<script setup>
import { ref, computed, onMounted } from 'vue'
import Shape2D from './Shape2D.vue'
import Shape3D from './Shape3D.vue'

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

const questions = [
  // Level 1 - basic 2D recognition
  { level: 1, question: 'What shape is this?', answer: 'Triangle', type: '2D-visual', shape: 'triangle', options: ['Square', 'Triangle', 'Circle', 'Pentagon'] },
  { level: 1, question: 'What shape is this?', answer: 'Square', type: '2D-visual', shape: 'square', options: ['Rectangle', 'Square', 'Rhombus', 'Trapezoid'] },
  { level: 1, question: 'What shape is this?', answer: 'Circle', type: '2D-visual', shape: 'circle', options: ['Oval', 'Circle', 'Sphere', 'Pentagon'] },
  { level: 1, question: 'How many sides does a triangle have?', answer: '3', type: '2D', options: ['2', '3', '4', '5'] },
  { level: 1, question: 'How many sides does a square have?', answer: '4', type: '2D', options: ['3', '4', '5', '6'] },

  // Level 2 - more 2D shapes
  { level: 2, question: 'What shape is this?', answer: 'Rectangle', type: '2D-visual', shape: 'rectangle', options: ['Square', 'Rectangle', 'Parallelogram', 'Trapezoid'] },
  { level: 2, question: 'What shape is this?', answer: 'Pentagon', type: '2D-visual', shape: 'pentagon', options: ['Hexagon', 'Pentagon', 'Octagon', 'Square'] },
  { level: 2, question: 'What shape is this?', answer: 'Hexagon', type: '2D-visual', shape: 'hexagon', options: ['Pentagon', 'Hexagon', 'Octagon', 'Heptagon'] },
  { level: 2, question: 'How many sides does a pentagon have?', answer: '5', type: '2D', options: ['4', '5', '6', '7'] },
  { level: 2, question: 'How many sides does a hexagon have?', answer: '6', type: '2D', options: ['5', '6', '7', '8'] },

  // Level 3 - 3D recognition and simple facts
  { level: 3, question: 'What 3D shape is this? (Drag to rotate!)', answer: 'Cube', type: '3D-visual', shape: 'cube', options: ['Cube', 'Pyramid', 'Sphere', 'Cylinder'] },
  { level: 3, question: 'What 3D shape is this? (Drag to rotate!)', answer: 'Sphere', type: '3D-visual', shape: 'sphere', options: ['Cube', 'Sphere', 'Cylinder', 'Cone'] },
  { level: 3, question: 'What 3D shape is this? (Drag to rotate!)', answer: 'Cylinder', type: '3D-visual', shape: 'cylinder', options: ['Cone', 'Cylinder', 'Sphere', 'Cube'] },
  { level: 3, question: 'How many faces does a cube have?', answer: '6', type: '3D', options: ['4', '5', '6', '8'] },
  { level: 3, question: 'How many vertices does a cube have?', answer: '8', type: '3D', options: ['6', '8', '10', '12'] },

  // Level 4 - angles and shape properties
  { level: 4, question: 'How many degrees are in a right angle?', answer: '90', type: 'angles', options: ['45', '90', '180', '360'] },
  { level: 4, question: 'How many degrees are in a straight line?', answer: '180', type: 'angles', options: ['90', '180', '270', '360'] },
  { level: 4, question: 'What is the sum of angles in a triangle?', answer: '180', type: 'angles', options: ['90', '180', '270', '360'] },
  { level: 4, question: 'A shape with 4 equal sides and 4 right angles is a...', answer: 'Square', type: '2D', options: ['Rectangle', 'Square', 'Rhombus', 'Trapezoid'] },
  { level: 4, question: 'Lines that never meet are called...', answer: 'Parallel', type: 'geometry', options: ['Parallel', 'Perpendicular', 'Intersecting', 'Adjacent'] },

  // Level 5 - classification and vocabulary
  { level: 5, question: 'What shape is this?', answer: 'Rhombus', type: '2D-visual', shape: 'rhombus', options: ['Square', 'Rectangle', 'Rhombus', 'Kite'] },
  { level: 5, question: 'What shape is this?', answer: 'Octagon', type: '2D-visual', shape: 'octagon', options: ['Hexagon', 'Heptagon', 'Octagon', 'Pentagon'] },
  { level: 5, question: 'How many sides does an octagon have?', answer: '8', type: '2D', options: ['6', '7', '8', '9'] },
  { level: 5, question: 'An angle smaller than 90° is called...', answer: 'Acute', type: 'angles', options: ['Right', 'Obtuse', 'Acute', 'Reflex'] },
  { level: 5, question: 'An angle bigger than 90° but smaller than 180° is called...', answer: 'Obtuse', type: 'angles', options: ['Acute', 'Right', 'Obtuse', 'Straight'] },

  // Level 6 - perimeter and area
  { level: 6, question: 'A rectangle is 8 cm long and 3 cm wide. What is its perimeter?', answer: '22 cm', type: 'perimeter', options: ['11 cm', '22 cm', '24 cm', '32 cm'] },
  { level: 6, question: 'A square has side length 7 cm. What is its perimeter?', answer: '28 cm', type: 'perimeter', options: ['14 cm', '21 cm', '28 cm', '49 cm'] },
  { level: 6, question: 'A rectangle is 6 cm long and 4 cm wide. What is its area?', answer: '24 cm²', type: 'area', options: ['10 cm²', '20 cm²', '24 cm²', '36 cm²'] },
  { level: 6, question: 'A triangle has base 10 cm and height 6 cm. What is its area?', answer: '30 cm²', type: 'area', options: ['16 cm²', '30 cm²', '60 cm²', '100 cm²'] },
  { level: 6, question: 'A square has side length 9 cm. What is its area?', answer: '81 cm²', type: 'area', options: ['18 cm²', '36 cm²', '72 cm²', '81 cm²'] },

  // Level 7 - 3D properties and nets
  { level: 7, question: 'How many edges does a cube have?', answer: '12', type: '3D', options: ['8', '10', '12', '14'] },
  { level: 7, question: 'How many faces does a square pyramid have?', answer: '5', type: '3D', options: ['4', '5', '6', '8'] },
  { level: 7, question: 'Which 3D shape has exactly one curved surface and one flat circular face?', answer: 'Cone', type: '3D', options: ['Cylinder', 'Cone', 'Sphere', 'Cube'] },
  { level: 7, question: 'Which net can fold into a cube?', answer: '6 connected squares', type: 'nets', options: ['4 triangles', '6 connected squares', '2 circles and a rectangle', '1 circle and a sector'] },
  { level: 7, question: 'A cylinder net usually contains...', answer: '2 circles and 1 rectangle', type: 'nets', options: ['6 squares', '4 triangles', '2 circles and 1 rectangle', '1 square and 4 triangles'] },

  // Level 8 - transformations and symmetry
  { level: 8, question: 'A regular hexagon has how many lines of symmetry?', answer: '6', type: 'symmetry', options: ['3', '4', '6', '8'] },
  { level: 8, question: 'A regular pentagon has how many lines of symmetry?', answer: '5', type: 'symmetry', options: ['0', '1', '5', '10'] },
  { level: 8, question: 'Turning a shape around a point is called...', answer: 'Rotation', type: 'transformations', options: ['Reflection', 'Translation', 'Rotation', 'Enlargement'] },
  { level: 8, question: 'Sliding a shape without turning it is called...', answer: 'Translation', type: 'transformations', options: ['Translation', 'Rotation', 'Reflection', 'Reduction'] },
  { level: 8, question: 'Flipping a shape over a mirror line is called...', answer: 'Reflection', type: 'transformations', options: ['Rotation', 'Reflection', 'Translation', 'Scaling'] },

  // Level 9 - circle facts and harder geometry
  { level: 9, question: 'The distance from the center of a circle to the edge is the...', answer: 'Radius', type: 'circle', options: ['Diameter', 'Radius', 'Circumference', 'Chord'] },
  { level: 9, question: 'The distance all the way around a circle is the...', answer: 'Circumference', type: 'circle', options: ['Area', 'Diameter', 'Circumference', 'Radius'] },
  { level: 9, question: 'A triangle has angles 50° and 60°. What is the third angle?', answer: '70°', type: 'angles', options: ['60°', '70°', '80°', '90°'] },
  { level: 9, question: 'A quadrilateral has angles 90°, 80° and 100°. What is the fourth angle?', answer: '90°', type: 'angles', options: ['80°', '90°', '100°', '110°'] },
  { level: 9, question: 'A regular polygon has all sides and angles...', answer: 'Equal', type: 'geometry', options: ['Curved', 'Equal', 'Parallel', 'Different'] },

  // Level 10 - mixed advanced challenge
  { level: 10, question: 'A cuboid is 4 cm × 3 cm × 2 cm. What is its volume?', answer: '24 cm³', type: 'volume', options: ['9 cm³', '14 cm³', '24 cm³', '36 cm³'] },
  { level: 10, question: 'A cube has side length 5 cm. What is its volume?', answer: '125 cm³', type: 'volume', options: ['15 cm³', '25 cm³', '75 cm³', '125 cm³'] },
  { level: 10, question: 'A triangle has angles 35° and 85°. What is the third angle?', answer: '60°', type: 'angles', options: ['50°', '55°', '60°', '70°'] },
  { level: 10, question: 'What is the area of a parallelogram with base 12 cm and height 5 cm?', answer: '60 cm²', type: 'area', options: ['17 cm²', '30 cm²', '60 cm²', '120 cm²'] },
  { level: 10, question: 'A shape has 2 pairs of parallel sides, but no right angles. It is most likely a...', answer: 'Parallelogram', type: 'geometry', options: ['Trapezoid', 'Parallelogram', 'Kite', 'Pentagon'] }
]

const currentQuestion = ref(null)
const selectedAnswer = ref('')
const score = ref(0)
const totalQuestions = ref(0)
const feedback = ref('')
const showFeedback = ref(false)
const streak = ref(0)
const ravenclaw = ref(0)
const difficulty = ref(1)

const scorePercentage = computed(() => {
  if (totalQuestions.value === 0) return 0
  return Math.round((score.value / totalQuestions.value) * 100)
})

const difficultyLabel = computed(() => levelNames[difficulty.value] || 'Apprentice')

const questionTypeEmoji = computed(() => {
  if (!currentQuestion.value) return '📐'
  switch (currentQuestion.value.type) {
    case '2D': return '⬜'
    case '2D-visual': return '👁️'
    case '3D': return '🧊'
    case '3D-visual': return '🎮'
    case 'angles': return '📐'
    case 'geometry': return '📏'
    case 'perimeter': return '📏'
    case 'area': return '🟩'
    case 'nets': return '📦'
    case 'symmetry': return '🪞'
    case 'transformations': return '🔄'
    case 'circle': return '⭕'
    case 'volume': return '🧱'
    default: return '📐'
  }
})

const questionTypeLabel = computed(() => {
  if (!currentQuestion.value) return 'Geometry'
  switch (currentQuestion.value.type) {
    case '2D': return '2D Shapes'
    case '2D-visual': return 'Visual 2D'
    case '3D': return '3D Shapes'
    case '3D-visual': return 'Interactive 3D'
    case 'angles': return 'Angles'
    case 'geometry': return 'Geometry'
    case 'perimeter': return 'Perimeter'
    case 'area': return 'Area'
    case 'nets': return 'Nets'
    case 'symmetry': return 'Symmetry'
    case 'transformations': return 'Transformations'
    case 'circle': return 'Circle Geometry'
    case 'volume': return 'Volume'
    default: return 'Geometry'
  }
})

function shuffleOptions(options) {
  return [...options].sort(() => Math.random() - 0.5)
}

function getQuestionPool() {
  const exactLevelQuestions = questions.filter(question => question.level === difficulty.value)
  if (exactLevelQuestions.length > 0) return exactLevelQuestions

  return questions.filter(question => question.level <= difficulty.value)
}

function generateQuestion() {
  const questionPool = getQuestionPool()
  const randomQuestion = questionPool[Math.floor(Math.random() * questionPool.length)]
  currentQuestion.value = {
    ...randomQuestion,
    options: shuffleOptions(randomQuestion.options)
  }
  selectedAnswer.value = ''
  showFeedback.value = false
  feedback.value = ''
}

function onDifficultyChange() {
  generateQuestion()
}

function selectAndSubmitAnswer(option) {
  if (showFeedback.value) return // Prevent clicking during feedback

  selectedAnswer.value = option
  totalQuestions.value++

  if (selectedAnswer.value === currentQuestion.value.answer) {
    score.value++
    streak.value++
    ravenclaw.value += 10

    const oldDifficulty = difficulty.value
    if (streak.value % 5 === 0) {
      difficulty.value = Math.min(difficulty.value + 1, 10)
    }

    feedback.value = difficulty.value > oldDifficulty
      ? `🦅 Correct! 10 points to Ravenclaw! Level up to ${difficultyLabel.value}! 💙`
      : '🦅 Correct! 10 points to Ravenclaw! 💙'
    showFeedback.value = true

    setTimeout(() => {
      generateQuestion()
    }, 2000)
  } else {
    streak.value = 0
    feedback.value = `❌ Not quite! The correct answer is: ${currentQuestion.value.answer}`
    showFeedback.value = true

    setTimeout(() => {
      generateQuestion()
    }, 3000)
  }
}

onMounted(() => {
  generateQuestion()
})
</script>

<template>
  <div class="container mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-center">
    <!-- Navigation -->
    <div class="absolute top-4 left-4">
      <router-link
        to="/"
        class="bg-hp-burgundy hover:bg-hp-burgundy/80 text-hp-gold font-hp px-4 py-2 rounded-lg border-2 border-hp-gold/50 transition-all duration-300 hover:scale-105 shadow-lg"
      >
        ← Back to Math Academy
      </router-link>
    </div>

    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-5xl font-hp text-hp-gold mb-2 drop-shadow-lg">
        📐 Shapes & Geometry Quest 🧊
      </h1>
      <p class="text-xl text-hp-gold/80">Master the mysteries of shapes and angles!</p>
    </div>

    <!-- Stats Bar -->
    <div class="bg-hp-navy/50 backdrop-blur rounded-lg p-4 mb-6 w-full max-w-3xl border-2 border-hp-gold/30">
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
          <p class="text-hp-gold/70 text-sm">Correct</p>
          <p class="text-2xl font-bold text-hp-gold">{{ score }}/{{ totalQuestions }}</p>
        </div>
        <div>
          <p class="text-hp-gold/70 text-sm">Score</p>
          <p class="text-2xl font-bold text-hp-gold">{{ scorePercentage }}%</p>
        </div>
      </div>
    </div>

    <!-- Difficulty Selector -->
    <div class="mb-6 flex items-center gap-3">
      <label for="shape-difficulty" class="text-hp-gold font-hp text-lg">
        Difficulty:
      </label>
      <select
        id="shape-difficulty"
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

    <!-- Quiz Card -->
    <div class="bg-gradient-to-br from-hp-burgundy/80 to-purple-900/80 backdrop-blur rounded-xl p-8 w-full max-w-2xl border-4 border-hp-gold/50 shadow-2xl">
      <div class="text-center mb-6">
        <div class="inline-block bg-hp-navy/50 px-6 py-2 rounded-lg border border-hp-gold/30">
          <p class="text-hp-gold/70 text-sm mb-1">Geometry Challenge {{ questionTypeEmoji }}</p>
          <p class="text-sm text-hp-gold/60">{{ difficultyLabel }} Level · {{ questionTypeLabel }}</p>
        </div>
      </div>

      <div v-if="currentQuestion" class="text-center mb-8">
        <p class="text-3xl font-hp text-hp-gold mb-6 drop-shadow-lg">
          {{ currentQuestion.question }}
        </p>

        <!-- Visual 2D Shape -->
        <div v-if="currentQuestion.type === '2D-visual'" class="flex justify-center mb-6">
          <Shape2D :shape="currentQuestion.shape" :size="200" />
        </div>

        <!-- Interactive 3D Shape -->
        <div v-if="currentQuestion.type === '3D-visual'" class="mb-6 max-w-lg mx-auto">
          <Shape3D :shape="currentQuestion.shape" />
        </div>
      </div>

      <!-- Answer Options -->
      <div v-if="currentQuestion && !showFeedback" class="grid grid-cols-2 gap-4 mb-6">
        <button
          v-for="option in currentQuestion.options"
          :key="option"
          @click="selectAndSubmitAnswer(option)"
          class="w-full px-6 py-4 text-xl font-hp rounded-lg border-2 transition-all duration-300 hover:scale-105 bg-white/10 text-hp-gold border-hp-gold/50 hover:bg-hp-gold/20 active:bg-hp-gold active:text-hp-navy"
        >
          {{ option }}
        </button>
      </div>

      <!-- Feedback -->
      <div v-if="showFeedback" class="text-center">
        <p class="text-2xl font-hp" :class="feedback.includes('Correct') ? 'text-green-400' : 'text-yellow-400'">
          {{ feedback }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>