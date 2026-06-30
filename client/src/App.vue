<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ThemeSwitcher from './components/ThemeSwitcher.vue'
import { useTheme } from './composables/useTheme'

const route = useRoute()
const { activeHouseName, activeHouseEmoji } = useTheme()

const routeTitle = computed(() => {
  switch (route.name) {
    case 'MathGame': return 'Academy Hub'
    case 'ShapesQuiz': return 'Geometry Quest'
    case 'ShapeMovements': return 'Movement Charms'
    case 'AustrianQuiz': return 'Austria Quest'
    case 'BodmasQuiz': return 'Order of Operations'
    default: return 'Hogwarts Academy'
  }
})
</script>

<template>
  <div class="academy-shell">
    <div class="academy-orb" />
    <div class="academy-orb-secondary" />

    <header class="academy-topbar">
      <div class="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 md:px-6">
        <router-link to="/" class="flex min-w-0 items-center gap-3">
          <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-hp-gold/25 bg-white/10 text-2xl shadow-lg">
            ✦
          </div>
          <div class="min-w-0">
            <p class="truncate text-sm font-black uppercase tracking-[0.22em] text-hp-gold/70">Hogwarts Academy</p>
            <p class="truncate text-base font-extrabold text-white md:text-lg">{{ routeTitle }}</p>
          </div>
        </router-link>

        <nav class="hidden items-center gap-2 md:flex">
          <router-link to="/" class="btn-ghost text-sm">Home</router-link>
          <router-link to="/shapes-quiz" class="btn-ghost text-sm">Geometry</router-link>
          <router-link to="/shape-movements" class="btn-ghost text-sm">Charms</router-link>
          <router-link to="/bodmas" class="btn-ghost text-sm">BODMAS</router-link>
          <router-link to="/austria-quiz" class="btn-ghost text-sm">Austria</router-link>
        </nav>

        <div class="flex shrink-0 items-center gap-2">
          <div class="hidden rounded-full border border-hp-gold/20 bg-white/5 px-3 py-2 text-sm font-bold text-hp-gold sm:block">
            {{ activeHouseEmoji }} {{ activeHouseName }}
          </div>
          <ThemeSwitcher />
        </div>
      </div>
    </header>

    <main class="academy-main">
      <router-view />
    </main>

    <nav class="bottom-nav md:hidden" aria-label="Mobile navigation">
      <router-link to="/">
        <span class="text-lg">🏠</span>
        <span>Home</span>
      </router-link>
      <router-link to="/shapes-quiz">
        <span class="text-lg">🧊</span>
        <span>3D</span>
      </router-link>
      <router-link to="/shape-movements">
        <span class="text-lg">🪄</span>
        <span>Charms</span>
      </router-link>
      <router-link to="/bodmas">
        <span class="text-lg">🧮</span>
        <span>BODMAS</span>
      </router-link>
    </nav>
  </div>
</template>

<style scoped>
</style>
