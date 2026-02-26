<template>
  <q-layout view="lHh Lpr lFf">
    <q-header bordered :class="settings.highContrast ? 'bg-dark text-white' : 'bg-white text-black'">
      <q-toolbar class="q-py-sm">
        <q-toolbar-title class="text-weight-bolder row items-center no-wrap">
          <q-icon name="sports_esports" size="32px" color="primary" class="q-mr-sm" />
          <span>{{ pageTitle }}</span>
        </q-toolbar-title>

        <q-btn flat round dense icon="help_outline" to="/ajuda" class="q-mr-sm" />
        <q-btn flat round dense icon="settings" to="/configuracoes" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view v-touch-swipe.horizontal="handleSwipe" />
    </q-page-container>

    <q-footer bordered :class="settings.highContrast ? 'bg-dark' : 'bg-white'">
      <q-tabs
        v-model="activeTab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-route-tab
          name="partida"
          icon="play_arrow"
          label="Partida"
          to="/"
          exact
        />
        <q-route-tab
          name="historico"
          icon="history"
          label="Histórico"
          to="/historico"
          exact
        />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useSettingsStore } from 'src/stores/useSettingsStore'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const { settings } = useSettingsStore()

const activeTab = ref('partida')

const pageTitle = computed(() => {
  switch (route.name) {
    case 'partida': return 'PokéVidas'
    case 'historico': return 'Histórico'
    case 'configuracoes': return 'Configurações'
    case 'ajuda': return 'Ajuda'
    default: return 'PokéVidas'
  }
})

onMounted(() => {
  $q.dark.set(settings.highContrast)
})

function handleSwipe({ direction }: { direction: string }) {
  if (direction === 'left' && route.name === 'partida') {
    router.push('/historico')
  } else if (direction === 'right' && route.name === 'historico') {
    router.push('/')
  }
}
</script>

<style lang="scss">
.q-footer {
  .q-tab__label {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
}

// Global styles for custom feeling
body {
  font-family: 'Inter', '-apple-system', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  background-color: #f5f5f7;
}

.body--dark {
  background-color: #121212;
}

.rounded-borders {
  border-radius: 12px;
}
</style>
