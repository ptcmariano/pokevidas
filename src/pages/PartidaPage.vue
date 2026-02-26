<template>
  <q-page class="partida-page q-pb-xl">
    <transition
      appear
      enter-active-class="animated fadeInDown"
      leave-active-class="animated fadeOutUp"
    >
      <q-banner
        v-if="gameOver"
        class="bg-warning text-black q-mx-md q-mt-md rounded-xl shadow-4"
        inline-actions
      >
        <template #avatar>
          <q-icon name="emoji_events" color="black" size="md" class="q-mr-sm" />
        </template>
        <div class="column">
          <span class="text-weight-black font-outfit text-h6">FIM DE PARTIDA!</span>
          <span class="text-caption">Deseja salvar o resultado agora?</span>
        </div>
        <template #action>
          <q-btn unelevated color="black" text-color="white" label="Salvar Agora" icon="save" class="rounded-lg" @click="showSave = true" />
        </template>
      </q-banner>
    </transition>

    <div class="row q-pa-md q-col-gutter-lg">
      <div class="col-12 col-sm-6">
        <PlayerPanel
          player="j1"
          :player-state="state.j1"
          :large-u-i="settings.largeUI"
          @take-prize="handleTakePrize('j1')"
          @add-damage="(a) => handleAddDamage('j1', a)"
          @reset-damage="handleResetDamage('j1')"
          @reset-player="handleResetPlayer('j1')"
        />
      </div>
      <div class="col-12 col-sm-6">
        <PlayerPanel
          player="j2"
          :player-state="state.j2"
          :large-u-i="settings.largeUI"
          @take-prize="handleTakePrize('j2')"
          @add-damage="(a) => handleAddDamage('j2', a)"
          @reset-damage="handleResetDamage('j2')"
          @reset-player="handleResetPlayer('j2')"
        />
      </div>
    </div>

    <div class="fixed-bottom-actions q-px-md q-pb-md">
       <div class="row items-center q-gutter-md no-wrap">
          <q-btn
            unelevated
            padding="12px"
            icon="undo"
            color="grey-3"
            text-color="grey-9"
            :disable="!canUndo"
            class="rounded-xl flex-shrink"
            @click="undo()"
          >
            <q-tooltip v-if="!$q.platform.is.mobile">Desfazer (Z)</q-tooltip>
          </q-btn>

          <q-btn
            unelevated
            class="col rounded-xl font-outfit text-weight-bold"
            icon="restart_alt"
            label="Novo Jogo"
            color="grey-4"
            text-color="grey-9"
            size="lg"
            @click="handleResetMatch"
          />

          <q-btn
            unelevated
            class="col-auto rounded-xl font-outfit text-weight-bold"
            icon="save"
            label="Salvar"
            color="positive"
            size="lg"
            padding="12px 24px"
            @click="showSave = true"
          />
       </div>
    </div>

    <SaveResultDialog
      v-model="showSave"
      :j1-prizes="state.j1.prizes"
      :j2-prizes="state.j2.prizes"
      @save="handleSave"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useQuasar } from 'quasar'
import PlayerPanel from 'components/PlayerPanel.vue'
import SaveResultDialog from 'components/SaveResultDialog.vue'
import { useGameStore } from 'src/stores/useGameStore'
import { useSettingsStore } from 'src/stores/useSettingsStore'
import { useHistoryStore } from 'src/stores/useHistoryStore'
import type { WinnerType } from 'src/types'
import { formatTimestamp, generateId } from 'src/utils/format'

const $q = useQuasar()
const { state, canUndo, gameOver, init, takePrize, addDamage, resetDamage, resetPlayer, resetMatch, undo } = useGameStore()
const { settings } = useSettingsStore()
const { addRecord } = useHistoryStore()

const showSave = ref(false)

onMounted(() => {
  init(settings.initialPrizes)
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
})

function onKeydown(e: KeyboardEvent) {
  const tag = (e.target as HTMLElement).tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA') return
  switch (e.key.toLowerCase()) {
    case 'z': undo(); break
    case 'r': handleResetMatch(); break
    case 's': showSave.value = true; break
  }
}

function vibrate(ms = 50) {
  if (settings.haptics && navigator.vibrate) try { navigator.vibrate(ms) } catch { /* ignore */ }
}

function handleTakePrize(player: 'j1' | 'j2') {
  vibrate(50)
  takePrize(player)
}

function handleAddDamage(player: 'j1' | 'j2', amount: number) {
  vibrate(30)
  addDamage(player, amount)
}

function handleResetDamage(player: 'j1' | 'j2') {
  resetDamage(player)
}

function handleResetPlayer(player: 'j1' | 'j2') {
  const label = player === 'j1' ? 'Jogador 1' : 'Jogador 2'
  if (settings.confirmReset) {
    $q.dialog({
      title: 'Confirmar reset',
      message: `Deseja resetar o progresso do ${label}?`,
      cancel: { flat: true, label: 'Cancelar', color: 'grey' },
      ok: { unelevated: true, color: 'negative', label: 'Resetar', class: 'rounded-lg' },
      persistent: true,
      class: 'rounded-xl'
    }).onOk(() => resetPlayer(player, settings.initialPrizes))
  } else {
    resetPlayer(player, settings.initialPrizes)
  }
}

function handleResetMatch() {
  if (settings.confirmReset) {
    $q.dialog({
      title: 'Zerar Partida',
      message: 'Isso irá resetar ambos os jogadores. Continuar?',
      cancel: { flat: true, label: 'Cancelar', color: 'grey' },
      ok: { unelevated: true, color: 'negative', label: 'Sim, Resetar', class: 'rounded-lg' },
      persistent: true,
      class: 'rounded-xl'
    }).onOk(() => resetMatch(settings.initialPrizes))
  } else {
    resetMatch(settings.initialPrizes)
  }
}

function handleSave(tournamentName: string, winner: WinnerType) {
  const now = new Date()
  const timestamp_display = formatTimestamp(now)
  const trimmed = tournamentName.trim()
  addRecord({
    id: generateId(),
    timestamp: now.getTime(),
    timestamp_display,
    tournament_name: trimmed,
    tournament_display: trimmed || timestamp_display,
    winner,
    j1_prizes: state.j1.prizes,
    j2_prizes: state.j2.prizes,
    j1_damage: state.j1.damage,
    j2_damage: state.j2.damage,
  })
  $q.notify({
    message: 'Partida salva no histórico!',
    color: 'positive',
    icon: 'check_circle',
    position: 'top',
    timeout: 2000,
  })
  init(settings.initialPrizes)
}
</script>

<style scoped lang="scss">
.font-outfit {
  font-family: 'Outfit', sans-serif;
}

.rounded-xl {
  border-radius: 20px;
}

.rounded-lg {
  border-radius: 12px;
}

.fixed-bottom-actions {
  z-index: 10;
  max-width: 800px;
  margin: 0 auto;
  left: 0;
  right: 0;
}

.flex-shrink {
  flex-shrink: 0;
}

.body--dark .bg-grey-3 {
  background: #333 !important;
  color: #fff !important;
}

.body--dark .bg-grey-4 {
  background: #444 !important;
  color: #fff !important;
}
</style>
