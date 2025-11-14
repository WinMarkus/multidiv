<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import Explanation from './Explanation.vue'
import Celebration from './Celebration.vue'
import HarryPotterAnimation from './HarryPotterAnimation.vue'
import JokeDisplay from './JokeDisplay.vue'
import ChallengeMode from './ChallengeMode.vue'

const API_URL = import.meta.env.VITE_API_URL || ''

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
const showHPAnimation = ref(false)
const hpAnimationType = ref('streak')
const showJoke = ref(false)
const questionsSinceLastJoke = ref(0)
const useMultiselect = ref(false)
const answerOptions = ref([])
const answerInputRef = ref(null)
const showChallengeMode = ref(false)

const score = computed(() => {
  if (totalAttempts.value === 0) return 0
  return Math.round((totalCorrect.value / totalAttempts.value) * 100)
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
    default:
      return ''
  }
})

function generateAnswerOptions(correctAnswer) {
  const options = new Set([correctAnswer])
  
  // Generate 3 plausible wrong answers
  while (options.size < 4) {
    // Generate wrong answers within a reasonable range
    // Use percentage-based offset for larger numbers to keep options realistic
    const range = Math.max(10, Math.floor(correctAnswer * 0.3))
    const offset = Math.floor(Math.random() * (range * 2)) - range
    const wrongAnswer = correctAnswer + offset
    
    // Ensure wrong answer is positive and different from correct
    if (wrongAnswer > 0 && wrongAnswer !== correctAnswer) {
      options.add(wrongAnswer)
    }
  }
  
  // Shuffle the options array
  return Array.from(options).sort(() => Math.random() - 0.5)
}

async function fetchProblem() {
  try {
    const response = await fetch(`${API_URL}/api/problem?difficulty=${difficulty.value}&type=${problemType.value}`)
    const data = await response.json()
    currentProblem.value = data
    userAnswer.value = ''
    showExplanation.value = false
    explanation.value = null
    feedback.value = ''
    
    // Randomly decide between input and multiselect (30% chance for multiselect)
    useMultiselect.value = Math.random() < 0.3
    
    if (useMultiselect.value) {
      // Generate answer options for multiselect
      answerOptions.value = generateAnswerOptions(data.answer)
    }
    
    // Focus the input field after rendering
    await nextTick()
    if (answerInputRef.value) {
      answerInputRef.value.focus()
    }
  } catch (error) {
    console.error('Error fetching problem:', error)
  }
}

async function submitAnswer() {
  if (!userAnswer.value || !currentProblem.value) return
  
  totalAttempts.value++
  questionsSinceLastJoke.value++
  
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
      
      // Show Harry Potter animation for milestone streak achievements
      if (correctStreak.value >= 5 && correctStreak.value % 5 === 0) {
        hpAnimationType.value = 'streak'
        showHPAnimation.value = true
        setTimeout(() => {
          showHPAnimation.value = false
        }, 4000) // Give 4 seconds to enjoy the animation
      }
      
      // Check for level up
      const oldDifficulty = difficulty.value
      
      // Increase difficulty every 5 correct answers
      if (correctStreak.value % 5 === 0) {
        difficulty.value = Math.min(difficulty.value + 1, 10)
        
        // Show level up animation if difficulty actually increased
        if (difficulty.value > oldDifficulty) {
          setTimeout(() => {
            hpAnimationType.value = 'levelup'
            showHPAnimation.value = true
            setTimeout(() => {
              showHPAnimation.value = false
            }, 4000)
          }, 4500) // Show after streak animation finishes
        }
      }
      
      // Random joke display (10-20% chance after at least 5 questions)
      if (questionsSinceLastJoke.value >= 5 && Math.random() < 0.15) {
        setTimeout(() => {
          showJoke.value = true
          questionsSinceLastJoke.value = 0
          setTimeout(() => {
            showJoke.value = false
          }, 12000) // Give 12 seconds to read and enjoy the joke (increased from 6)
        }, 2000)
      }
      
      setTimeout(() => {
        fetchProblem()
      }, 1500)
    } else {
      correctStreak.value = 0
      feedback.value = `Not quite. The answer is ${result.correctAnswer}`
      explanation.value = result.explanation
      showExplanation.value = true
      
      // Still check for random joke on wrong answers (lower probability)
      if (questionsSinceLastJoke.value >= 8 && Math.random() < 0.08) {
        setTimeout(() => {
          showJoke.value = true
          questionsSinceLastJoke.value = 0
          setTimeout(() => {
            showJoke.value = false
          }, 12000) // Give 12 seconds to read and enjoy the joke (increased from 6)
        }, 3000)
      }
    }
  } catch (error) {
    console.error('Error checking answer:', error)
  }
}

function toggleProblemType() {
  // Cycle through all four problem types
  const types = ['multiplication', 'division', 'addition', 'subtraction']
  const currentIndex = types.indexOf(problemType.value)
  const nextIndex = (currentIndex + 1) % types.length
  problemType.value = types[nextIndex]
  // Don't reset difficulty when switching problem types
  fetchProblem()
}

function onDifficultyChange() {
  // Fetch new problem when difficulty changes
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

function openChallengeMode() {
  showChallengeMode.value = true
}

function closeChallengeMode() {
  showChallengeMode.value = false
}
</script>

<template>
  <div class="container mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-center">
    <!-- Navigation -->
    <div class="absolute top-4 right-4 flex gap-2">
      <router-link 
        to="/austria-quiz"
        class="bg-hp-burgundy hover:bg-hp-burgundy/80 text-hp-gold font-hp px-4 py-2 rounded-lg border-2 border-hp-gold/50 transition-all duration-300 hover:scale-105 shadow-lg"
      >
        🏰 Österreich Quiz
      </router-link>
      <router-link 
        to="/shapes-quiz"
        class="bg-hp-burgundy hover:bg-hp-burgundy/80 text-hp-gold font-hp px-4 py-2 rounded-lg border-2 border-hp-gold/50 transition-all duration-300 hover:scale-105 shadow-lg"
      >
        📐 Shapes Quiz
      </router-link>
    </div>

    <!-- Challenge Mode Button -->
    <div class="absolute top-4 left-4">
      <button
        @click="openChallengeMode"
        class="bg-hp-gold hover:bg-hp-bronze text-hp-navy font-hp font-bold px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
      >
        ⚡ Challenge Mode
      </button>
    </div>

    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-5xl font-hp text-hp-gold mb-2 drop-shadow-lg">
        🧙‍♂️ Hogwards Math Academy 🧙‍♀️
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
    
    <!-- Controls -->
    <div class="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-center">
      <!-- Problem Type Toggle -->
      <button
        @click="toggleProblemType"
        class="bg-hp-burgundy hover:bg-hp-burgundy/80 text-hp-gold font-hp px-6 py-3 rounded-lg border-2 border-hp-gold/50 transition-all duration-300 hover:scale-105 shadow-lg"
      >
        Switch Operation Type
      </button>
      
      <!-- Difficulty Selector -->
      <div class="flex items-center gap-3">
        <label for="difficulty" class="text-hp-gold font-hp text-lg">
          Difficulty:
        </label>
        <select
          id="difficulty"
          v-model="difficulty"
          @change="onDifficultyChange"
          class="bg-hp-navy/80 text-hp-gold border-2 border-hp-gold/50 rounded-lg px-4 py-2 font-hp focus:outline-none focus:ring-2 focus:ring-hp-gold focus:border-transparent backdrop-blur"
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
    </div>
    
    <!-- Main Problem Card -->
    <div class="bg-gradient-to-br from-hp-burgundy/80 to-purple-900/80 backdrop-blur rounded-xl p-8 w-full max-w-2xl border-4 border-hp-gold/50 shadow-2xl">
      <div class="text-center mb-6">
        <div class="inline-block bg-hp-navy/50 px-6 py-2 rounded-lg border border-hp-gold/30">
          <p class="text-hp-gold/70 text-sm mb-1">Current Challenge</p>
          <p class="text-sm text-hp-gold/60">
            {{ problemType === 'multiplication' ? 'Multiplication Spell' : 
               problemType === 'division' ? 'Division Charm' : 
               problemType === 'addition' ? 'Addition Enchantment' : 
               'Subtraction Sorcery' }}
          </p>
        </div>
      </div>
      
      <div class="text-center mb-8">
        <p class="text-6xl font-hp text-hp-gold mb-4 drop-shadow-lg">
          {{ problemDisplay }}
        </p>
      </div>
      
      <div class="flex flex-col items-center gap-4">
        <!-- Standard Input Mode -->
        <input
          v-if="!useMultiselect"
          ref="answerInputRef"
          v-model="userAnswer"
          @keypress="handleKeyPress"
          type="number"
          placeholder="Enter your answer..."
          class="w-full max-w-md px-6 py-4 text-2xl text-center bg-white/10 border-2 border-hp-gold/50 rounded-lg text-hp-gold placeholder-hp-gold/30 focus:outline-none focus:ring-2 focus:ring-hp-gold focus:border-transparent backdrop-blur"
        />
        
        <!-- Multiselect Mode -->
        <div v-else class="w-full max-w-md grid grid-cols-2 gap-3">
          <button
            v-for="option in answerOptions"
            :key="option"
            @click="userAnswer = option.toString()"
            :class="[
              'px-6 py-4 text-2xl text-center border-2 rounded-lg transition-all duration-300 font-hp font-bold',
              userAnswer === option.toString()
                ? 'bg-hp-gold text-hp-navy border-hp-gold scale-105 shadow-lg'
                : 'bg-white/10 text-hp-gold border-hp-gold/50 hover:bg-white/20 hover:border-hp-gold hover:scale-102'
            ]"
          >
            {{ option }}
          </button>
        </div>
        
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
    
    <!-- Harry Potter Animation -->
    <HarryPotterAnimation
      v-if="showHPAnimation"
      :streak="correctStreak"
      :level="difficulty"
      :trigger-type="hpAnimationType"
    />
    
    <!-- Joke Display -->
    <JokeDisplay
      v-if="showJoke"
    />
    
    <!-- Challenge Mode -->
    <ChallengeMode
      v-if="showChallengeMode"
      @close="closeChallengeMode"
    />
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
