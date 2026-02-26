import { reactive, computed } from 'vue'
import type { PlayerState, UndoSnapshot, ActionType } from 'src/types'

const MAX_UNDO = 30

interface GameState {
  j1: PlayerState
  j2: PlayerState
  undoStack: UndoSnapshot[]
}

const state = reactive<GameState>({
  j1: { prizes: 6, damage: 0 },
  j2: { prizes: 6, damage: 0 },
  undoStack: [],
})

function pushSnapshot(type: ActionType): void {
  if (state.undoStack.length >= MAX_UNDO) {
    state.undoStack.shift()
  }
  state.undoStack.push({
    type,
    j1: { ...state.j1 },
    j2: { ...state.j2 },
  })
}

export function useGameStore() {
  const canUndo = computed(() => state.undoStack.length > 0)
  const gameOver = computed(() => state.j1.prizes === 0 || state.j2.prizes === 0)

  function init(initialPrizes: number) {
    state.j1 = { prizes: initialPrizes, damage: 0 }
    state.j2 = { prizes: initialPrizes, damage: 0 }
    state.undoStack = []
  }

  function takePrize(player: 'j1' | 'j2') {
    if (state[player].prizes <= 0) return
    pushSnapshot('PRIZE')
    state[player].prizes--
  }

  function addDamage(player: 'j1' | 'j2', amount: number) {
    pushSnapshot('DAMAGE')
    state[player].damage += amount
  }

  function resetDamage(player: 'j1' | 'j2') {
    if (state[player].damage === 0) return
    pushSnapshot('RESET_DAMAGE')
    state[player].damage = 0
  }

  function resetPlayer(player: 'j1' | 'j2', initialPrizes: number) {
    pushSnapshot('RESET_PLAYER')
    state[player] = { prizes: initialPrizes, damage: 0 }
  }

  function resetMatch(initialPrizes: number) {
    pushSnapshot('RESET_MATCH')
    state.j1 = { prizes: initialPrizes, damage: 0 }
    state.j2 = { prizes: initialPrizes, damage: 0 }
  }

  function undo() {
    const last = state.undoStack.pop()
    if (!last) return
    state.j1 = { ...last.j1 }
    state.j2 = { ...last.j2 }
  }

  return {
    state,
    canUndo,
    gameOver,
    init,
    takePrize,
    addDamage,
    resetDamage,
    resetPlayer,
    resetMatch,
    undo,
  }
}
