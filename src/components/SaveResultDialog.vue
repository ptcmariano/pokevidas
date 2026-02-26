<template>
  <q-dialog v-model="open" position="bottom" @hide="onHide">
    <q-card class="save-dialog full-width" :class="$q.dark.isActive ? 'bg-black' : 'bg-white'" style="border-radius: 32px 32px 0 0; max-width: 640px">
      <q-card-section class="row items-center q-pb-none q-pt-lg q-px-xl">
        <div class="text-h5 text-weight-heavy font-outfit">Salvar Resultado</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup color="grey-6" />
      </q-card-section>

      <q-card-section class="q-px-xl q-pt-lg q-pb-xl q-gutter-y-lg">
        <q-input
          v-model="form.tournamentName"
          label="Nome do torneio"
          placeholder="Ex: Regional São Paulo"
          hint="Opcional — usaremos a data/hora se vazio"
          outlined
          rounded
          clearable
          stack-label
        >
          <template #prepend>
            <q-icon name="emoji_events" color="primary" />
          </template>
        </q-input>

        <div>
          <div class="text-subtitle2 q-mb-md text-weight-bold font-outfit row items-center">
            Quem venceu? <q-icon name="info" size="xs" color="grey-5" class="q-ml-xs" />
          </div>
          <div class="row q-gutter-md">
            <q-btn
              v-for="opt in winnerOptions"
              :key="opt.value"
              :unelevated="form.winner === opt.value"
              :outline="form.winner !== opt.value"
              :color="winnerBtnColor(opt.value, form.winner === opt.value)"
              :class="['col', { 'shadow-4': form.winner === opt.value }]"
              class="rounded-xl q-py-md"
              @click="form.winner = opt.value"
            >
               <div class="column items-center">
                 <q-icon :name="opt.icon" size="sm" class="q-mb-xs" />
                 <span class="text-caption text-weight-bold">{{ opt.label }}</span>
               </div>
            </q-btn>
          </div>
        </div>

        <q-card flat bordered class="q-pa-lg rounded-xl match-summary-box">
          <div class="text-overline text-grey-6 q-mb-sm">Resumo Final</div>
          <div class="row items-center justify-between">
            <div class="column">
               <span class="text-caption text-grey-6">Jogador 1</span>
               <span class="text-h6 text-weight-bold text-negative">{{ j1Prizes }} prêmios</span>
            </div>
            <div class="text-h6 text-grey-4">/</div>
            <div class="column text-right">
               <span class="text-caption text-grey-6">Jogador 2</span>
               <span class="text-h6 text-weight-bold text-primary">{{ j2Prizes }} prêmios</span>
            </div>
          </div>
          <q-separator spaced class="q-my-md opacity-20" />
          <div class="row items-center justify-center text-caption text-grey-5">
            <q-icon name="schedule" size="14px" class="q-mr-xs" />
            {{ currentTimestamp }}
          </div>
        </q-card>

        <q-btn
          unelevated
          color="positive"
          label="Confirmar e Salvar"
          icon-right="check"
          size="lg"
          class="full-width rounded-xl q-py-md"
          :disable="!form.winner"
          @click="onSave"
        />
        
        <q-btn
          flat
          label="Cancelar"
          color="grey-6"
          class="full-width"
          v-close-popup
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useQuasar } from 'quasar'
import type { WinnerType } from 'src/types'
import { formatTimestamp } from 'src/utils/format'

const $q = useQuasar()
const props = defineProps<{
  modelValue: boolean
  j1Prizes: number
  j2Prizes: number
}>()

const emit = defineEmits<{
  'update:modelValue': [val: boolean]
  save: [tournamentName: string, winner: WinnerType]
}>()

const open = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const form = ref<{ tournamentName: string; winner: WinnerType | '' }>({
  tournamentName: '',
  winner: '',
})

const currentTimestamp = ref(formatTimestamp(new Date()))

const winnerOptions: { label: string; value: WinnerType; icon: string }[] = [
  { label: 'J1 Venceu', value: 'J1', icon: 'person' },
  { label: 'J2 Venceu', value: 'J2', icon: 'person' },
  { label: 'Empate', value: 'Empate', icon: 'sync_alt' },
]

function winnerBtnColor(value: WinnerType, selected: boolean): string {
  if (!selected) return 'grey-4'
  if (value === 'J1') return 'negative'
  if (value === 'J2') return 'primary'
  return 'grey-7'
}

watch(open, (val) => {
  if (val) {
    form.value = { tournamentName: '', winner: '' }
    currentTimestamp.value = formatTimestamp(new Date())
  }
})

function onHide() {
  emit('update:modelValue', false)
}

function onSave() {
  if (!form.value.winner) return
  emit('save', form.value.tournamentName, form.value.winner)
  open.value = false
}
</script>

<style scoped lang="scss">
.font-outfit {
  font-family: 'Outfit', sans-serif;
}

.text-weight-heavy {
  font-weight: 800;
}

.rounded-xl {
  border-radius: 18px;
}

.match-summary-box {
  background: rgba(0, 0, 0, 0.02);
  border-color: rgba(0, 0, 0, 0.05);
}

.body--dark .match-summary-box {
  background: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.1);
}

.opacity-20 {
  opacity: 0.2;
}
</style>
