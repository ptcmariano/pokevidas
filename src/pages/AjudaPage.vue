<template>
  <q-page class="ajuda-page q-pa-md">
    <div class="text-h5 text-weight-bold q-mb-lg row items-center">
      <q-icon name="help_outline" class="q-mr-sm" color="primary" />
      Ajuda & Atalhos
    </div>

    <div class="q-gutter-y-md">
      <q-card flat bordered>
        <q-card-section>
          <div class="text-subtitle1 text-weight-bold q-mb-sm">O que é o PokéVidas?</div>
          <p class="text-body2 text-grey-8">
            Um assistente minimalista para suas partidas de Pokémon TCG.
            Acompanhe prêmios (vidas) e o dano do Pokémon ativo com facilidade.
          </p>
        </q-card-section>
      </q-card>

      <q-card flat bordered>
        <q-card-section>
          <div class="text-subtitle1 text-weight-bold q-mb-sm">Como usar</div>
          <q-list dense>
            <q-item>
              <q-item-section avatar>
                <q-icon name="keyboard_arrow_down" color="negative" />
              </q-item-section>
              <q-item-section>
                <q-item-label><b>-1 Prêmio:</b> Toque no botão grande para reduzir um prêmio.</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section avatar>
                <q-icon name="add" color="primary" />
              </q-item-section>
              <q-item-section>
                <q-item-label><b>Dano:</b> Use os botões +10, +20, +30 para adicionar dano.</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section avatar>
                <q-icon name="undo" color="grey" />
              </q-item-section>
              <q-item-section>
                <q-item-label><b>Desfazer:</b> Errou? Use o botão Desfazer para reverter a última ação.</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>

      <q-card flat bordered>
        <q-card-section>
          <div class="text-subtitle1 text-weight-bold q-mb-sm">Atalhos de Teclado</div>
          <q-list dense>
            <q-item>
              <q-item-section>
                <div class="row items-center justify-between">
                  <span>Desfazer</span>
                  <q-badge color="grey-3" text-color="grey-9" label="Z" />
                </div>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <div class="row items-center justify-between">
                  <span>Reset Partida</span>
                  <q-badge color="grey-3" text-color="grey-9" label="R" />
                </div>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <div class="row items-center justify-between">
                  <span>Salvar Resultado</span>
                  <q-badge color="grey-3" text-color="grey-9" label="S" />
                </div>
              </q-item-section>
            </q-item>
             <q-item>
              <q-item-section>
                <div class="row items-center justify-between">
                  <span>Alternar Abas (Swipe)</span>
                  <q-badge color="grey-3" text-color="grey-9" label="Setas / Swipe" />
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>

      <div class="text-center q-pt-md">
        <div class="text-caption text-grey-5">Desenvolvido para fãs de Pokémon TCG.</div>
        <q-btn
          flat
          dense
          color="primary"
          label="GitHub do Projeto"
          icon="code"
          href="https://github.com/tiago/pokevidas"
          target="_blank"
          size="sm"
        />
      </div>
    </div>
  </q-page>
</template>

<style scoped lang="scss">
.ajuda-page {
  max-width: 600px;
  margin: 0 auto;
}
p {
  margin-bottom: 8px;
}
</style>
