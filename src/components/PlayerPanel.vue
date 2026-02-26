<template>
  <q-card
    flat
    bordered
    class="player-panel column no-shadow"
    :class="[
      { 'player-panel--large': largeUI },
      player === 'j1' ? 'player-panel--j1' : 'player-panel--j2',
      $q.dark.isActive ? 'bg-dark shadow-inset' : 'bg-white shadow-2'
    ]"
  >
    <div
      class="player-panel__header text-center q-py-xl relative-position overflow-hidden"
      :class="player === 'j1' ? 'bg-negative' : 'bg-primary'"
    >
      <!-- Decorative background icon -->
      <q-icon
        name="catching_pokemon"
        class="absolute-center decorative-icon"
        size="200px"
      />

      <div class="relative-position">
        <div class="text-overline text-white q-mb-md font-outfit letter-spacing-2" style="opacity: 0.9">
          {{ player === 'j1' ? 'JOGADOR 1' : 'JOGADOR 2' }}
        </div>
        <div
          class="text-weight-black text-white prize-number"
          :class="largeUI ? 'text-h1' : 'text-h2'"
        >
          {{ playerState.prizes }}
        </div>
        <div class="text-caption text-white q-mt-sm font-outfit" style="opacity: 0.8; letter-spacing: 0.05em">
          PRÊMIOS RESTANTES
        </div>
      </div>
    </div>

    <div class="q-pa-lg col column q-gutter-md">
      <q-btn
        unelevated
        :color="player === 'j1' ? 'negative' : 'primary'"
        :label="playerState.prizes === 0 ? 'SEM PRÊMIOS' : '-1 PRÊMIO'"
        :disable="playerState.prizes <= 0"
        class="full-width prize-btn rounded-xl"
        :size="largeUI ? 'xl' : 'lg'"
        @click="emit('take-prize')"
      >
        <q-icon left name="remove_circle_outline" size="sm" />
      </q-btn>

      <q-separator spaced class="opacity-10" />

      <div class="damage-section q-pa-md rounded-xl" :class="$q.dark.isActive ? 'bg-black' : 'bg-grey-1'">
        <div class="row items-center justify-between q-mb-md">
          <span class="text-caption text-grey-6 text-uppercase text-weight-bold font-outfit letter-spacing-1">
             Dano do Ativo
          </span>
          <q-badge
            class="damage-badge text-weight-black font-outfit"
            :class="player === 'j1' ? 'bg-negative' : 'bg-primary'"
            :label="playerState.damage"
            v-if="playerState.damage > 0"
          />
           <span v-else class="text-caption text-grey-4">0</span>
        </div>

        <div class="row q-gutter-sm no-wrap">
          <q-btn
            v-for="dmg in [10, 20, 30]"
            :key="dmg"
            :label="`+${dmg}`"
            unelevated
            :class="player === 'j1' ? 'bg-deep-orange-1 text-deep-orange' : 'bg-light-blue-1 text-light-blue'"
            class="col rounded-lg text-weight-bold"
            :size="largeUI ? 'md' : 'sm'"
            @click="emit('add-damage', dmg)"
          />
        </div>

        <q-btn
          flat
          dense
          class="full-width q-mt-sm rounded-lg"
          color="grey-6"
          icon="refresh"
          label="Resetar dano"
          :disable="playerState.damage === 0"
          size="sm"
          @click="emit('reset-damage')"
        />
      </div>

      <div class="row q-gutter-sm">
         <q-btn
          flat
          dense
          class="col rounded-lg opacity-60"
          color="grey-7"
          icon="person_remove"
          label="Reset Jogador"
          size="xs"
          @click="emit('reset-player')"
        />
      </div>
    </div>
  </q-card>
</template>

<script setup lang="ts">
import type { PlayerState } from 'src/types'
import { useQuasar } from 'quasar'

const $q = useQuasar()
defineProps<{
  player: 'j1' | 'j2'
  playerState: PlayerState
  largeUI: boolean
}>()

const emit = defineEmits<{
  'take-prize': []
  'add-damage': [amount: number]
  'reset-damage': []
  'reset-player': []
}>()
</script>

<style scoped lang="scss">
.font-outfit {
  font-family: 'Outfit', sans-serif;
}

.letter-spacing-2 {
  letter-spacing: 0.2em;
}

.letter-spacing-1 {
  letter-spacing: 0.1em;
}

.player-panel {
  border-radius: 32px;
  overflow: hidden;
  transition: transform 0.2s ease;

  &:active {
    transform: scale(0.99);
  }

  &--j1 {
    border: 2px solid rgba(var(--q-negative), 0.1);
  }
  &--j2 {
    border: 2px solid rgba(var(--q-primary), 0.1);
  }
}

.prize-number {
  line-height: 0.9;
  font-family: 'Outfit', sans-serif;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.decorative-icon {
  opacity: 0.1;
  transform: translate(-30%, -20%) rotate(-15deg);
  pointer-events: none;
}

.prize-btn {
  height: 64px;
  letter-spacing: 0.05em;
  font-weight: 800;
  font-family: 'Outfit', sans-serif;
}

.damage-badge {
  font-size: 1.1rem;
  padding: 4px 12px;
  border-radius: 8px;
}

.rounded-xl {
  border-radius: 20px;
}

.rounded-lg {
  border-radius: 12px;
}

.opacity-10 { opacity: 0.1; }
.opacity-60 { opacity: 0.6; }

.shadow-inset {
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.5);
}
</style>
