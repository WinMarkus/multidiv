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
    
    // Focus the input field after rendering, but do not summon the mobile keyboard on small touch devices.
    await nextTick()
    if (answerInputRef.value && window.matchMedia('(min-width: 768px)').matches) {
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
  const types = ['multiplication', 'division', 'addition', 'subtraction', 'probability']
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
  <div class="space-y-6 md:space-y-8">
    <section class="grid gap-4 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
      <div class="magic-card overflow-hidden p-5 sm:p-7 md:p-8">
        <div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div class="space-y-4">
            <div class="inline-flex items-center gap-2 rounded-full border border-hp-gold/20 bg-white/5 px-3 py-2 text-xs font-black uppercase tracking-[0.22em] text-hp-gold/80">
              ✨ Academy 2.0
            </div>
            <div>
              <h1 class="magic-title font-hp">Hogwarts Math Academy</h1>
              <p class="magic-subtitle mt-3 max-w-2xl">
                Train number spells, geometry, transformations and logic quests in short magical sessions.
              </p>
            </div>
          </div>
          <button @click="openChallengeMode" class="btn-primary w-full md:w-auto">
            ⚡ Start Challenge
          </button>
        </div>
      </div>

      <div class="magic-card-soft grid grid-cols-2 gap-3 p-4 sm:grid-cols-4 lg:grid-cols-2">
        <div class="stat-pill">
          <p class="text-xs font-bold uppercase tracking-wide text-hp-gold/60">Level</p>
          <p class="mt-1 text-2xl font-black text-hp-gold">{{ difficulty }}</p>
        </div>
        <div class="stat-pill">
          <p class="text-xs font-bold uppercase tracking-wide text-hp-gold/60">Streak</p>
          <p class="mt-1 text-2xl font-black text-hp-gold">🔥 {{ correctStreak }}</p>
        </div>
        <div class="stat-pill">
          <p class="text-xs font-bold uppercase tracking-wide text-hp-gold/60">Score</p>
          <p class="mt-1 text-2xl font-black text-hp-gold">{{ score }}%</p>
        </div>
        <div class="stat-pill">
          <p class="text-xs font-bold uppercase tracking-wide text-hp-gold/60">Correct</p>
          <p class="mt-1 text-2xl font-black text-hp-gold">{{ totalCorrect }}/{{ totalAttempts }}</p>
        </div>
      </div>
    </section>

    <section class="mobile-safe-grid">
      <router-link to="/shapes-quiz" class="quest-tile">
        <div>
          <div class="text-3xl">🧊</div>
          <h2 class="mt-3 text-xl font-black text-white">3D Geometry Quest</h2>
          <p class="mt-1 text-sm text-white/65">Solids, nets, volume, surface area and Euler puzzles.</p>
        </div>
        <span class="text-sm font-black text-hp-gold">Enter geometry →</span>
      </router-link>

      <router-link to="/shape-movements" class="quest-tile">
        <div>
          <div class="text-3xl">🪄</div>
          <h2 class="mt-3 text-xl font-black text-white">Shape Movement Charms</h2>
          <p class="mt-1 text-sm text-white/65">Flip, slide, turn and build magical creatures from cut shapes.</p>
        </div>
        <span class="text-sm font-black text-hp-gold">Cast charms →</span>
      </router-link>

      <router-link to="/bodmas" class="quest-tile">
        <div>
          <div class="text-3xl">🧮</div>
          <h2 class="mt-3 text-xl font-black text-white">BODMAS Trials</h2>
          <p class="mt-1 text-sm text-white/65">Master the order of operations under pressure.</p>
        </div>
        <span class="text-sm font-black text-hp-gold">Start trial →</span>
      </router-link>

      <router-link to="/austria-quiz" class="quest-tile">
        <div>
          <div class="text-3xl">🏔️</div>
          <h2 class="mt-3 text-xl font-black text-white">Austria Quest</h2>
          <p class="mt-1 text-sm text-white/65">A geography side quest for capitals and Bundesländer.</p>
        </div>
        <span class="text-sm font-black text-hp-gold">Explore →</span>
      </router-link>
    </section>

    <section class="grid gap-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
      <aside class="magic-card-soft p-4 sm:p-5">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center lg:flex-col lg:items-stretch">
          <button @click="toggleProblemType" class="btn-secondary w-full">
            🔁 {{ problemTypeLabel }}
          </button>

          <label class="flex w-full flex-col gap-2 text-sm font-bold text-hp-gold/80">
            Difficulty
            <select
              id="difficulty"
              v-model="difficulty"
              @change="onDifficultyChange"
              class="w-full rounded-2xl border border-hp-gold/30 bg-hp-navy/70 px-4 py-3 font-bold text-hp-gold outline-none focus:ring-2 focus:ring-hp-gold/60"
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
        </div>
      </aside>

      <div class="magic-card p-5 sm:p-7">
        <div class="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p class="text-xs font-black uppercase tracking-[0.22em] text-hp-gold/60">Current Challenge</p>
            <p class="mt-1 text-lg font-black text-white">{{ problemTypeLabel }}</p>
          </div>
          <div class="rounded-full border border-hp-gold/20 bg-white/5 px-3 py-2 text-sm font-bold text-hp-gold/80">
            Level {{ difficulty }}
          </div>
        </div>

        <div class="rounded-3xl border border-hp-gold/15 bg-black/20 px-4 py-8 text-center sm:px-6 sm:py-10">
          <p class="font-hp text-[clamp(2.6rem,14vw,5.5rem)] leading-none text-hp-gold drop-shadow-lg">
            {{ problemDisplay }}
          </p>
        </div>

        <div class="mt-5 flex flex-col items-center gap-4">
          <input
            v-if="!useMultiselect"
            ref="answerInputRef"
            v-model="userAnswer"
            @keypress="handleKeyPress"
            type="number"
            inputmode="numeric"
            placeholder="Enter answer"
            class="w-full rounded-2xl border border-hp-gold/30 bg-white/10 px-5 py-4 text-center text-2xl font-black text-hp-gold placeholder-hp-gold/35 outline-none backdrop-blur focus:ring-2 focus:ring-hp-gold/60"
          />

          <div v-else class="grid w-full grid-cols-2 gap-3">
            <button
              v-for="option in answerOptions"
              :key="option"
              @click="userAnswer = option.toString()"
              :class="[
                'min-h-16 rounded-2xl border px-5 py-4 text-center text-2xl font-black transition-all duration-200 active:scale-95',
                userAnswer === option.toString()
                  ? 'border-hp-gold bg-hp-gold text-hp-navy shadow-lg'
                  : 'border-hp-gold/25 bg-white/10 text-hp-gold hover:bg-white/15'
              ]"
            >
              {{ option }}
            </button>
          </div>

          <button @click="submitAnswer" :disabled="!userAnswer" class="btn-primary w-full text-lg disabled:cursor-not-allowed disabled:opacity-45">
            Cast Answer ✨
          </button>
        </div>

        <div v-if="feedback" class="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
          <p class="text-xl font-black" :class="feedback.includes('Correct') ? 'text-emerald-300' : 'text-amber-300'">
            {{ feedback }}
          </p>
        </div>
      </div>
    </section>

    <Explanation 
      v-if="showExplanation && explanation"
      :explanation="explanation"
      :problem-type="currentProblem.type"
      @close="showExplanation = false"
    />
    
    <Celebration 
      v-if="showCelebration"
      :streak="correctStreak"
    />
    
    <HarryPotterAnimation
      v-if="showHPAnimation"
      :streak="correctStreak"
      :level="difficulty"
      :trigger-type="hpAnimationType"
    />
    
    <JokeDisplay v-if="showJoke" />
    
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
