import type { MatchRecord } from 'src/types'

export function formatTimestamp(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  const d = pad(date.getDate())
  const m = pad(date.getMonth() + 1)
  const y = date.getFullYear()
  const h = pad(date.getHours())
  const min = pad(date.getMinutes())
  const s = pad(date.getSeconds())
  return `${d}/${m}/${y} ${h}:${min}:${s}`
}

export function generateId(): string {
  return crypto.randomUUID()
}

export function buildExportText(record: MatchRecord): string {
  const lines = [
    'PokéVidas — Resultado',
    '='.repeat(30),
    `Torneio: ${record.tournament_display}`,
    `Data/Hora: ${record.timestamp_display}`,
    `Vencedor: ${record.winner === 'J1' ? 'Jogador 1' : record.winner === 'J2' ? 'Jogador 2' : 'Empate'}`,
    `Prêmios finais: J1 = ${record.j1_prizes} | J2 = ${record.j2_prizes}`,
  ]
  return lines.join('\n')
}
