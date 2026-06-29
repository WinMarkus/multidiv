<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ThemeSwitcher from './components/ThemeSwitcher.vue'
import { useTheme } from './composables/useTheme'

const route = useRoute()
const showShapeMovementsLink = computed(() => route.name === 'MathGame')

// Initialise theme (applies class to <html> on first load)
useTheme()
</script>

<template>
  <div class="min-h-screen" style="background: var(--hp-bg-gradient)">
    <!-- Global theme switcher anchored to left center -->
    <div class="fixed left-4 top-1/2 -translate-y-1/2 z-50">
      <ThemeSwitcher />
    </div>

    <!-- Start-page shortcut for the interactive transformation mode -->
    <router-link
      v-if="showShapeMovementsLink"
      to="/shape-movements"
      class="fixed right-4 top-20 z-50 bg-hp-burgundy hover:bg-hp-burgundy/80 text-hp-gold font-hp px-4 py-2 rounded-lg border-2 border-hp-gold/50 transition-all duration-300 hover:scale-105 shadow-lg"
    >
      🪞 Shape Movement Charms
    </router-link>

    <router-view />
  </div>
</template>

<style scoped>
</style>
