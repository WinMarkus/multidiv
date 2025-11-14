<script setup>
import { ref, computed, onMounted } from 'vue'
import Shape2D from './Shape2D.vue'
import Shape3D from './Shape3D.vue'

const questions = [
  // Visual 2D Shape Identification
  { question: 'What shape is this?', answer: 'Triangle', type: '2D-visual', shape: 'triangle', options: ['Square', 'Triangle', 'Circle', 'Pentagon'] },
  { question: 'What shape is this?', answer: 'Square', type: '2D-visual', shape: 'square', options: ['Rectangle', 'Square', 'Rhombus', 'Trapezoid'] },
  { question: 'What shape is this?', answer: 'Circle', type: '2D-visual', shape: 'circle', options: ['Oval', 'Circle', 'Sphere', 'Pentagon'] },
  { question: 'What shape is this?', answer: 'Pentagon', type: '2D-visual', shape: 'pentagon', options: ['Hexagon', 'Pentagon', 'Octagon', 'Square'] },
  { question: 'What shape is this?', answer: 'Hexagon', type: '2D-visual', shape: 'hexagon', options: ['Pentagon', 'Hexagon', 'Octagon', 'Heptagon'] },
  { question: 'What shape is this?', answer: 'Octagon', type: '2D-visual', shape: 'octagon', options: ['Hexagon', 'Heptagon', 'Octagon', 'Pentagon'] },
  { question: 'What shape is this?', answer: 'Rectangle', type: '2D-visual', shape: 'rectangle', options: ['Square', 'Rectangle', 'Parallelogram', 'Trapezoid'] },
  { question: 'What shape is this?', answer: 'Rhombus', type: '2D-visual', shape: 'rhombus', options: ['Square', 'Rectangle', 'Rhombus', 'Kite'] },
  
  // Visual 3D Shape Identification
  { question: 'What 3D shape is this? (Drag to rotate!)', answer: 'Cube', type: '3D-visual', shape: 'cube', options: ['Cube', 'Pyramid', 'Sphere', 'Cylinder'] },
  { question: 'What 3D shape is this? (Drag to rotate!)', answer: 'Sphere', type: '3D-visual', shape: 'sphere', options: ['Cube', 'Sphere', 'Cylinder', 'Cone'] },
  { question: 'What 3D shape is this? (Drag to rotate!)', answer: 'Cylinder', type: '3D-visual', shape: 'cylinder', options: ['Cone', 'Cylinder', 'Sphere', 'Cube'] },
  { question: 'What 3D shape is this? (Drag to rotate!)', answer: 'Cone', type: '3D-visual', shape: 'cone', options: ['Pyramid', 'Cone', 'Cylinder', 'Sphere'] },
  { question: 'What 3D shape is this? (Drag to rotate!)', answer: 'Pyramid', type: '3D-visual', shape: 'pyramid', options: ['Cone', 'Pyramid', 'Cube', 'Prism'] },
  
  // 2D Shapes - Text Questions
  { question: 'How many sides does a triangle have?', answer: '3', type: '2D', options: ['2', '3', '4', '5'] },
  { question: 'How many sides does a square have?', answer: '4', type: '2D', options: ['3', '4', '5', '6'] },
  { question: 'How many sides does a pentagon have?', answer: '5', type: '2D', options: ['4', '5', '6', '7'] },
  { question: 'How many sides does a hexagon have?', answer: '6', type: '2D', options: ['5', '6', '7', '8'] },
  { question: 'How many sides does an octagon have?', answer: '8', type: '2D', options: ['6', '7', '8', '9'] },
  { question: 'A shape with 4 equal sides and 4 right angles is a...', answer: 'Square', type: '2D', options: ['Rectangle', 'Square', 'Rhombus', 'Trapezoid'] },
  
  // 3D Shapes - Text Questions
  { question: 'How many faces does a cube have?', answer: '6', type: '3D', options: ['4', '5', '6', '8'] },
  { question: 'How many faces does a pyramid have?', answer: '5', type: '3D', options: ['4', '5', '6', '7'] },
  { question: 'How many edges does a cube have?', answer: '12', type: '3D', options: ['8', '10', '12', '14'] },
  { question: 'How many vertices does a cube have?', answer: '8', type: '3D', options: ['6', '8', '10', '12'] },
  
  // Geometry concepts
  { question: 'How many degrees in a right angle?', answer: '90', type: 'angles', options: ['45', '90', '180', '360'] },
  { question: 'How many degrees in a straight line?', answer: '180', type: 'angles', options: ['90', '180', '270', '360'] },
  { question: 'How many degrees in a full circle?', answer: '360', type: 'angles', options: ['180', '270', '360', '450'] },
  { question: 'What is the sum of angles in a triangle?', answer: '180', type: 'angles', options: ['90', '180', '270', '360'] },
  { question: 'What is the sum of angles in a square?', answer: '360', type: 'angles', options: ['180', '270', '360', '450'] },
  { question: 'Lines that never meet are called...', answer: 'Parallel', type: 'geometry', options: ['Parallel', 'Perpendicular', 'Intersecting', 'Adjacent'] },
]

const currentQuestion = ref(null)
const selectedAnswer = ref('')
const score = ref(0)
const totalQuestions = ref(0)
const feedback = ref('')
const showFeedback = ref(false)
const streak = ref(0)
const ravenclaw = ref(0)

const scorePercentage = computed(() => {
  if (totalQuestions.value === 0) return 0
  return Math.round((score.value / totalQuestions.value) * 100)
})

const questionTypeEmoji = computed(() => {
  if (!currentQuestion.value) return '📐'
  switch (currentQuestion.value.type) {
    case '2D': return '⬜'
    case '2D-visual': return '👁️'
    case '3D': return '🧊'
    case '3D-visual': return '🎮'
    case 'angles': return '📐'
    case 'geometry': return '📏'
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
    default: return 'Geometry'
  }
})

function generateQuestion() {
  const randomQuestion = questions[Math.floor(Math.random() * questions.length)]
  currentQuestion.value = { ...randomQuestion }
  
  selectedAnswer.value = ''
  showFeedback.value = false
  feedback.value = ''
}

function selectAndSubmitAnswer(option) {
  if (showFeedback.value) return // Prevent clicking during feedback
  
  selectedAnswer.value = option
  totalQuestions.value++
  
  if (selectedAnswer.value === currentQuestion.value.answer) {
    score.value++
    streak.value++
    ravenclaw.value += 10
    feedback.value = '🦅 Correct! 10 points to Ravenclaw! 💙'
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
    <div class="bg-hp-navy/50 backdrop-blur rounded-lg p-4 mb-6 w-full max-w-2xl border-2 border-hp-gold/30">
      <div class="grid grid-cols-4 gap-4 text-center">
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
    
    <!-- Quiz Card -->
    <div class="bg-gradient-to-br from-hp-burgundy/80 to-purple-900/80 backdrop-blur rounded-xl p-8 w-full max-w-2xl border-4 border-hp-gold/50 shadow-2xl">
      <div class="text-center mb-6">
        <div class="inline-block bg-hp-navy/50 px-6 py-2 rounded-lg border border-hp-gold/30">
          <p class="text-hp-gold/70 text-sm mb-1">Geometry Challenge {{ questionTypeEmoji }}</p>
          <p class="text-sm text-hp-gold/60">{{ questionTypeLabel }}</p>
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
