<script setup>
import { ref, onMounted } from 'vue'

const jokes = [
  {
    setup: "Why did Snape stand in the middle of the road?",
    punchline: "So you'd never know which side he's on! 🐍"
  },
  {
    setup: "How do you get a mythical creature into your house?",
    punchline: "Through the Gryffin-door! 🦁"
  },
  {
    setup: "What do you call a wizard who's good at math?",
    punchline: "A mathmagician! ✨🔢"
  },
  {
    setup: "Why did Harry Potter cross the road?",
    punchline: "Because he was Sirius-ly late! ⚡"
  },
  {
    setup: "What's a wizard's favorite subject in school?",
    punchline: "Spell-ing! 📖✨"
  },
  {
    setup: "Why don't wizards use smartphones?",
    punchline: "They prefer Howlers! 🦉📨"
  },
  {
    setup: "What do you call two Quidditch players in love?",
    punchline: "A perfect match! 🧹💕"
  },
  {
    setup: "How does Harry Potter get rid of a rash?",
    punchline: "With quit-itch! 🏥⚡"
  },
  {
    setup: "Why is Mad-Eye Moody such a good teacher?",
    punchline: "He has 360-degree vision! 👁️🔮"
  },
  {
    setup: "What's the difference between Harry Potter and Tony Hawk?",
    punchline: "One's a good brunette, the other's a broomstick! 🧹🛹"
  },
  {
    setup: "Why did Professor Dumbledore's Phoenix get detention?",
    punchline: "For playing with fire! 🔥🦅"
  },
  {
    setup: "What do you call a Hufflepuff with two brain cells?",
    punchline: "Gifted! 🦡💛 (Just kidding, we love Hufflepuffs!)"
  },
  {
    setup: "Why does Voldemort love Nagini?",
    punchline: "Because she's his main squeeze! 🐍💚"
  },
  {
    setup: "What do you call a wizard who solves math problems?",
    punchline: "A number-mancer! 🔢✨"
  },
  {
    setup: "Why did the wizard bring a ladder to Hogwarts?",
    punchline: "To reach the high scores! 🪜📈"
  }
]

const currentJoke = ref(null)
const showPunchline = ref(false)

onMounted(() => {
  // Select random joke
  currentJoke.value = jokes[Math.floor(Math.random() * jokes.length)]
  
  // Show punchline after 2 seconds
  setTimeout(() => {
    showPunchline.value = true
  }, 2000)
})
</script>

<template>
  <div v-if="currentJoke" class="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
    <div class="joke-container">
      <!-- Animated background -->
      <div class="joke-background"></div>
      
      <div class="joke-content">
        <!-- Joking wizard -->
        <div class="text-7xl mb-4 animate-bounce-gentle">
          🃏🧙‍♂️
        </div>
        
        <!-- Header -->
        <div class="joke-header">
          <h3 class="text-3xl font-hp text-hp-gold mb-4 animate-glow">
            🎭 Wizard's Joke Time! 🎭
          </h3>
        </div>
        
        <!-- Setup -->
        <div class="joke-setup animate-slide-in">
          <p class="text-2xl text-white font-hp leading-relaxed mb-6">
            {{ currentJoke.setup }}
          </p>
        </div>
        
        <!-- Punchline -->
        <transition name="punchline">
          <div v-if="showPunchline" class="joke-punchline">
            <p class="text-3xl text-hp-gold font-hp font-bold leading-relaxed">
              {{ currentJoke.punchline }}
            </p>
            <div class="laugh-emoji text-6xl mt-4 animate-laugh">
              😂
            </div>
          </div>
        </transition>
        
        <!-- Decorative sparkles -->
        <div class="sparkles">
          <div v-for="i in 15" :key="i" class="sparkle" :style="{
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
            animationDelay: Math.random() * 2 + 's'
          }">
            ✨
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.joke-container {
  position: relative;
  width: 90vw;
  max-width: 700px;
  padding: 3rem;
  background: linear-gradient(
    135deg,
    rgba(116, 0, 1, 0.95) 0%,
    rgba(148, 0, 211, 0.9) 50%,
    rgba(14, 26, 64, 0.95) 100%
  );
  border-radius: 1.5rem;
  border: 3px solid rgba(212, 175, 55, 0.5);
  box-shadow: 
    0 0 30px rgba(212, 175, 55, 0.3),
    0 0 60px rgba(148, 0, 211, 0.2),
    inset 0 0 30px rgba(0, 0, 0, 0.3);
  animation: container-entrance 0.6s ease-out;
  overflow: hidden;
}

.joke-background {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at 50% 50%,
    rgba(212, 175, 55, 0.1) 0%,
    transparent 70%
  );
  animation: pulse-glow 3s ease-in-out infinite;
}

@keyframes container-entrance {
  0% {
    transform: scale(0.8) translateY(50px);
    opacity: 0;
  }
  100% {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

@keyframes pulse-glow {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}

.joke-content {
  position: relative;
  z-index: 1;
  text-align: center;
}

@keyframes bounce-gentle {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-bounce-gentle {
  animation: bounce-gentle 2s ease-in-out infinite;
}

@keyframes glow {
  0%, 100% {
    text-shadow: 
      0 0 10px rgba(212, 175, 55, 0.6),
      0 0 20px rgba(212, 175, 55, 0.4);
  }
  50% {
    text-shadow: 
      0 0 20px rgba(212, 175, 55, 0.9),
      0 0 40px rgba(212, 175, 55, 0.6),
      0 0 60px rgba(255, 215, 0, 0.4);
  }
}

.animate-glow {
  animation: glow 2s ease-in-out infinite;
}

@keyframes slide-in {
  0% {
    transform: translateX(-50px);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-in {
  animation: slide-in 0.5s ease-out;
}

.joke-setup {
  background: rgba(0, 0, 0, 0.3);
  padding: 1.5rem;
  border-radius: 1rem;
  border: 2px solid rgba(212, 175, 55, 0.3);
}

.joke-punchline {
  background: rgba(212, 175, 55, 0.2);
  padding: 1.5rem;
  border-radius: 1rem;
  border: 2px solid rgba(212, 175, 55, 0.5);
  margin-top: 1rem;
}

/* Punchline transition */
.punchline-enter-active {
  animation: punchline-reveal 0.8s ease-out;
}

@keyframes punchline-reveal {
  0% {
    transform: scale(0.5) rotate(-10deg);
    opacity: 0;
  }
  60% {
    transform: scale(1.1) rotate(2deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

@keyframes laugh {
  0%, 100% {
    transform: rotate(-5deg) scale(1);
  }
  25% {
    transform: rotate(5deg) scale(1.1);
  }
  50% {
    transform: rotate(-5deg) scale(1);
  }
  75% {
    transform: rotate(5deg) scale(1.1);
  }
}

.animate-laugh {
  animation: laugh 1s ease-in-out infinite;
}

.sparkles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.sparkle {
  position: absolute;
  font-size: 1.5rem;
  animation: sparkle-twinkle 2s ease-in-out infinite;
}

@keyframes sparkle-twinkle {
  0%, 100% {
    opacity: 0.3;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}
</style>
