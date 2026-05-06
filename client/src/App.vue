<script setup>
import ThemeSwitcher from './components/ThemeSwitcher.vue'
import { useTheme } from './composables/useTheme'

// Initialise theme (applies class to <html> on first load)
useTheme()
</script>

<template>
  <div class="min-h-screen" style="background: var(--hp-bg-gradient)">
    <!-- Global theme switcher anchored to bottom-right -->
    <div class="fixed bottom-4 right-4 z-50">
      <ThemeSwitcher />
    </div>
    <router-view />
  </div>
</template>

<style scoped>
</style>
