<script setup>
import { ref, computed, onMounted } from 'vue'
import Shape2D from './Shape2D.vue'
import Shape3D from './Shape3D.vue'
import { useTheme } from '../composables/useTheme'

const { activeHouseName, activeHouseEmoji, activeHousePointsLabel } = useTheme()

const levelNames = {
  1: 'Apprentice',
  2: 'Novice',
  3: '3D Explorer',
  4: 'Solid Shape Scout',
  5: 'Net Detective',
  6: 'Volume Apprentice',
  7: 'Surface Sorcerer',
  8: 'Spatial Reasoner',
  9: 'Euler Expert',
  10: 'Geometry Grandmaster'
}

const questions = [
  // Level 1 - basic 2D recognition
  { level: 1, question: 'What shape is this?', answer: 'Triangle', type: '2D-visual', shape: 'triangle', options: ['Square', 'Triangle', 'Circle', 'Pentagon'] },
  { level: 1, question: 'What shape is this?', answer: 'Square', type: '2D-visual', shape: 'square', options: ['Rectangle', 'Square', 'Rhombus', 'Trapezoid'] },
  { level: 1, question: 'What shape is this?', answer: 'Circle', type: '2D-visual', shape: 'circle', options: ['Oval', 'Circle', 'Sphere', 'Pentagon'] },
  { level: 1, question: 'How many sides does a triangle have?', answer: '3', type: '2D', options: ['2', '3', '4', '5'] },
  { level: 1, question: 'How many sides does a square have?', answer: '4', type: '2D', options: ['3', '4', '5', '6'] },

  // Level 2 - more 2D shapes and first properties
  { level: 2, question: 'What shape is this?', answer: 'Rectangle', type: '2D-visual', shape: 'rectangle', options: ['Square', 'Rectangle', 'Parallelogram', 'Trapezoid'] },
  { level: 2, question: 'What shape is this?', answer: 'Pentagon', type: '2D-visual', shape: 'pentagon', options: ['Hexagon', 'Pentagon', 'Octagon', 'Square'] },
  { level: 2, question: 'What shape is this?', answer: 'Hexagon', type: '2D-visual', shape: 'hexagon', options: ['Pentagon', 'Hexagon', 'Octagon', 'Heptagon'] },
  { level: 2, question: 'How many sides does a pentagon have?', answer: '5', type: '2D', options: ['4', '5', '6', '7'] },
  { level: 2, question: 'A shape with 4 equal sides and 4 right angles is a...', answer: 'Square', type: '2D', options: ['Rectangle', 'Square', 'Rhombus', 'Trapezoid'] },

  // Level 3 - basic 3D recognition
  { level: 3, question: 'What 3D shape is this? Drag to rotate it.', answer: 'Cube', type: '3D-visual', shape: 'cube', options: ['Cube', 'Pyramid', 'Sphere', 'Cylinder'] },
  { level: 3, question: 'What 3D shape is this? Drag to rotate it.', answer: 'Sphere', type: '3D-visual', shape: 'sphere', options: ['Cube', 'Sphere', 'Cylinder', 'Cone'] },
  { level: 3, question: 'What 3D shape is this? Drag to rotate it.', answer: 'Cylinder', type: '3D-visual', shape: 'cylinder', options: ['Cone', 'Cylinder', 'Sphere', 'Cube'] },
  { level: 3, question: 'What 3D shape is this? Drag to rotate it.', answer: 'Cone', type: '3D-visual', shape: 'cone', options: ['Cylinder', 'Cone', 'Pyramid', 'Sphere'] },
  { level: 3, question: 'Which 3D shape has no flat faces?', answer: 'Sphere', type: '3D', options: ['Cube', 'Sphere', 'Cylinder', 'Pyramid'] },
  { level: 3, question: 'How many faces does a cube have?', answer: '6', type: '3D', options: ['4', '5', '6', '8'] },

  // Level 4 - 3D properties and new solids
  { level: 4, question: 'What 3D shape is this? Drag to rotate it.', answer: 'Cuboid', type: '3D-visual', shape: 'cuboid', options: ['Cube', 'Cuboid', 'Cylinder', 'Triangular prism'] },
  { level: 4, question: 'What 3D shape is this? Drag to rotate it.', answer: 'Square pyramid', type: '3D-visual', shape: 'square_pyramid', options: ['Cone', 'Square pyramid', 'Triangular prism', 'Cube'] },
  { level: 4, question: 'What 3D shape is this? Drag to rotate it.', answer: 'Triangular prism', type: '3D-visual', shape: 'triangular_prism', options: ['Triangular prism', 'Square pyramid', 'Cone', 'Tetrahedron'] },
  { level: 4, question: 'How many vertices does a cube have?', answer: '8', type: '3D', options: ['6', '8', '10', '12'] },
  { level: 4, question: 'How many edges does a cube have?', answer: '12', type: '3D', options: ['8', '10', '12', '14'] },
  { level: 4, question: 'A cuboid has 6 faces. What shape are most of its faces?', answer: 'Rectangles', type: '3D', options: ['Triangles', 'Rectangles', 'Circles', 'Pentagons'] },

  // Level 5 - nets and face types
  { level: 5, question: 'A cube net is made from...', answer: '6 connected squares', type: 'nets', options: ['4 triangles', '6 connected squares', '2 circles and a rectangle', '1 circle and a sector'] },
  { level: 5, question: 'A cylinder net usually contains...', answer: '2 circles and 1 rectangle', type: 'nets', options: ['6 squares', '4 triangles', '2 circles and 1 rectangle', '1 square and 4 triangles'] },
  { level: 5, question: 'A cone net usually contains...', answer: '1 circle and 1 sector', type: 'nets', options: ['2 circles and 1 rectangle', '1 circle and 1 sector', '6 squares', '2 triangles and 3 rectangles'] },
  { level: 5, question: 'A triangular prism has which faces?', answer: '2 triangles and 3 rectangles', type: 'nets', options: ['4 triangles', '2 triangles and 3 rectangles', '6 squares', '2 circles and 1 rectangle'] },
  { level: 5, question: 'A square pyramid has which faces?', answer: '1 square and 4 triangles', type: 'nets', options: ['6 squares', '1 square and 4 triangles', '2 squares and 4 rectangles', '5 rectangles'] },
  { level: 5, question: 'What 3D shape has exactly one curved surface and one flat circular face?', answer: 'Cone', type: '3D', options: ['Cylinder', 'Cone', 'Sphere', 'Cube'] },

  // Level 6 - volume and harder counting
  { level: 6, question: 'A cuboid is 4 cm × 3 cm × 2 cm. What is its volume?', answer: '24 cm³', type: 'volume', options: ['9 cm³', '14 cm³', '24 cm³', '36 cm³'] },
  { level: 6, question: 'A cube has side length 5 cm. What is its volume?', answer: '125 cm³', type: 'volume', options: ['15 cm³', '25 cm³', '75 cm³', '125 cm³'] },
  { level: 6, question: 'A rectangular prism is 6 cm long, 2 cm wide and 3 cm high. What is its volume?', answer: '36 cm³', type: 'volume', options: ['11 cm³', '18 cm³', '36 cm³', '72 cm³'] },
  { level: 6, question: 'A triangular prism has how many faces?', answer: '5', type: '3D', options: ['4', '5', '6', '8'] },
  { level: 6, question: 'A triangular prism has how many edges?', answer: '9', type: '3D', options: ['6', '8', '9', '12'] },
  { level: 6, question: 'A square pyramid has how many vertices?', answer: '5', type: '3D', options: ['4', '5', '6', '8'] },

  // Level 7 - surface area and prism families
  { level: 7, question: 'A cube has side length 4 cm. What is its surface area?', answer: '96 cm²', type: 'surface-area', options: ['16 cm²', '64 cm²', '96 cm²', '128 cm²'] },
  { level: 7, question: 'A cuboid is 2 cm × 3 cm × 4 cm. What is its surface area?', answer: '52 cm²', type: 'surface-area', options: ['24 cm²', '36 cm²', '52 cm²', '72 cm²'] },
  { level: 7, question: 'What 3D shape is this? Drag to rotate it.', answer: 'Pentagonal prism', type: '3D-visual', shape: 'pentagonal_prism', options: ['Pentagonal prism', 'Hexagonal prism', 'Cylinder', 'Cone'] },
  { level: 7, question: 'A pentagonal prism has how many faces?', answer: '7', type: '3D', options: ['5', '6', '7', '10'] },
  { level: 7, question: 'A pentagonal prism has how many vertices?', answer: '10', type: '3D', options: ['5', '7', '10', '15'] },
  { level: 7, question: 'A prism has the same shape at both ends. What are those two faces called?', answer: 'Bases', type: '3D', options: ['Edges', 'Bases', 'Vertices', 'Nets'] },

  // Level 8 - spatial reasoning and transformations
  { level: 8, question: 'Turning a shape around a point or axis is called...', answer: 'Rotation', type: 'transformations', options: ['Reflection', 'Translation', 'Rotation', 'Enlargement'] },
  { level: 8, question: 'Flipping a shape over a mirror line is called...', answer: 'Reflection', type: 'transformations', options: ['Rotation', 'Reflection', 'Translation', 'Scaling'] },
  { level: 8, question: 'What 3D shape is this? Drag to rotate it.', answer: 'Hexagonal prism', type: '3D-visual', shape: 'hexagonal_prism', options: ['Pentagonal prism', 'Hexagonal prism', 'Cylinder', 'Octahedron'] },
  { level: 8, question: 'A hexagonal prism has how many faces?', answer: '8', type: '3D', options: ['6', '8', '10', '12'] },
  { level: 8, question: 'A hexagonal prism has how many edges?', answer: '18', type: '3D', options: ['12', '14', '18', '24'] },
  { level: 8, question: 'If you slice a cube straight through parallel to one face, the cross-section is a...', answer: 'Square', type: 'cross-section', options: ['Triangle', 'Square', 'Circle', 'Pentagon'] },
  { level: 8, question: 'If you slice a cylinder horizontally, the cross-section is a...', answer: 'Circle', type: 'cross-section', options: ['Rectangle', 'Triangle', 'Circle', 'Hexagon'] },

  // Level 9 - Euler reasoning and complex solids
  { level: 9, question: 'Euler check: a cube has V = 8, E = 12, F = 6. What is V - E + F?', answer: '2', type: 'euler', options: ['0', '1', '2', '4'] },
  { level: 9, question: 'A solid has 6 vertices and 9 edges. Euler says V - E + F = 2. How many faces does it have?', answer: '5', type: 'euler', options: ['4', '5', '6', '7'] },
  { level: 9, question: 'A prism has 12 vertices and 18 edges. How many faces does it have?', answer: '8', type: 'euler', options: ['6', '7', '8', '9'] },
  { level: 9, question: 'What 3D shape is this? Drag to rotate it.', answer: 'Octahedron', type: '3D-visual', shape: 'octahedron', options: ['Tetrahedron', 'Octahedron', 'Cube', 'Dodecahedron'] },
  { level: 9, question: 'An octahedron has 8 triangular faces. How many vertices does it have?', answer: '6', type: '3D', options: ['4', '6', '8', '12'] },
  { level: 9, question: 'Two cubes of side 3 cm are joined face-to-face. What is the volume of the new solid?', answer: '54 cm³', type: 'volume', options: ['18 cm³', '27 cm³', '54 cm³', '81 cm³'] },

  // Level 10 - mixed advanced challenge
  { level: 10, question: 'A cuboid has volume 120 cm³. Its length is 10 cm and width is 4 cm. What is its height?', answer: '3 cm', type: 'volume', options: ['2 cm', '3 cm', '4 cm', '6 cm'] },
  { level: 10, question: 'A cube has surface area 150 cm². What is the area of one face?', answer: '25 cm²', type: 'surface-area', options: ['15 cm²', '20 cm²', '25 cm²', '30 cm²'] },
  { level: 10, question: 'A cube has surface area 150 cm². What is its side length?', answer: '5 cm', type: 'surface-area', options: ['4 cm', '5 cm', '6 cm', '25 cm'] },
  { level: 10, question: 'A solid has F = 12 faces and V = 20 vertices. Euler says V - E + F = 2. How many edges?', answer: '30', type: 'euler', options: ['24', '28', '30', '32'] },
  { level: 10, question: 'What 3D shape is this? Drag to rotate it.', answer: 'Dodecahedron', type: '3D-visual', shape: 'dodecahedron', options: ['Dodecahedron', 'Icosahedron', 'Octahedron', 'Tetrahedron'] },
  { level: 10, question: 'What 3D shape is this? Drag to rotate it.', answer: 'Icosahedron', type: '3D-visual', shape: 'icosahedron', options: ['Dodecahedron', 'Icosahedron', 'Octahedron', 'Tetrahedron'] },
  { level: 10, question: 'A dodecahedron has 12 faces. What shape are its faces?', answer: 'Pentagons', type: '3D', options: ['Triangles', 'Squares', 'Pentagons', 'Hexagons'] },
  { level: 10, question: 'An icosahedron has 20 faces. What shape are its faces?', answer: 'Triangles', type: '3D', options: ['Triangles', 'Squares', 'Pentagons', 'Circles'] }
]

const currentQuestion = ref(null)
const selectedAnswer = ref('')
const score = ref(0)
const totalQuestions = ref(0)
const feedback = ref('')
const showFeedback = ref(false)
const streak = ref(0)
const housePoints = ref(0)
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
    case 'surface-area': return '🧮'
    case 'euler': return '🧠'
    case 'cross-section': return '🔪'
    default: return '📐'
  }
})

const questionTypeLabel = computed(() => {
  if (!currentQuestion.value) return 'Geometry'
  switch (currentQuestion.value.type) {
    case '2D': return '2D Shapes'
    case '2D-visual': return 'Visual 2D'
    case '3D': return '3D Properties'
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
    case 'surface-area': return 'Surface Area'
    case 'euler': return 'Euler Challenge'
    case 'cross-section': return 'Cross-Sections'
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
    housePoints.value += 10

    const oldDifficulty = difficulty.value
    if (streak.value % 4 === 0) {
      difficulty.value = Math.min(difficulty.value + 1, 10)
    }

    feedback.value = difficulty.value > oldDifficulty
      ? `${activeHouseEmoji.value} Correct! 10 points to ${activeHouseName.value}! Level up to ${difficultyLabel.value}!`
      : `${activeHouseEmoji.value} Correct! 10 points to ${activeHouseName.value}!`
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
  <div class='container mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-center'>
    <!-- Navigation -->
    <div class='absolute top-4 left-4'>
      <router-link
        to='/'
        class='bg-hp-burgundy hover:bg-hp-burgundy/80 text-hp-gold font-hp px-4 py-2 rounded-lg border-2 border-hp-gold/50 transition-all duration-300 hover:scale-105 shadow-lg'
      >
        ← Back to Math Academy
      </router-link>
    </div>

    <!-- Header -->
    <div class='text-center mb-8'>
      <h1 class='text-5xl font-hp text-hp-gold mb-2 drop-shadow-lg'>
        📐 Shapes & Geometry Quest 🧊
      </h1>
      <p class='text-xl text-hp-gold/80'>Master 2D shapes, 3D solids, nets, volume, and spatial reasoning!</p>
    </div>

    <!-- Stats Bar -->
    <div class='bg-hp-navy/50 backdrop-blur rounded-lg p-4 mb-6 w-full max-w-3xl border-2 border-hp-gold/30'>
      <div class='grid grid-cols-2 sm:grid-cols-5 gap-4 text-center'>
        <div>
          <p class='text-hp-gold/70 text-sm'>Level</p>
          <p class='text-2xl font-bold text-hp-gold'>{{ difficulty }}</p>
        </div>
        <div>
          <p class='text-hp-gold/70 text-sm'>{{ activeHousePointsLabel }}</p>
          <p class='text-2xl font-bold text-hp-gold'>{{ activeHouseEmoji }} {{ housePoints }}</p>
        </div>
        <div>
          <p class='text-hp-gold/70 text-sm'>Streak</p>
          <p class='text-2xl font-bold text-hp-gold'>🔥 {{ streak }}</p>
        </div>
        <div>
          <p class='text-hp-gold/70 text-sm'>Correct</p>
          <p class='text-2xl font-bold text-hp-gold'>{{ score }}/{{ totalQuestions }}</p>
        </div>
        <div>
          <p class='text-hp-gold/70 text-sm'>Score</p>
          <p class='text-2xl font-bold text-hp-gold'>{{ scorePercentage }}%</p>
        </div>
      </div>
    </div>

    <!-- Difficulty Selector -->
    <div class='mb-6 flex items-center gap-3'>
      <label for='shape-difficulty' class='text-hp-gold font-hp text-lg'>
        Difficulty:
      </label>
      <select
        id='shape-difficulty'
        v-model='difficulty'
        @change='onDifficultyChange'
        class='bg-hp-navy/80 text-hp-gold border-2 border-hp-gold/50 rounded-lg px-4 py-2 font-hp focus:outline-none focus:ring-2 focus:ring-hp-gold focus:border-transparent backdrop-blur'
      >
        <option :value='1'>Apprentice (1)</option>
        <option :value='2'>Novice (2)</option>
        <option :value='3'>3D Explorer (3)</option>
        <option :value='4'>Solid Shape Scout (4)</option>
        <option :value='5'>Net Detective (5)</option>
        <option :value='6'>Volume Apprentice (6)</option>
        <option :value='7'>Surface Sorcerer (7)</option>
        <option :value='8'>Spatial Reasoner (8)</option>
        <option :value='9'>Euler Expert (9)</option>
        <option :value='10'>Geometry Grandmaster (10)</option>
      </select>
    </div>

    <!-- Quiz Card -->
    <div class='bg-gradient-to-br from-hp-burgundy/80 to-purple-900/80 backdrop-blur rounded-xl p-8 w-full max-w-2xl border-4 border-hp-gold/50 shadow-2xl'>
      <div class='text-center mb-6'>
        <div class='inline-block bg-hp-navy/50 px-6 py-2 rounded-lg border border-hp-gold/30'>
          <p class='text-hp-gold/70 text-sm mb-1'>Geometry Challenge {{ questionTypeEmoji }}</p>
          <p class='text-sm text-hp-gold/60'>{{ difficultyLabel }} Level · {{ questionTypeLabel }}</p>
        </div>
      </div>

      <div v-if='currentQuestion' class='text-center mb-8'>
        <p class='text-3xl font-hp text-hp-gold mb-6 drop-shadow-lg'>
          {{ currentQuestion.question }}
        </p>

        <!-- Visual 2D Shape -->
        <div v-if='currentQuestion.type === `2D-visual`' class='flex justify-center mb-6'>
          <Shape2D :shape='currentQuestion.shape' :size='200' />
        </div>

        <!-- Interactive 3D Shape -->
        <div v-if='currentQuestion.type === `3D-visual`' class='mb-6 max-w-lg mx-auto'>
          <Shape3D :shape='currentQuestion.shape' />
        </div>
      </div>

      <!-- Answer Options -->
      <div v-if='currentQuestion && !showFeedback' class='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6'>
        <button
          v-for='option in currentQuestion.options'
          :key='option'
          @click='selectAndSubmitAnswer(option)'
          class='w-full px-6 py-4 text-xl font-hp rounded-lg border-2 transition-all duration-300 hover:scale-105 bg-white/10 text-hp-gold border-hp-gold/50 hover:bg-hp-gold/20 active:bg-hp-gold active:text-hp-navy'
        >
          {{ option }}
        </button>
      </div>

      <!-- Feedback -->
      <div v-if='showFeedback' class='text-center'>
        <p class='text-2xl font-hp' :class='feedback.includes(`Correct`) ? `text-green-400` : `text-yellow-400`'>
          {{ feedback }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
