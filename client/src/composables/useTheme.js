import { computed, ref, watch } from 'vue'

export const themes = [
  { id: 'hogwarts',   label: 'Hogwarts',    emoji: '⚡', description: 'The classic Hogwarts look' },
  { id: 'gryffindor', label: 'Gryffindor',  emoji: '🦁', description: 'Courage, bravery & nerve' },
  { id: 'slytherin',  label: 'Slytherin',   emoji: '🐍', description: 'Ambition & cunning' },
  { id: 'hufflepuff', label: 'Hufflepuff',  emoji: '🦡', description: 'Patience & loyalty' },
  { id: 'ravenclaw',  label: 'Ravenclaw',   emoji: '🦅', description: 'Wisdom & learning' },
]

const STORAGE_KEY = 'hp-theme'
const VALID_IDS = new Set(themes.map(t => t.id))
const DEFAULT_THEME = 'hogwarts'

function loadSavedTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved && VALID_IDS.has(saved) ? saved : DEFAULT_THEME
  } catch {
    return DEFAULT_THEME
  }
}

const currentTheme = ref(loadSavedTheme())
const activeTheme = computed(() => themes.find(theme => theme.id === currentTheme.value) || themes[0])
const activeHouseName = computed(() => activeTheme.value.label)
const activeHouseEmoji = computed(() => activeTheme.value.emoji)
const activeHousePointsLabel = computed(() => `${activeHouseName.value} Points`)

function applyTheme(id) {
  // Remove all theme classes from <html>
  themes.forEach(t => document.documentElement.classList.remove(`theme-${t.id}`))
  document.documentElement.classList.add(`theme-${id}`)
}

// Apply immediately on load
applyTheme(currentTheme.value)

watch(currentTheme, (id) => {
  applyTheme(id)
  try {
    localStorage.setItem(STORAGE_KEY, id)
  } catch {
    // Ignore storage errors (e.g. private browsing with storage disabled)
  }
})

export function useTheme() {
  return {
    currentTheme,
    themes,
    activeTheme,
    activeHouseName,
    activeHouseEmoji,
    activeHousePointsLabel
  }
}
