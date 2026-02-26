export interface PlayerState {
  prizes: number
  damage: number
}

export type WinnerType = 'J1' | 'J2' | 'Empate'

export interface MatchRecord {
  id: string
  timestamp: number
  timestamp_display: string
  tournament_name: string
  tournament_display: string
  winner: WinnerType
  j1_prizes: number
  j2_prizes: number
  j1_damage: number
  j2_damage: number
}

export interface AppSettings {
  initialPrizes: number
  haptics: boolean
  largeUI: boolean
  highContrast: boolean
  confirmReset: boolean
}

export type ActionType =
  | 'PRIZE'
  | 'DAMAGE'
  | 'RESET_DAMAGE'
  | 'RESET_PLAYER'
  | 'RESET_MATCH'

export interface UndoSnapshot {
  type: ActionType
  j1: PlayerState
  j2: PlayerState
}
