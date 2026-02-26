import { reactive } from 'vue'
import type { MatchRecord } from 'src/types'

const HISTORY_KEY = 'pokevidas_history'

function load(): MatchRecord[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    if (raw) return JSON.parse(raw) as MatchRecord[]
  } catch { /* empty */ }
  return []
}

function persist(list: MatchRecord[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(list))
}

const records = reactive<MatchRecord[]>(load())

export function useHistoryStore() {
  function addRecord(record: MatchRecord) {
    records.unshift(record)
    persist(records)
  }

  function removeRecord(id: string) {
    const idx = records.findIndex((r) => r.id === id)
    if (idx !== -1) {
      records.splice(idx, 1)
      persist(records)
    }
  }

  return { records, addRecord, removeRecord }
}
