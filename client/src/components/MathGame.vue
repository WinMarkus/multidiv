<script setup>
import { ref, computed, onMounted } from 'vue'
import Explanation from './Explanation.vue'
import Celebration from './Celebration.vue'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const currentProblem = ref(null)
const userAnswer = ref('')
const difficulty = ref(1)
const correctStreak = ref(0)
const totalCorrect = ref(0)
const totalAttempts = ref(0)
const showExplanation = ref(false)
const explanation = ref(null)
const feedback = ref('')
const problemType = ref('multiplication')
const showCelebration = ref(false)

const score = computed(() => {
  if (totalAttempts.value === 0) return 0
  return Math.round((totalCorrect.value / totalAttempts.value) * 100)
})

const problemDisplay = computed(() => {
  if (!currentProblem.value) return ''
  const { num1, num2, type } = currentProblem.value
  return type === 'multiplication' 
    ? `${num1} × ${num2}` 
    : `${num1} ÷ ${num2}`
})

async function fetchProblem() {
  try {
    const response = await fetch(`${API_URL}/api/problem?difficulty=${difficulty.value}&type=${problemType.value}`)
    const data = await response.json()
    currentProblem.value = data
    userAnswer.value = ''
    showExplanation.value = false
    explanation.value = null
    feedback.value = ''
  } catch (error) {
    console.error('Error fetching problem:', error)
  }
}

async function submitAnswer() {
  if (!userAnswer.value || !currentProblem.value) return
  
  totalAttempts.value++
  
  try {
    const response = await fetch(`${API_URL}/api/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        num1: currentProblem.value.num1,
        num2: currentProblem.value.num2,
        userAnswer: userAnswer.value,
        type: currentProblem.value.type
      })
    })
    
    const result = await response.json()
    
    if (result.isCorrect) {
      totalCorrect.value++
      correctStreak.value++
      feedback.value = '✨ Correct! Well done! ✨'
      
      // Check if we should show celebration
      if (correctStreak.value >= 5 && correctStreak.value % 5 === 0) {
        showCelebration.value = true
        setTimeout(() => {
          showCelebration.value = false
        }, 3000)
      }
      
      // Increase difficulty every 3 correct answers
      if (correctStreak.value % 3 === 0) {
        difficulty.value = Math.min(difficulty.value + 1, 99)
      }
      
      setTimeout(() => {
        fetchProblem()
      }, 1500)
    } else {
      correctStreak.value = 0
      feedback.value = `Not quite. The answer is ${result.correctAnswer}`
      explanation.value = result.explanation
      showExplanation.value = true
    }
  } catch (error) {
    console.error('Error checking answer:', error)
  }
}

function toggleProblemType() {
  problemType.value = problemType.value === 'multiplication' ? 'division' : 'multiplication'
  difficulty.value = 1
  correctStreak.value = 0
  fetchProblem()
}

function handleKeyPress(event) {
  if (event.key === 'Enter') {
    submitAnswer()
  }
}

onMounted(() => {
  fetchProblem()
})
</script>

<template>
  <div class="container mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-center">
    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-5xl font-hp text-hp-gold mb-2 drop-shadow-lg">
        🧙‍♂️ Magical Math Academy 🧙‍♀️
      </h1>
      <p class="text-xl text-hp-gold/80">Master your spells of numbers!</p>
    </div>
    
    <!-- Stats Bar -->
    <div class="bg-hp-navy/50 backdrop-blur rounded-lg p-4 mb-6 w-full max-w-2xl border-2 border-hp-gold/30">
      <div class="grid grid-cols-4 gap-4 text-center">
        <div>
          <p class="text-hp-gold/70 text-sm">Level</p>
          <p class="text-2xl font-bold text-hp-gold">{{ difficulty }}</p>
        </div>
        <div>
          <p class="text-hp-gold/70 text-sm">Streak</p>
          <p class="text-2xl font-bold text-hp-gold">🔥 {{ correctStreak }}</p>
        </div>
        <div>
          <p class="text-hp-gold/70 text-sm">Score</p>
          <p class="text-2xl font-bold text-hp-gold">{{ score }}%</p>
        </div>
        <div>
          <p class="text-hp-gold/70 text-sm">Correct</p>
          <p class="text-2xl font-bold text-hp-gold">{{ totalCorrect }}/{{ totalAttempts }}</p>
        </div>
      </div>
    </div>
    
    <!-- Problem Type Toggle -->
    <div class="mb-6">
      <button
        @click="toggleProblemType"
        class="bg-hp-burgundy hover:bg-hp-burgundy/80 text-hp-gold font-hp px-6 py-3 rounded-lg border-2 border-hp-gold/50 transition-all duration-300 hover:scale-105 shadow-lg"
      >
        Switch to {{ problemType === 'multiplication' ? 'Division' : 'Multiplication' }}
      </button>
    </div>
    
    <!-- Main Problem Card -->
    <div class="bg-gradient-to-br from-hp-burgundy/80 to-purple-900/80 backdrop-blur rounded-xl p-8 w-full max-w-2xl border-4 border-hp-gold/50 shadow-2xl">
      <div class="text-center mb-6">
        <div class="inline-block bg-hp-navy/50 px-6 py-2 rounded-lg border border-hp-gold/30">
          <p class="text-hp-gold/70 text-sm mb-1">Current Challenge</p>
          <p class="text-sm text-hp-gold/60">
            {{ problemType === 'multiplication' ? 'Multiplication Spell' : 'Division Charm' }}
          </p>
        </div>
      </div>
      
      <div class="text-center mb-8">
        <p class="text-6xl font-hp text-hp-gold mb-4 drop-shadow-lg">
          {{ problemDisplay }}
        </p>
      </div>
      
      <div class="flex flex-col items-center gap-4">
        <input
          v-model="userAnswer"
          @keypress="handleKeyPress"
          type="number"
          placeholder="Enter your answer..."
          class="w-full max-w-md px-6 py-4 text-2xl text-center bg-white/10 border-2 border-hp-gold/50 rounded-lg text-hp-gold placeholder-hp-gold/30 focus:outline-none focus:ring-2 focus:ring-hp-gold focus:border-transparent backdrop-blur"
        />
        
        <button
          @click="submitAnswer"
          :disabled="!userAnswer"
          class="w-full max-w-md bg-hp-gold hover:bg-hp-bronze text-hp-navy font-hp font-bold px-8 py-4 rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg text-xl"
        >
          Cast Answer Spell ✨
        </button>
      </div>
      
      <!-- Feedback -->
      <div v-if="feedback" class="mt-6 text-center">
        <p class="text-2xl font-hp" :class="feedback.includes('Correct') ? 'text-green-400' : 'text-yellow-400'">
          {{ feedback }}
        </p>
      </div>
    </div>
    
    <!-- Explanation -->
    <Explanation 
      v-if="showExplanation && explanation"
      :explanation="explanation"
      :problem-type="currentProblem.type"
      @close="showExplanation = false"
    />
    
    <!-- Celebration -->
    <Celebration 
      v-if="showCelebration"
      :streak="correctStreak"
    />
  </div>
</template>

<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>
