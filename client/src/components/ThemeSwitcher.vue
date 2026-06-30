<script setup>
import { ref } from 'vue'
import { useTheme } from '../composables/useTheme'

const { currentTheme, themes, activeHouseEmoji } = useTheme()
const open = ref(false)

function selectTheme(id) {
  currentTheme.value = id
  open.value = false
}
</script>

<template>
  <div class="relative">
    <button
      @click="open = !open"
      class="flex h-11 items-center gap-2 rounded-2xl border border-hp-gold/20 bg-white/10 px-3 font-black text-hp-gold shadow-lg transition-all duration-200 hover:bg-white/15 active:scale-95"
      title="Switch house theme"
      aria-label="Switch house theme"
    >
      <span class="text-xl">{{ activeHouseEmoji }}</span>
      <span class="hidden sm:inline">House</span>
      <span class="text-xs opacity-70">▼</span>
    </button>

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
        class="absolute right-0 mt-3 w-64 overflow-hidden rounded-3xl border border-hp-gold/20 bg-hp-navy/95 shadow-2xl backdrop-blur-xl"
      >
        <button
          v-for="theme in themes"
          :key="theme.id"
          @click="selectTheme(theme.id)"
          :class="[
            'flex w-full items-center gap-3 px-4 py-4 text-left transition-all duration-200',
            currentTheme === theme.id
              ? 'bg-hp-gold/15 text-hp-gold'
              : 'text-white/75 hover:bg-white/10 hover:text-white'
          ]"
        >
          <span class="text-2xl">{{ theme.emoji }}</span>
          <div>
            <p class="font-black leading-tight">{{ theme.label }}</p>
            <p class="text-xs opacity-65 leading-tight">{{ theme.description }}</p>
          </div>
        </button>
      </div>
    </Transition>

    <div
      v-if="open"
      class="fixed inset-0 z-[-1]"
      @click="open = false"
    />
  </div>
</template>
