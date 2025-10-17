<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  streak: Number,
  level: Number,
  triggerType: {
    type: String,
    default: 'streak' // 'streak', 'levelup', or 'milestone'
  }
})

// Different animations based on trigger type
const animations = {
  streak: [
    {
      emoji: '🧙‍♂️✨',
      title: 'Expecto Patronum!',
      subtitle: 'Your magic grows stronger!',
      message: `${props.streak} spells cast perfectly!`
    },
    {
      emoji: '⚡🦅',
      title: 'Wingardium Leviosa!',
      subtitle: 'You\'re soaring through the challenges!',
      message: `${props.streak} correct answers in a row!`
    },
    {
      emoji: '🔮✨',
      title: 'Lumos Maxima!',
      subtitle: 'Brilliant spellwork!',
      message: `${props.streak} questions mastered!`
    },
    {
      emoji: '🦁🏆',
      title: 'Ten Points to Gryffindor!',
      subtitle: 'Outstanding performance!',
      message: `${props.streak} perfect answers!`
    }
  ],
  levelup: [
    {
      emoji: '🎓⚡',
      title: 'Level Up!',
      subtitle: 'You\'ve been promoted!',
      message: `Welcome to Level ${props.level}!`
    },
    {
      emoji: '🏰✨',
      title: 'Accio Knowledge!',
      subtitle: 'New challenges await!',
      message: `Level ${props.level} Unlocked!`
    },
    {
      emoji: '📜🔮',
      title: 'Outstanding, O!',
      subtitle: 'Professor Dumbledore is impressed!',
      message: `Advanced to Level ${props.level}!`
    }
  ],
  milestone: [
    {
      emoji: '🧙‍♀️🌟',
      title: 'Magical Milestone!',
      subtitle: 'You\'re becoming a true wizard!',
      message: 'Keep up the excellent work!'
    },
    {
      emoji: '🦉📚',
      title: 'Hedwig Approves!',
      subtitle: 'Your dedication is remarkable!',
      message: 'Continue your magical journey!'
    }
  ]
}

// Select a random animation based on trigger type
const selectedAnimation = ref(null)

onMounted(() => {
  const animationList = animations[props.triggerType] || animations.streak
  selectedAnimation.value = animationList[Math.floor(Math.random() * animationList.length)]
})
</script>

<template>
  <div v-if="selectedAnimation" class="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
    <div class="animation-container">
      <!-- Magical background glow -->
      <div class="magic-glow"></div>
      
      <div class="text-center animate-magic-entrance">
        <!-- Main emoji with rotation -->
        <div class="text-9xl mb-4 animate-float">
          {{ selectedAnimation.emoji }}
        </div>
        
        <!-- Title with sparkle effect -->
        <h2 class="text-5xl font-hp text-hp-gold mb-3 drop-shadow-2xl animate-sparkle">
          {{ selectedAnimation.title }}
        </h2>
        
        <!-- Subtitle -->
        <p class="text-2xl text-white font-hp mb-2 animate-fade-in-delayed">
          {{ selectedAnimation.subtitle }}
        </p>
        
        <!-- Message -->
        <p class="text-3xl text-hp-gold font-bold animate-fade-in-more-delayed">
          {{ selectedAnimation.message }}
        </p>
        
        <!-- Floating magical elements -->
        <div class="magic-particles">
          <div v-for="i in 30" :key="i" class="particle" :style="{ 
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
            animationDelay: Math.random() * 3 + 's',
            animationDuration: (2 + Math.random() * 2) + 's'
          }">
            {{ ['⭐', '✨', '🌟', '💫', '🔮', '⚡'][Math.floor(Math.random() * 6)] }}
          </div>
        </div>
        
        <!-- Wand trails -->
        <div class="wand-trails">
          <div v-for="i in 5" :key="i" class="wand-trail" :style="{
            animationDelay: (i * 0.2) + 's'
          }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animation-container {
  position: relative;
  width: 90vw;
  max-width: 800px;
  padding: 4rem;
  border-radius: 2rem;
  overflow: hidden;
}

.magic-glow {
  position: absolute;
  inset: -50%;
  background: radial-gradient(
    circle at center,
    rgba(212, 175, 55, 0.4) 0%,
    rgba(116, 0, 1, 0.3) 30%,
    rgba(148, 0, 211, 0.2) 60%,
    transparent 100%
  );
  animation: glow-pulse 2s ease-in-out infinite;
}

@keyframes glow-pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
}

@keyframes magic-entrance {
  0% {
    transform: scale(0) rotate(-360deg);
    opacity: 0;
  }
  60% {
    transform: scale(1.15) rotate(10deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

.animate-magic-entrance {
  animation: magic-entrance 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  25% {
    transform: translateY(-10px) rotate(5deg);
  }
  50% {
    transform: translateY(0px) rotate(0deg);
  }
  75% {
    transform: translateY(-10px) rotate(-5deg);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

@keyframes sparkle {
  0%, 100% {
    text-shadow: 
      0 0 10px rgba(212, 175, 55, 0.5),
      0 0 20px rgba(212, 175, 55, 0.3),
      0 0 30px rgba(255, 215, 0, 0.2);
    transform: scale(1);
  }
  50% {
    text-shadow: 
      0 0 20px rgba(212, 175, 55, 0.9),
      0 0 40px rgba(212, 175, 55, 0.6),
      0 0 60px rgba(255, 215, 0, 0.4),
      0 0 80px rgba(255, 215, 0, 0.2);
    transform: scale(1.05);
  }
}

.animate-sparkle {
  animation: sparkle 2s ease-in-out infinite;
}

@keyframes fade-in-delayed {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-delayed {
  animation: fade-in-delayed 1s ease-out;
}

.animate-fade-in-more-delayed {
  animation: fade-in-delayed 1.2s ease-out;
}

.magic-particles {
  position: absolute;
  inset: 0;
  overflow: visible;
  pointer-events: none;
}

.particle {
  position: absolute;
  font-size: 1.5rem;
  animation: particle-float 3s ease-out infinite;
  opacity: 0;
}

@keyframes particle-float {
  0% {
    transform: translate(0, 0) rotate(0deg) scale(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translate(
      calc(var(--random-x, 50px) - 25px),
      calc(var(--random-y, -200px))
    ) rotate(360deg) scale(0);
    opacity: 0;
  }
}

.wand-trails {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.wand-trail {
  position: absolute;
  width: 3px;
  height: 100px;
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(212, 175, 55, 0.8),
    transparent
  );
  left: 50%;
  top: -100px;
  animation: wand-sweep 2s ease-out;
  opacity: 0;
}

@keyframes wand-sweep {
  0% {
    transform: translateX(-200px) translateY(0) rotate(-45deg);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateX(200px) translateY(100vh) rotate(-45deg);
    opacity: 0;
  }
}
</style>
