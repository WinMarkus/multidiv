<script setup>
import { computed } from 'vue'

const props = defineProps({
  shape: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    default: 150
  }
})

const shapeColor = computed(() => {
  const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#95E1D3', '#F38181', '#AA96DA']
  return colors[Math.floor(Math.random() * colors.length)]
})
</script>

<template>
  <div class="flex items-center justify-center p-4">
    <svg :width="size" :height="size" class="drop-shadow-lg">
      <!-- Triangle -->
      <polygon 
        v-if="shape === 'triangle'"
        :points="`${size/2},${size*0.1} ${size*0.9},${size*0.9} ${size*0.1},${size*0.9}`"
        :fill="shapeColor"
        stroke="#FFD700"
        stroke-width="3"
      />
      
      <!-- Square -->
      <rect 
        v-if="shape === 'square'"
        :x="size*0.15"
        :y="size*0.15"
        :width="size*0.7"
        :height="size*0.7"
        :fill="shapeColor"
        stroke="#FFD700"
        stroke-width="3"
      />
      
      <!-- Rectangle -->
      <rect 
        v-if="shape === 'rectangle'"
        :x="size*0.1"
        :y="size*0.25"
        :width="size*0.8"
        :height="size*0.5"
        :fill="shapeColor"
        stroke="#FFD700"
        stroke-width="3"
      />
      
      <!-- Circle -->
      <circle 
        v-if="shape === 'circle'"
        :cx="size/2"
        :cy="size/2"
        :r="size*0.35"
        :fill="shapeColor"
        stroke="#FFD700"
        stroke-width="3"
      />
      
      <!-- Pentagon -->
      <polygon 
        v-if="shape === 'pentagon'"
        :points="`${size/2},${size*0.1} ${size*0.9},${size*0.4} ${size*0.75},${size*0.9} ${size*0.25},${size*0.9} ${size*0.1},${size*0.4}`"
        :fill="shapeColor"
        stroke="#FFD700"
        stroke-width="3"
      />
      
      <!-- Hexagon -->
      <polygon 
        v-if="shape === 'hexagon'"
        :points="`${size/2},${size*0.1} ${size*0.85},${size*0.3} ${size*0.85},${size*0.7} ${size/2},${size*0.9} ${size*0.15},${size*0.7} ${size*0.15},${size*0.3}`"
        :fill="shapeColor"
        stroke="#FFD700"
        stroke-width="3"
      />
      
      <!-- Octagon -->
      <polygon 
        v-if="shape === 'octagon'"
        :points="`${size*0.35},${size*0.1} ${size*0.65},${size*0.1} ${size*0.9},${size*0.35} ${size*0.9},${size*0.65} ${size*0.65},${size*0.9} ${size*0.35},${size*0.9} ${size*0.1},${size*0.65} ${size*0.1},${size*0.35}`"
        :fill="shapeColor"
        stroke="#FFD700"
        stroke-width="3"
      />
      
      <!-- Rhombus -->
      <polygon 
        v-if="shape === 'rhombus'"
        :points="`${size/2},${size*0.1} ${size*0.85},${size/2} ${size/2},${size*0.9} ${size*0.15},${size/2}`"
        :fill="shapeColor"
        stroke="#FFD700"
        stroke-width="3"
      />
      
      <!-- Trapezoid -->
      <polygon 
        v-if="shape === 'trapezoid'"
        :points="`${size*0.3},${size*0.2} ${size*0.7},${size*0.2} ${size*0.9},${size*0.8} ${size*0.1},${size*0.8}`"
        :fill="shapeColor"
        stroke="#FFD700"
        stroke-width="3"
      />
    </svg>
  </div>
</template>

<style scoped>
svg {
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3));
}
</style>
