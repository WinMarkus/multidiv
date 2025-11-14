<script setup>
import { ref, computed, onMounted } from 'vue'

const questions = [
  // 2D Shapes
  { question: 'How many sides does a triangle have?', answer: '3', type: '2D', options: ['2', '3', '4', '5'] },
  { question: 'How many sides does a square have?', answer: '4', type: '2D', options: ['3', '4', '5', '6'] },
  { question: 'How many sides does a pentagon have?', answer: '5', type: '2D', options: ['4', '5', '6', '7'] },
  { question: 'How many sides does a hexagon have?', answer: '6', type: '2D', options: ['5', '6', '7', '8'] },
  { question: 'How many sides does an octagon have?', answer: '8', type: '2D', options: ['6', '7', '8', '9'] },
  { question: 'How many sides does a circle have?', answer: '0', type: '2D', options: ['0', '1', 'infinite', '100'] },
  { question: 'A shape with 4 equal sides and 4 right angles is a...', answer: 'Square', type: '2D', options: ['Rectangle', 'Square', 'Rhombus', 'Trapezoid'] },
  { question: 'A shape with 4 sides where opposite sides are equal is a...', answer: 'Rectangle', type: '2D', options: ['Square', 'Rectangle', 'Triangle', 'Pentagon'] },
  
  // 3D Shapes
  { question: 'How many faces does a cube have?', answer: '6', type: '3D', options: ['4', '5', '6', '8'] },
  { question: 'How many faces does a pyramid have?', answer: '5', type: '3D', options: ['4', '5', '6', '7'] },
  { question: 'How many edges does a cube have?', answer: '12', type: '3D', options: ['8', '10', '12', '14'] },
  { question: 'How many vertices does a cube have?', answer: '8', type: '3D', options: ['6', '8', '10', '12'] },
  { question: 'A 3D shape with all points equidistant from center is a...', answer: 'Sphere', type: '3D', options: ['Cube', 'Sphere', 'Cylinder', 'Cone'] },
  { question: 'A 3D shape with 2 circular faces and 1 curved surface is a...', answer: 'Cylinder', type: '3D', options: ['Cone', 'Cylinder', 'Sphere', 'Prism'] },
  
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
    case '3D': return '🧊'
    case 'angles': return '📐'
    case 'geometry': return '📏'
    default: return '📐'
  }
})

function generateQuestion() {
  const randomQuestion = questions[Math.floor(Math.random() * questions.length)]
  currentQuestion.value = { ...randomQuestion }
  
  selectedAnswer.value = ''
  showFeedback.value = false
  feedback.value = ''
}

function submitAnswer() {
  if (!selectedAnswer.value || !currentQuestion.value) return
  
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
          <p class="text-sm text-hp-gold/60">
            {{ currentQuestion?.type === '2D' ? '2D Shapes' : 
               currentQuestion?.type === '3D' ? '3D Shapes' : 
               currentQuestion?.type === 'angles' ? 'Angles' : 'Geometry' }}
          </p>
        </div>
      </div>
      
      <div v-if="currentQuestion" class="text-center mb-8">
        <p class="text-3xl font-hp text-hp-gold mb-6 drop-shadow-lg">
          {{ currentQuestion.question }}
        </p>
      </div>
      
      <!-- Answer Options -->
      <div v-if="currentQuestion && !showFeedback" class="grid grid-cols-2 gap-4 mb-6">
        <button
          v-for="option in currentQuestion.options"
          :key="option"
          @click="selectedAnswer = option"
          :class="[
            'w-full px-6 py-4 text-xl font-hp rounded-lg border-2 transition-all duration-300 hover:scale-105',
            selectedAnswer === option 
              ? 'bg-hp-gold text-hp-navy border-hp-gold shadow-lg' 
              : 'bg-white/10 text-hp-gold border-hp-gold/50 hover:bg-white/20'
          ]"
        >
          {{ option }}
        </button>
      </div>
      
      <!-- Submit Button -->
      <div v-if="!showFeedback" class="text-center">
        <button
          @click="submitAnswer"
          :disabled="!selectedAnswer"
          class="bg-hp-gold hover:bg-hp-bronze text-hp-navy font-hp font-bold px-8 py-4 rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg text-xl"
        >
          Submit Answer ✨
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
