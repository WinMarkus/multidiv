<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const API_URL = import.meta.env.VITE_API_URL || ''

const emit = defineEmits(['close'])

// Challenge configuration
const showConfig = ref(true)
const timeLimit = ref(30) // seconds per question
const difficulty = ref(1)
const problemType = ref('multiplication')

// Challenge state
const isActive = ref(false)
const currentProblem = ref(null)
const userAnswer = ref('')
const correctCount = ref(0)
const totalAttempts = ref(0)
const timeRemaining = ref(30)
const timerInterval = ref(null)
const showSpeedOrDifficultyDialog = ref(false)
const challengeComplete = ref(false)
const feedback = ref('')

const score = computed(() => {
  if (totalAttempts.value === 0) return 0
  return Math.round((correctCount.value / totalAttempts.value) * 100)
})

const problemDisplay = computed(() => {
  if (!currentProblem.value) return ''
  const { num1, num2, type } = currentProblem.value
  switch(type) {
    case 'multiplication':
      return `${num1} × ${num2}`
    case 'division':
      return `${num1} ÷ ${num2}`
    case 'addition':
      return `${num1} + ${num2}`
    case 'subtraction':
      return `${num1} - ${num2}`
    case 'probability':
      return `If ${num1} out of ${num2} outcomes happen, what is the probability (%)?`
    default:
      return ''
  }
})

function startChallenge() {
  showConfig.value = false
  isActive.value = true
  correctCount.value = 0
  totalAttempts.value = 0
  challengeComplete.value = false
  fetchProblem()
}

function startTimer() {
  timeRemaining.value = timeLimit.value
  
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
  }
  
  timerInterval.value = setInterval(() => {
    timeRemaining.value--
    
    if (timeRemaining.value <= 0) {
      handleTimeout()
    }
  }, 1000)
}

function stopTimer() {
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
    timerInterval.value = null
  }
}

function handleTimeout() {
  stopTimer()
  feedback.value = `⏰ Time's up! The answer was ${currentProblem.value.answer}`
  totalAttempts.value++
  
  setTimeout(() => {
    feedback.value = ''
    fetchProblem()
  }, 2000)
}

async function fetchProblem() {
  try {
    const response = await fetch(`${API_URL}/api/problem?difficulty=${difficulty.value}&type=${problemType.value}`)
    const data = await response.json()
    currentProblem.value = data
    userAnswer.value = ''
    feedback.value = ''
    startTimer()
  } catch (error) {
    console.error('Error fetching problem:', error)
  }
}

async function submitAnswer() {
  if (!userAnswer.value || !currentProblem.value) return
  
  stopTimer()
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
      correctCount.value++
      feedback.value = '✨ Correct! ✨'
      
      // Check if we've reached 3 correct answers
      if (correctCount.value > 0 && correctCount.value % 3 === 0) {
        setTimeout(() => {
          showSpeedOrDifficultyDialog.value = true
        }, 1500)
      } else {
        setTimeout(() => {
          feedback.value = ''
          fetchProblem()
        }, 1500)
      }
    } else {
      feedback.value = `Not quite. The answer was ${result.correctAnswer}`
      
      setTimeout(() => {
        feedback.value = ''
        fetchProblem()
      }, 2000)
    }
  } catch (error) {
    console.error('Error checking answer:', error)
  }
}

function chooseFaster() {
  showSpeedOrDifficultyDialog.value = false
  // Reduce time limit by 20% (minimum 5 seconds)
  timeLimit.value = Math.max(5, Math.floor(timeLimit.value * 0.8))
  feedback.value = `⚡ Faster mode! Now ${timeLimit.value} seconds per question`
  
  setTimeout(() => {
    feedback.value = ''
    fetchProblem()
  }, 2000)
}

function chooseHarder() {
  showSpeedOrDifficultyDialog.value = false
  // Increase difficulty by 1 (maximum 10)
  if (difficulty.value < 10) {
    difficulty.value++
    feedback.value = `🔥 Harder mode! Now level ${difficulty.value}`
  } else {
    feedback.value = '💪 Already at maximum difficulty!'
  }
  
  setTimeout(() => {
    feedback.value = ''
    fetchProblem()
  }, 2000)
}

function continueCurrent() {
  showSpeedOrDifficultyDialog.value = false
  feedback.value = ''
  fetchProblem()
}

function endChallenge() {
  stopTimer()
  isActive.value = false
  challengeComplete.value = true
}

function closeChallenge() {
  stopTimer()
  emit('close')
}

function handleKeyPress(event) {
  if (event.key === 'Enter' && !showSpeedOrDifficultyDialog.value) {
    submitAnswer()
  }
}

onUnmounted(() => {
  stopTimer()
})
</script>

<template>
  <div class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <!-- Configuration Dialog -->
    <div v-if="showConfig" class="bg-gradient-to-br from-hp-burgundy/90 to-purple-900/90 backdrop-blur rounded-xl p-8 max-w-md w-full border-4 border-hp-gold/50 shadow-2xl">
      <h2 class="text-3xl font-hp text-hp-gold mb-6 text-center">⚡ Challenge Mode ⚡</h2>
      
      <div class="space-y-6">
        <div>
          <label class="block text-hp-gold font-hp text-lg mb-2">
            Time Limit (seconds per question):
          </label>
          <input
            v-model.number="timeLimit"
            type="number"
            min="5"
            max="120"
            class="w-full px-4 py-3 text-xl text-center bg-white/10 border-2 border-hp-gold/50 rounded-lg text-hp-gold focus:outline-none focus:ring-2 focus:ring-hp-gold"
          />
        </div>
        
        <div>
          <label class="block text-hp-gold font-hp text-lg mb-2">
            Starting Difficulty:
          </label>
          <select
            v-model.number="difficulty"
            class="w-full bg-hp-navy/80 text-hp-gold border-2 border-hp-gold/50 rounded-lg px-4 py-3 font-hp focus:outline-none focus:ring-2 focus:ring-hp-gold"
          >
            <option value="1">Apprentice (1)</option>
            <option value="2">Novice (2)</option>
            <option value="3">Adept (3)</option>
            <option value="4">Expert (4)</option>
            <option value="5">Master (5)</option>
            <option value="6">Grandmaster (6)</option>
            <option value="7">Archmage (7)</option>
            <option value="8">Legend (8)</option>
            <option value="9">Mythical (9)</option>
            <option value="10">Godlike (10)</option>
          </select>
        </div>
        
        <div>
          <label class="block text-hp-gold font-hp text-lg mb-2">
            Problem Type:
          </label>
          <select
            v-model="problemType"
            class="w-full bg-hp-navy/80 text-hp-gold border-2 border-hp-gold/50 rounded-lg px-4 py-3 font-hp focus:outline-none focus:ring-2 focus:ring-hp-gold"
          >
            <option value="multiplication">Multiplication</option>
            <option value="division">Division</option>
            <option value="addition">Addition</option>
            <option value="subtraction">Subtraction</option>
            <option value="probability">Probability</option>
          </select>
        </div>
      </div>
      
      <div class="mt-8 flex gap-4">
        <button
          @click="closeChallenge"
          class="flex-1 bg-hp-navy/80 hover:bg-hp-navy text-hp-gold font-hp px-6 py-3 rounded-lg border-2 border-hp-gold/50 transition-all duration-300"
        >
          Cancel
        </button>
        <button
          @click="startChallenge"
          class="flex-1 bg-hp-gold hover:bg-hp-bronze text-hp-navy font-hp font-bold px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
        >
          Start Challenge!
        </button>
      </div>
    </div>
    
    <!-- Active Challenge -->
    <div v-else-if="isActive && !showSpeedOrDifficultyDialog" class="bg-gradient-to-br from-hp-burgundy/90 to-purple-900/90 backdrop-blur rounded-xl p-8 max-w-2xl w-full border-4 border-hp-gold/50 shadow-2xl">
      <!-- Header with stats and timer -->
      <div class="flex justify-between items-center mb-6">
        <div class="text-hp-gold font-hp">
          <span class="text-2xl font-bold">⏱️ {{ timeRemaining }}s</span>
        </div>
        <div class="text-center">
          <p class="text-hp-gold/70 text-sm">Progress</p>
          <p class="text-2xl font-bold text-hp-gold">✅ {{ correctCount }} / {{ totalAttempts }}</p>
        </div>
        <div class="text-center">
          <p class="text-hp-gold/70 text-sm">Level</p>
          <p class="text-2xl font-bold text-hp-gold">{{ difficulty }}</p>
        </div>
      </div>
      
      <!-- Problem Display -->
      <div class="text-center mb-8">
        <div class="inline-block bg-hp-navy/50 px-6 py-2 rounded-lg border border-hp-gold/30 mb-4">
          <p class="text-sm text-hp-gold/60">
            {{ problemType === 'multiplication' ? 'Multiplication Spell' : 
               problemType === 'division' ? 'Division Charm' : 
               problemType === 'addition' ? 'Addition Enchantment' : 
               problemType === 'subtraction' ? 'Subtraction Sorcery' : 'Probability Potion' }}
          </p>
        </div>
        
        <p class="text-6xl font-hp text-hp-gold mb-4 drop-shadow-lg">
          {{ problemDisplay }}
        </p>
      </div>
      
      <!-- Answer Input -->
      <div class="flex flex-col items-center gap-4">
        <input
          v-model="userAnswer"
          @keypress="handleKeyPress"
          type="number"
          placeholder="Enter your answer..."
          class="w-full max-w-md px-6 py-4 text-2xl text-center bg-white/10 border-2 border-hp-gold/50 rounded-lg text-hp-gold placeholder-hp-gold/30 focus:outline-none focus:ring-2 focus:ring-hp-gold focus:border-transparent backdrop-blur"
          autofocus
        />
        
        <div class="flex gap-4 w-full max-w-md">
          <button
            @click="submitAnswer"
            :disabled="!userAnswer"
            class="flex-1 bg-hp-gold hover:bg-hp-bronze text-hp-navy font-hp font-bold px-8 py-4 rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg text-xl"
          >
            Submit ✨
          </button>
          <button
            @click="endChallenge"
            class="bg-hp-burgundy/80 hover:bg-hp-burgundy text-hp-gold font-hp px-6 py-4 rounded-lg border-2 border-hp-gold/50 transition-all duration-300"
          >
            End Challenge
          </button>
        </div>
      </div>
      
      <!-- Feedback -->
      <div v-if="feedback" class="mt-6 text-center">
        <p class="text-2xl font-hp" :class="feedback.includes('Correct') ? 'text-green-400' : 'text-yellow-400'">
          {{ feedback }}
        </p>
      </div>
    </div>
    
    <!-- Speed or Difficulty Dialog -->
    <div v-else-if="showSpeedOrDifficultyDialog" class="bg-gradient-to-br from-hp-burgundy/90 to-purple-900/90 backdrop-blur rounded-xl p-8 max-w-md w-full border-4 border-hp-gold/50 shadow-2xl">
      <h2 class="text-3xl font-hp text-hp-gold mb-4 text-center">🎉 Great Job! 🎉</h2>
      <p class="text-xl text-hp-gold/80 text-center mb-8 font-hp">
        You've completed 3 challenges successfully!<br/>
        Ready for the next level?
      </p>
      
      <div class="space-y-4">
        <button
          @click="chooseFaster"
          class="w-full bg-hp-gold hover:bg-hp-bronze text-hp-navy font-hp font-bold px-6 py-4 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg text-xl"
        >
          ⚡ Go Faster! (Reduce time by 20%)
        </button>
        <button
          @click="chooseHarder"
          :disabled="difficulty >= 10"
          class="w-full bg-hp-gold hover:bg-hp-bronze text-hp-navy font-hp font-bold px-6 py-4 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg text-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          🔥 Go Harder! (Increase difficulty)
        </button>
        <button
          @click="continueCurrent"
          class="w-full bg-hp-navy/80 hover:bg-hp-navy text-hp-gold font-hp px-6 py-3 rounded-lg border-2 border-hp-gold/50 transition-all duration-300"
        >
          Continue Current Settings
        </button>
      </div>
    </div>
    
    <!-- Challenge Complete -->
    <div v-else-if="challengeComplete" class="bg-gradient-to-br from-hp-burgundy/90 to-purple-900/90 backdrop-blur rounded-xl p-8 max-w-md w-full border-4 border-hp-gold/50 shadow-2xl">
      <h2 class="text-3xl font-hp text-hp-gold mb-6 text-center">Challenge Complete! 🎊</h2>
      
      <div class="space-y-4 mb-8">
        <div class="bg-hp-navy/50 p-4 rounded-lg border border-hp-gold/30">
          <p class="text-hp-gold/70 text-sm text-center">Total Score</p>
          <p class="text-4xl font-bold text-hp-gold text-center">{{ score }}%</p>
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-hp-navy/50 p-4 rounded-lg border border-hp-gold/30 text-center">
            <p class="text-hp-gold/70 text-sm">Correct</p>
            <p class="text-2xl font-bold text-green-400">{{ correctCount }}</p>
          </div>
          <div class="bg-hp-navy/50 p-4 rounded-lg border border-hp-gold/30 text-center">
            <p class="text-hp-gold/70 text-sm">Total</p>
            <p class="text-2xl font-bold text-hp-gold">{{ totalAttempts }}</p>
          </div>
        </div>
      </div>
      
      <button
        @click="closeChallenge"
        class="w-full bg-hp-gold hover:bg-hp-bronze text-hp-navy font-hp font-bold px-6 py-4 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg text-xl"
      >
        Back to Main Game
      </button>
    </div>
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
