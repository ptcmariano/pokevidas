import { reactive, watch } from 'vue'
import type { AppSettings } from 'src/types'

const SETTINGS_KEY = 'pokevidas_settings'

const defaults: AppSettings = {
  initialPrizes: 6,
  haptics: true,
  largeUI: false,
  highContrast: false,
  confirmReset: false,
}

function load(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (raw) return { ...defaults, ...(JSON.parse(raw) as Partial<AppSettings>) }
  } catch { /* empty */ }
  return { ...defaults }
}

const settings = reactive<AppSettings>(load())

watch(settings, (val) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(val))
}, { deep: true })

export function useSettingsStore() {
  function reset() {
    Object.assign(settings, defaults)
  }
  return { settings, reset }
}
