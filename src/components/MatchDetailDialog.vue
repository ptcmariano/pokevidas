<template>
  <q-dialog
    v-model="open"
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class="column no-shadow" :class="$q.dark.isActive ? 'bg-dark' : 'bg-grey-1'">
      <q-header elevated :class="$q.dark.isActive ? 'bg-black text-white' : 'bg-white text-black'">
        <q-toolbar>
          <q-btn flat round icon="close" @click="open = false" />
          <q-toolbar-title class="text-weight-bold font-outfit">Detalhe da Partida</q-toolbar-title>
          <q-btn
            unelevated
            color="primary"
            icon="share"
            label="Exportar"
            class="rounded-borders"
            @click="emit('export', record)"
          />
        </q-toolbar>
      </q-header>

      <q-scroll-area class="col q-mt-lg">
        <div v-if="record" class="q-pa-md q-gutter-md content-max-width">
          <q-card flat bordered class="q-pa-lg rounded-xl shadow-subtle">
            <div class="text-overline text-primary q-mb-xs">TORNEIO</div>
            <div class="text-h4 text-weight-heavy font-outfit q-mb-sm">
              {{ record.tournament_display }}
            </div>
            <div class="row items-center text-grey-6">
              <q-icon name="event" size="xs" class="q-mr-xs" />
              <span class="text-caption">{{ record.timestamp_display }}</span>
            </div>
          </q-card>

          <div class="column items-center q-py-lg">
            <div class="text-overline text-grey-6 q-mb-sm">Vencedor</div>
            <div class="row items-center justify-center winner-banner q-pa-md rounded-xl shadow-2">
              <q-icon name="emoji_events" color="warning" size="md" class="q-mr-md" />
              <div class="column">
                <div class="text-h5 text-weight-bold font-outfit" :class="winnerTextColor(record.winner)">
                  {{ winnerLabel(record.winner) }}
                </div>
                <div class="text-caption text-grey-7">Parabéns ao campeão!</div>
              </div>
            </div>
          </div>

          <q-card flat bordered class="rounded-xl overflow-hidden">
             <div class="bg-primary text-white q-pa-sm text-center text-weight-bold font-outfit">
               PLACAR FINAL
             </div>
            <q-card-section class="q-pa-xl">
              <div class="row text-center items-center">
                <div class="col column items-center">
                  <div class="player-circle bg-negative text-white shadow-2 q-mb-md">
                    {{ record.j1_prizes }}
                  </div>
                  <div class="text-subtitle1 text-weight-heavy font-outfit">Jogador 1</div>
                  <div class="text-caption text-grey-6">{{ record.j1_damage }} total de dano</div>
                </div>

                <div class="col-auto q-px-md">
                  <div class="text-h6 text-grey-4">VS</div>
                </div>

                <div class="col column items-center">
                   <div class="player-circle bg-primary text-white shadow-2 q-mb-md">
                    {{ record.j2_prizes }}
                  </div>
                  <div class="text-subtitle1 text-weight-heavy font-outfit">Jogador 2</div>
                  <div class="text-caption text-grey-6">{{ record.j2_damage }} total de dano</div>
                </div>
              </div>
            </q-card-section>
          </q-card>

          <q-btn
            flat
            color="grey-6"
            label="Voltar"
            class="full-width q-mt-xl"
            @click="open = false"
          />
        </div>
      </q-scroll-area>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useQuasar } from 'quasar'
import type { MatchRecord, WinnerType } from 'src/types'

const $q = useQuasar()
const props = defineProps<{
  modelValue: boolean
  record: MatchRecord | null
}>()

const emit = defineEmits<{
  'update:modelValue': [val: boolean]
  export: [record: MatchRecord | null]
}>()

const open = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

function winnerLabel(winner: WinnerType): string {
  if (winner === 'J1') return 'Jogador 1'
  if (winner === 'J2') return 'Jogador 2'
  return 'Empate'
}

function winnerTextColor(winner: WinnerType): string {
  if (winner === 'J1') return 'text-negative'
  if (winner === 'J2') return 'text-primary'
  return 'text-grey-7'
}
</script>

<style scoped lang="scss">
.font-outfit {
  font-family: 'Outfit', sans-serif;
}

.text-weight-heavy {
  font-weight: 800;
}

.content-max-width {
  max-width: 600px;
  margin: 0 auto;
}

.rounded-xl {
  border-radius: 24px;
}

.shadow-subtle {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.winner-banner {
  background: white;
  min-width: 250px;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.body--dark .winner-banner {
  background: #1d1d1d;
  border-color: #333;
}

.player-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: 900;
  font-family: 'Outfit', sans-serif;
}

.q-toolbar-title {
  letter-spacing: -0.01em;
}
</style>
