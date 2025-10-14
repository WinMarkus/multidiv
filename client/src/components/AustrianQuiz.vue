<script setup>
import { ref, computed, onMounted } from 'vue'

const bundeslaender = [
  { name: 'Wien', hauptstadt: 'Wien' },
  { name: 'Niederösterreich', hauptstadt: 'St. Pölten' },
  { name: 'Oberösterreich', hauptstadt: 'Linz' },
  { name: 'Salzburg', hauptstadt: 'Salzburg' },
  { name: 'Tirol', hauptstadt: 'Innsbruck' },
  { name: 'Vorarlberg', hauptstadt: 'Bregenz' },
  { name: 'Kärnten', hauptstadt: 'Klagenfurt' },
  { name: 'Steiermark', hauptstadt: 'Graz' },
  { name: 'Burgenland', hauptstadt: 'Eisenstadt' }
]

const currentQuestion = ref(null)
const selectedAnswer = ref('')
const score = ref(0)
const totalQuestions = ref(0)
const feedback = ref('')
const showFeedback = ref(false)
const gryffindorPoints = ref(0)

const scorePercentage = computed(() => {
  if (totalQuestions.value === 0) return 0
  return Math.round((score.value / totalQuestions.value) * 100)
})

function generateQuestion() {
  const randomBundesland = bundeslaender[Math.floor(Math.random() * bundeslaender.length)]
  
  // Create wrong answers
  const wrongAnswers = bundeslaender
    .filter(b => b.hauptstadt !== randomBundesland.hauptstadt)
    .map(b => b.hauptstadt)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
  
  // Mix correct and wrong answers
  const allAnswers = [randomBundesland.hauptstadt, ...wrongAnswers]
    .sort(() => Math.random() - 0.5)
  
  currentQuestion.value = {
    bundesland: randomBundesland.name,
    correctAnswer: randomBundesland.hauptstadt,
    options: allAnswers
  }
  
  selectedAnswer.value = ''
  showFeedback.value = false
  feedback.value = ''
}

function submitAnswer() {
  if (!selectedAnswer.value || !currentQuestion.value) return
  
  totalQuestions.value++
  
  if (selectedAnswer.value === currentQuestion.value.correctAnswer) {
    score.value++
    gryffindorPoints.value += 10
    feedback.value = '🏆 Richtig! 10 Punkte für Gryffindor! 🦁'
    showFeedback.value = true
    
    setTimeout(() => {
      generateQuestion()
    }, 2000)
  } else {
    feedback.value = `❌ Falsch! Die richtige Antwort ist: ${currentQuestion.value.correctAnswer}`
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
        ← Zurück zur Mathe-Akademie
      </router-link>
    </div>

    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-5xl font-hp text-hp-gold mb-2 drop-shadow-lg">
        🏰 Österreich Geografie Quiz 🗺️
      </h1>
      <p class="text-xl text-hp-gold/80">Sammle Punkte für Gryffindor!</p>
    </div>
    
    <!-- Stats Bar -->
    <div class="bg-hp-navy/50 backdrop-blur rounded-lg p-4 mb-6 w-full max-w-2xl border-2 border-hp-gold/30">
      <div class="grid grid-cols-3 gap-4 text-center">
        <div>
          <p class="text-hp-gold/70 text-sm">Gryffindor Punkte</p>
          <p class="text-2xl font-bold text-red-400">🦁 {{ gryffindorPoints }}</p>
        </div>
        <div>
          <p class="text-hp-gold/70 text-sm">Richtige Antworten</p>
          <p class="text-2xl font-bold text-hp-gold">{{ score }}/{{ totalQuestions }}</p>
        </div>
        <div>
          <p class="text-hp-gold/70 text-sm">Erfolgsquote</p>
          <p class="text-2xl font-bold text-hp-gold">{{ scorePercentage }}%</p>
        </div>
      </div>
    </div>
    
    <!-- Quiz Card -->
    <div class="bg-gradient-to-br from-hp-burgundy/80 to-purple-900/80 backdrop-blur rounded-xl p-8 w-full max-w-2xl border-4 border-hp-gold/50 shadow-2xl">
      <div class="text-center mb-6">
        <div class="inline-block bg-hp-navy/50 px-6 py-2 rounded-lg border border-hp-gold/30">
          <p class="text-hp-gold/70 text-sm mb-1">Geografie Herausforderung</p>
          <p class="text-sm text-hp-gold/60">Österreichische Bundesländer & Hauptstädte</p>
        </div>
      </div>
      
      <div v-if="currentQuestion" class="text-center mb-8">
        <p class="text-3xl font-hp text-hp-gold mb-6 drop-shadow-lg">
          Was ist die Hauptstadt von
        </p>
        <p class="text-5xl font-hp text-hp-gold mb-8 drop-shadow-lg">
          {{ currentQuestion.bundesland }}?
        </p>
      </div>
      
      <!-- Answer Options -->
      <div v-if="currentQuestion && !showFeedback" class="grid grid-cols-1 gap-4 mb-6">
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
          Antwort bestätigen ✨
        </button>
      </div>
      
      <!-- Feedback -->
      <div v-if="showFeedback" class="text-center">
        <p class="text-2xl font-hp" :class="feedback.includes('Richtig') ? 'text-green-400' : 'text-yellow-400'">
          {{ feedback }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>