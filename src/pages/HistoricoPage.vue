<template>
  <q-page class="historico-page q-pa-md">
    <div
      v-if="records.length === 0"
      class="column items-center justify-center q-pa-xl text-center"
      style="min-height: 70vh"
    >
      <div class="empty-state-icon q-mb-lg">
        <q-icon name="history" size="5rem" color="grey-3" />
      </div>
      <div class="text-h5 text-weight-bold font-outfit text-grey-5">O histórico está vazio</div>
      <div class="text-caption text-grey-6 q-mt-sm">
        As partidas que você salvar aparecerão aqui.
      </div>
      <q-btn
        unelevated
        color="primary"
        label="Começar uma Partida"
        to="/"
        class="q-mt-xl rounded-xl q-px-lg"
      />
    </div>

    <div v-else class="content-max-width">
       <div class="row items-center justify-between q-mb-md q-px-sm">
         <div class="text-overline text-grey-6 letter-spacing-1">{{ records.length }} PARTIDAS SALVAS</div>
       </div>

       <q-list class="q-gutter-y-sm">
        <q-card
          v-for="record in records"
          :key="record.id"
          flat
          bordered
          class="history-card rounded-xl shadow-hover transition-all"
        >
          <q-card-section class="q-pa-md">
            <div class="row items-center no-wrap">
              <div class="col" @click="openDetail(record)">
                <div class="text-weight-bold font-outfit text-subtitle1 ellipsis">
                  {{ record.tournament_display }}
                </div>
                
                <div class="row items-center q-mt-xs q-gutter-x-sm">
                  <q-chip
                    dense
                    size="sm"
                    :color="winnerColor(record.winner)"
                    text-color="white"
                    class="text-weight-bold"
                  >
                    <q-icon :name="record.winner === 'Empate' ? 'sync' : 'emoji_events'" size="12px" class="q-mr-xs" />
                    {{ winnerShortLabel(record.winner) }}
                  </q-chip>
                  <div class="text-caption text-grey-5">
                    {{ record.timestamp_display.split(' ')[0] }}
                  </div>
                </div>

                <div class="text-caption text-grey-6 q-mt-sm row items-center">
                  <span class="text-negative text-weight-bold">J1</span>: {{ record.j1_prizes }}
                  <q-separator vertical spaced class="q-mx-sm" />
                  <span class="text-primary text-weight-bold">J2</span>: {{ record.j2_prizes }}
                </div>
              </div>

              <div class="col-auto row items-center q-gutter-x-xs">
                <q-btn
                  round
                  flat
                  icon="visibility"
                  color="grey-7"
                  size="sm"
                  @click="openDetail(record)"
                >
                  <q-tooltip>Ver Detalhes</q-tooltip>
                </q-btn>
                <q-btn
                  round
                  flat
                  icon="share"
                  color="primary"
                  size="sm"
                  @click="doExport(record)"
                >
                  <q-tooltip>Compartilhar</q-tooltip>
                </q-btn>
                <q-btn
                  round
                  flat
                  icon="delete_outline"
                  color="negative"
                  size="sm"
                  @click="confirmDelete(record.id)"
                >
                  <q-tooltip>Excluir</q-tooltip>
                </q-btn>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-list>
    </div>

    <MatchDetailDialog
      v-model="showDetail"
      :record="selectedRecord"
      @export="(r) => r && doExport(r)"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import MatchDetailDialog from 'components/MatchDetailDialog.vue'
import { useHistoryStore } from 'src/stores/useHistoryStore'
import type { MatchRecord, WinnerType } from 'src/types'
import { buildExportText } from 'src/utils/format'

const $q = useQuasar()
const { records, removeRecord } = useHistoryStore()

const showDetail = ref(false)
const selectedRecord = ref<MatchRecord | null>(null)

function winnerShortLabel(winner: WinnerType): string {
  if (winner === 'J1') return 'Vencedor J1'
  if (winner === 'J2') return 'Vencedor J2'
  return 'Empate'
}

function winnerColor(winner: WinnerType): string {
  if (winner === 'J1') return 'negative'
  if (winner === 'J2') return 'primary'
  return 'grey-6'
}

function openDetail(record: MatchRecord) {
  selectedRecord.value = record
  showDetail.value = true
}

async function doExport(record: MatchRecord) {
  const text = buildExportText(record)
  try {
    if (navigator.share && $q.platform.is.mobile) {
      await navigator.share({ 
        title: 'PokéVidas — Resultado',
        text: text 
      })
    } else {
      await navigator.clipboard.writeText(text)
      $q.notify({
        message: 'Copiado para a área de transferência!',
        color: 'positive',
        icon: 'content_copy',
        position: 'top',
        timeout: 2000,
      })
    }
  } catch (err) {
    console.error('Export failed', err)
  }
}

function confirmDelete(id: string) {
  $q.dialog({
    title: 'Excluir partida',
    message: 'Esta ação não pode ser desfeita. Deseja continuar?',
    cancel: { flat: true, label: 'Cancelar', color: 'grey' },
    ok: { unelevated: true, color: 'negative', label: 'Sim, Excluir', class: 'rounded-lg' },
    persistent: true,
    class: 'rounded-xl'
  }).onOk(() => {
    removeRecord(id)
    $q.notify({
      message: 'Partida removida',
      color: 'grey-8',
      icon: 'delete',
      timeout: 1000
    })
  })
}
</script>

<style scoped lang="scss">
.font-outfit {
  font-family: 'Outfit', sans-serif;
}

.content-max-width {
  max-width: 700px;
  margin: 0 auto;
}

.rounded-xl {
  border-radius: 20px;
}

.rounded-lg {
  border-radius: 12px;
}

.history-card {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  background: white;
  border-color: rgba(0, 0, 0, 0.05);

  &:hover {
    border-color: var(--q-primary);
    transform: translateY(-2px);
  }
}

.body--dark .history-card {
  background: #1d1d1d;
  border-color: #333;

  &:hover {
    border-color: var(--q-primary);
  }
}

.shadow-hover {
  &:hover {
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
  }
}

.letter-spacing-1 {
  letter-spacing: 0.1em;
}

.empty-state-icon {
  background: rgba(0, 0, 0, 0.02);
  width: 120px;
  height: 120px;
  border-radius: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.body--dark .empty-state-icon {
  background: rgba(255, 255, 255, 0.03);
}

.transition-all {
  transition: all 0.2s ease-in-out;
}
</style>
