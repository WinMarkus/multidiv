<script setup>
import { ref, computed, onUnmounted } from 'vue'

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

const problemTypeLabel = computed(() => {
  switch(problemType.value) {
    case 'multiplication': return 'Multiplication Spell'
    case 'division': return 'Division Charm'
    case 'addition': return 'Addition Enchantment'
    case 'subtraction': return 'Subtraction Sorcery'
    case 'probability': return 'Probability Potion'
    default: return 'Number Spell'
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
  <div class="fixed inset-0 z-[80] overflow-y-auto bg-black/75 p-3 backdrop-blur-xl sm:p-5">
    <div class="mx-auto flex min-h-full w-full max-w-3xl items-center justify-center py-4">
      <!-- Configuration Dialog -->
      <div v-if="showConfig" class="magic-card w-full p-5 sm:p-7">
        <div class="mb-6 flex items-start justify-between gap-4">
          <div>
            <p class="text-xs font-black uppercase tracking-[0.22em] text-hp-gold/60">Timed Quest</p>
            <h2 class="mt-2 text-3xl font-black text-white sm:text-4xl">⚡ House Cup Sprint</h2>
            <p class="mt-2 text-sm text-white/65">A short, intense spell duel: answer fast, then choose whether the next round gets faster or harder.</p>
          </div>
          <button @click="closeChallenge" class="btn-ghost shrink-0 px-4" aria-label="Close challenge">✕</button>
        </div>

        <div class="grid gap-4 sm:grid-cols-3">
          <label class="magic-card-soft p-4 text-sm font-bold text-hp-gold/80">
            Time / question
            <input
              v-model.number="timeLimit"
              type="number"
              min="5"
              max="120"
              class="mt-2 w-full rounded-2xl border border-hp-gold/30 bg-white/10 px-4 py-3 text-center text-xl font-black text-hp-gold outline-none focus:ring-2 focus:ring-hp-gold/60"
            />
          </label>

          <label class="magic-card-soft p-4 text-sm font-bold text-hp-gold/80">
            Difficulty
            <select
              v-model.number="difficulty"
              class="mt-2 w-full rounded-2xl border border-hp-gold/30 bg-hp-navy/80 px-4 py-3 font-bold text-hp-gold outline-none focus:ring-2 focus:ring-hp-gold/60"
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
          </label>

          <label class="magic-card-soft p-4 text-sm font-bold text-hp-gold/80">
            Spell type
            <select
              v-model="problemType"
              class="mt-2 w-full rounded-2xl border border-hp-gold/30 bg-hp-navy/80 px-4 py-3 font-bold text-hp-gold outline-none focus:ring-2 focus:ring-hp-gold/60"
            >
              <option value="multiplication">Multiplication</option>
              <option value="division">Division</option>
              <option value="addition">Addition</option>
              <option value="subtraction">Subtraction</option>
              <option value="probability">Probability</option>
            </select>
          </label>
        </div>

        <div class="mt-6 grid gap-3 sm:grid-cols-2">
          <button @click="closeChallenge" class="btn-secondary w-full">Cancel</button>
          <button @click="startChallenge" class="btn-primary w-full">Start Sprint ✨</button>
        </div>
      </div>

      <!-- Active Challenge -->
      <div v-else-if="isActive && !showSpeedOrDifficultyDialog" class="magic-card w-full p-5 sm:p-7">
        <div class="mb-5 grid grid-cols-3 gap-3 text-center">
          <div class="stat-pill">
            <p class="text-xs font-bold uppercase tracking-wide text-hp-gold/60">Timer</p>
            <p class="mt-1 text-2xl font-black text-hp-gold">⏱️ {{ timeRemaining }}s</p>
          </div>
          <div class="stat-pill">
            <p class="text-xs font-bold uppercase tracking-wide text-hp-gold/60">Score</p>
            <p class="mt-1 text-2xl font-black text-hp-gold">{{ correctCount }}/{{ totalAttempts }}</p>
          </div>
          <div class="stat-pill">
            <p class="text-xs font-bold uppercase tracking-wide text-hp-gold/60">Level</p>
            <p class="mt-1 text-2xl font-black text-hp-gold">{{ difficulty }}</p>
          </div>
        </div>

        <div class="mb-5 text-center">
          <p class="text-xs font-black uppercase tracking-[0.22em] text-hp-gold/60">{{ problemTypeLabel }}</p>
          <p class="mt-5 rounded-3xl border border-hp-gold/15 bg-black/20 px-4 py-8 font-hp text-[clamp(2.6rem,14vw,5.5rem)] leading-none text-hp-gold drop-shadow-lg">
            {{ problemDisplay }}
          </p>
        </div>

        <div class="flex flex-col items-center gap-4">
          <input
            v-model="userAnswer"
            @keypress="handleKeyPress"
            type="number"
            inputmode="numeric"
            placeholder="Enter answer"
            class="w-full rounded-2xl border border-hp-gold/30 bg-white/10 px-5 py-4 text-center text-2xl font-black text-hp-gold placeholder-hp-gold/35 outline-none backdrop-blur focus:ring-2 focus:ring-hp-gold/60"
          />

          <div class="grid w-full gap-3 sm:grid-cols-[1fr_auto]">
            <button @click="submitAnswer" :disabled="!userAnswer" class="btn-primary w-full text-lg disabled:cursor-not-allowed disabled:opacity-45">
              Submit ✨
            </button>
            <button @click="endChallenge" class="btn-secondary w-full sm:w-auto">End</button>
          </div>
        </div>

        <div v-if="feedback" class="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
          <p class="text-xl font-black" :class="feedback.includes('Correct') ? 'text-emerald-300' : 'text-amber-300'">
            {{ feedback }}
          </p>
        </div>
      </div>

      <!-- Speed or Difficulty Dialog -->
      <div v-else-if="showSpeedOrDifficultyDialog" class="magic-card w-full max-w-lg p-5 sm:p-7">
        <h2 class="text-center text-3xl font-black text-white">🎉 Round cleared</h2>
        <p class="mx-auto mt-3 max-w-sm text-center text-white/70">You solved 3 challenges. Pick how the next round should evolve.</p>

        <div class="mt-6 grid gap-3">
          <button @click="chooseFaster" class="btn-primary w-full">⚡ Go Faster</button>
          <button @click="chooseHarder" :disabled="difficulty >= 10" class="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-45">🔥 Go Harder</button>
          <button @click="continueCurrent" class="btn-secondary w-full">Continue Current Settings</button>
        </div>
      </div>

      <!-- Challenge Complete -->
      <div v-else-if="challengeComplete" class="magic-card w-full max-w-lg p-5 sm:p-7">
        <h2 class="text-center text-3xl font-black text-white">Challenge Complete 🎊</h2>

        <div class="mt-6 grid gap-3">
          <div class="stat-pill text-center">
            <p class="text-xs font-bold uppercase tracking-wide text-hp-gold/60">Total Score</p>
            <p class="mt-1 text-5xl font-black text-hp-gold">{{ score }}%</p>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="stat-pill text-center">
              <p class="text-xs font-bold uppercase tracking-wide text-hp-gold/60">Correct</p>
              <p class="mt-1 text-2xl font-black text-emerald-300">{{ correctCount }}</p>
            </div>
            <div class="stat-pill text-center">
              <p class="text-xs font-bold uppercase tracking-wide text-hp-gold/60">Total</p>
              <p class="mt-1 text-2xl font-black text-hp-gold">{{ totalAttempts }}</p>
            </div>
          </div>
        </div>

        <button @click="closeChallenge" class="btn-primary mt-6 w-full">Back to Academy</button>
      </div>
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
