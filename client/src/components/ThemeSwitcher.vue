<script setup>
import { ref } from 'vue'
import { useTheme } from '../composables/useTheme'

const { currentTheme, themes } = useTheme()
const open = ref(false)

function selectTheme(id) {
  currentTheme.value = id
  open.value = false
}
</script>

<template>
  <div class="relative">
    <!-- Toggle button -->
    <button
      @click="open = !open"
      class="bg-hp-burgundy hover:bg-hp-burgundy/80 text-hp-gold font-hp px-4 py-2 rounded-lg border-2 border-hp-gold/50 transition-all duration-300 hover:scale-105 shadow-lg flex items-center gap-2"
      title="Switch house theme"
    >
      <span>{{ themes.find(t => t.id === currentTheme)?.emoji }}</span>
      <span class="hidden sm:inline">House</span>
      <span class="text-xs opacity-70">▼</span>
    </button>

    <!-- Dropdown -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 scale-95 -translate-y-1"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 -translate-y-1"
    >
      <div
        v-if="open"
        class="absolute left-0 mt-2 w-56 rounded-xl border-2 border-hp-gold/40 shadow-2xl overflow-hidden z-50"
        style="background: var(--hp-bg-gradient)"
      >
        <button
          v-for="theme in themes"
          :key="theme.id"
          @click="selectTheme(theme.id)"
          :class="[
            'w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200 font-hp',
            currentTheme === theme.id
              ? 'bg-hp-gold/20 text-hp-gold border-l-4 border-hp-gold'
              : 'text-hp-gold/80 hover:bg-hp-gold/10 border-l-4 border-transparent'
          ]"
        >
          <span class="text-xl">{{ theme.emoji }}</span>
          <div>
            <p class="font-bold leading-tight">{{ theme.label }}</p>
            <p class="text-xs opacity-60 leading-tight">{{ theme.description }}</p>
          </div>
        </button>
      </div>
    </Transition>

    <!-- Click-outside overlay -->
    <div
      v-if="open"
      class="fixed inset-0 z-40"
      @click="open = false"
    />
  </div>
</template>
