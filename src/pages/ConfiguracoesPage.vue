<template>
  <q-page class="config-page q-pa-md">
    <div class="text-h5 text-weight-bold q-mb-lg row items-center">
      <q-icon name="settings" class="q-mr-sm" color="primary" />
      Configurações
    </div>

    <q-list bordered separator class="rounded-borders">
      <q-item-label header>Jogo</q-item-label>
      <q-item>
        <q-item-section>
          <q-item-label>Prêmios iniciais</q-item-label>
          <q-item-label caption>Quantidade de prêmios no início da partida</q-item-label>
        </q-item-section>
        <q-item-section side>
          <div class="row items-center q-gutter-sm">
            <q-btn
              flat
              round
              dense
              icon="remove"
              :disable="settings.initialPrizes <= 1"
              @click="settings.initialPrizes--"
            />
            <div class="text-h6 text-weight-bold q-px-sm">
              {{ settings.initialPrizes }}
            </div>
            <q-btn flat round dense icon="add" @click="settings.initialPrizes++" />
          </div>
        </q-item-section>
      </q-item>

      <q-item tag="label" v-ripple>
        <q-item-section>
          <q-item-label>Confirmar antes de resetar</q-item-label>
          <q-item-label caption>Evita resets acidentais</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-toggle v-model="settings.confirmReset" color="primary" />
        </q-item-section>
      </q-item>

      <q-separator />
      <q-item-label header>Interface & Feedback</q-item-label>

      <q-item tag="label" v-ripple>
        <q-item-section>
          <q-item-label>Feedback tátil (Haptics)</q-item-label>
          <q-item-label caption>Vibrar ao tocar nos botões</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-toggle v-model="settings.haptics" color="primary" />
        </q-item-section>
      </q-item>

      <q-item tag="label" v-ripple>
        <q-item-section>
          <q-item-label>UI Grande</q-item-label>
          <q-item-label caption>Aumenta o tamanho dos botões e textos</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-toggle v-model="settings.largeUI" color="primary" />
        </q-item-section>
      </q-item>

      <q-item tag="label" v-ripple>
        <q-item-section>
          <q-item-label>Alto contraste</q-item-label>
          <q-item-label caption>Cores mais vibrantes para melhor leitura</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-toggle v-model="settings.highContrast" color="primary" @update:model-value="toggleDark" />
        </q-item-section>
      </q-item>
    </q-list>

    <div class="q-mt-xl text-center">
      <q-btn
        flat
        color="negative"
        label="Resetar configurações padrão"
        icon="restart_alt"
        @click="handleReset"
      />
    </div>

    <div class="q-mt-md text-center text-grey-6 text-caption">
      PokéVidas v1.0.0
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar'
import { useSettingsStore } from 'src/stores/useSettingsStore'

const $q = useQuasar()
const { settings, reset } = useSettingsStore()

function toggleDark(val: boolean) {
  $q.dark.set(val)
}

function handleReset() {
  $q.dialog({
    title: 'Resetar padrões',
    message: 'Deseja voltar todas as configurações para o padrão?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    reset()
    $q.dark.set(settings.highContrast)
  })
}
</script>

<style scoped lang="scss">
.config-page {
  max-width: 600px;
  margin: 0 auto;
}
</style>
