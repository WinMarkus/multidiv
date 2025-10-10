<script setup>
const props = defineProps({
  explanation: Object,
  problemType: String
})

const emit = defineEmits(['close'])
</script>

<template>
  <div class="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
    <div class="bg-gradient-to-br from-hp-navy to-purple-900 rounded-xl p-8 max-w-2xl w-full border-4 border-hp-gold/50 shadow-2xl max-h-[80vh] overflow-y-auto">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-3xl font-hp text-hp-gold">📜 Explanation Scroll 📜</h2>
        <button
          @click="emit('close')"
          class="text-hp-gold hover:text-hp-bronze text-2xl font-bold"
        >
          ✕
        </button>
      </div>
      
      <div class="bg-white/10 rounded-lg p-6 backdrop-blur">
        <p class="text-xl text-hp-gold mb-4 font-hp">{{ explanation.explanation }}</p>
        
        <div v-if="problemType === 'multiplication'" class="space-y-3">
          <div v-for="(step, index) in explanation.steps" :key="index" class="bg-hp-burgundy/30 p-4 rounded-lg border border-hp-gold/30">
            <p class="text-lg text-white">{{ step.description }}</p>
          </div>
          
          <div class="border-t-2 border-hp-gold/50 pt-4 mt-4">
            <p class="text-xl text-hp-gold font-bold">
              Total: {{ explanation.total }}
            </p>
          </div>
        </div>
        
        <div v-else class="space-y-3">
          <div v-for="(step, index) in explanation.steps" :key="index" class="bg-hp-burgundy/30 p-4 rounded-lg border border-hp-gold/30">
            <p class="text-lg text-white mb-2">Step {{ index + 1 }}: {{ step.description }}</p>
            <div class="pl-4 text-white/80">
              <p>Working number: {{ step.working }}</p>
              <p>Subtract: {{ step.subtract }}</p>
              <p>Remainder: {{ step.remainder }}</p>
            </div>
          </div>
          
          <div class="border-t-2 border-hp-gold/50 pt-4 mt-4">
            <p class="text-xl text-hp-gold font-bold">
              Answer: {{ explanation.quotient }}
              <span v-if="explanation.remainder > 0" class="text-lg">
                (Remainder: {{ explanation.remainder }})
              </span>
            </p>
          </div>
        </div>
        
        <div class="mt-6 text-center">
          <p class="text-hp-gold/80 italic">Study this spell carefully! 🔮</p>
        </div>
      </div>
      
      <div class="mt-6 text-center">
        <button
          @click="emit('close')"
          class="bg-hp-gold hover:bg-hp-bronze text-hp-navy font-hp font-bold px-8 py-3 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
        >
          Continue Learning
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
