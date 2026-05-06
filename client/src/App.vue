<script setup>
import ThemeSwitcher from './components/ThemeSwitcher.vue'
import { useTheme } from './composables/useTheme'

// Initialise theme (applies class to <html> on first load)
useTheme()
</script>

<template>
  <div class="min-h-screen" style="background: var(--hp-bg-gradient)">
    <!-- Global theme switcher anchored to left centre -->
    <div class="fixed left-4 top-1/2 -translate-y-1/2 z-50">
      <ThemeSwitcher />
    </div>
    <router-view />
  </div>
</template>

<style scoped>
</style>
