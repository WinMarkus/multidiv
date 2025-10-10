<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  streak: Number
})

const messages = [
  "🎉 Outstanding! 10 points to Gryffindor! 🎉",
  "⚡ Brilliant spellwork! Professor McGonagall is impressed! ⚡",
  "🌟 Magical! You're mastering these spells! 🌟",
  "🏆 Excellent! Hermione would be proud! 🏆",
  "✨ Spectacular! The Sorting Hat chose wisely! ✨"
]

const randomMessage = messages[Math.floor(Math.random() * messages.length)]
</script>

<template>
  <div class="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
    <div class="celebration-container">
      <div class="text-center animate-bounce-in">
        <div class="text-8xl mb-4 animate-pulse">
          🧙‍♂️
        </div>
        <h2 class="text-4xl font-hp text-hp-gold mb-4 drop-shadow-lg animate-glow">
          {{ randomMessage }}
        </h2>
        <p class="text-3xl text-white font-bold">
          {{ streak }} in a row! 🔥
        </p>
        
        <!-- Floating stars -->
        <div class="stars-container">
          <div v-for="i in 20" :key="i" class="star" :style="{ 
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
            animationDelay: Math.random() * 2 + 's'
          }">
            ⭐
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.celebration-container {
  position: relative;
  background: radial-gradient(circle, rgba(212,175,55,0.3) 0%, rgba(116,0,1,0.3) 50%, transparent 100%);
  padding: 3rem;
  border-radius: 1rem;
  animation: celebration-pulse 1s ease-in-out infinite;
}

@keyframes celebration-pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes bounce-in {
  0% {
    transform: scale(0) rotate(-180deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.2) rotate(10deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

.animate-bounce-in {
  animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes glow {
  0%, 100% {
    text-shadow: 0 0 10px rgba(212,175,55,0.5), 0 0 20px rgba(212,175,55,0.3);
  }
  50% {
    text-shadow: 0 0 20px rgba(212,175,55,0.8), 0 0 40px rgba(212,175,55,0.5);
  }
}

.animate-glow {
  animation: glow 1.5s ease-in-out infinite;
}

.stars-container {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.star {
  position: absolute;
  font-size: 2rem;
  animation: float-up 3s ease-out forwards;
}

@keyframes float-up {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(-300px) rotate(360deg);
    opacity: 0;
  }
}
</style>
