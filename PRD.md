### Plano do App: **PokéVidas** (atualizado v3 — decisões fechadas)

#### Decisões confirmadas

1. **Correções:** somente **Desfazer** (sem botões de `+1` prêmio).

2. **Dano fixo:** botões `+10`, `+20`, `+30`.

3. **Histórico no MVP:** inclui **Nome do torneio**.

4. **Nome do torneio é opcional:** se vazio, usar **timestamp** como identificador.

5. **Formato do timestamp (fallback e exibição):** `DD/MM/YYYY HH:mm:ss` (ex.: `25/02/2026 14:03:22`).

6. **Horário:** sempre **local do dispositivo**.

7. **Exibição quando torneio vazio:** mostrar **somente o timestamp** (sem prefixos como “Casual”).

#### 1) Visão geral

**PokéVidas** é um app simples para acompanhar durante uma partida de **Pokémon TCG**:

* **Prêmios (vidas)** de 2 jogadores (padrão 6, configurável para inteiro `>= 1`).

* **Dano do Pokémon Ativo** de cada jogador (incrementos fixos `+10/+20/+30`).

* **Histórico local** de partidas (nome do torneio opcional, data/hora, vencedor, prêmios finais).

* **Exportação em texto** para compartilhar.

Objetivo: máxima velocidade, mínimo erro, UI minimalista e responsiva.

#### 2) Escopo

##### 2.1 MVP

* Contador de prêmios para **Jogador 1** e **Jogador 2**.

* Botão grande `-1 prêmio` para cada jogador (tap simples).

* **Desfazer** última ação (para correções), cobrindo:

  * perda de prêmio

  * ajuste de dano

  * reset de dano

  * reset de jogador

  * reset de partida

* Dano do Pokémon Ativo por jogador:

  * `+10`, `+20`, `+30` (fixos)

  * `Reset dano`

* Reset:

  * Reset individual (jogador)

  * Reset total (nova partida)

* Salvar partida no histórico com:

  * **data/hora**

  * **nome do torneio (opcional)**

  * **vencedor (obrigatório)**

  * **prêmios finais**

* Exportar resultado como texto

##### 2.2 Roadmap (pós-MVP)

* Perfis de jogador (apelidos persistentes)

* Estatísticas

* Temporizador

* Backup/sincronização em nuvem (opt-in)

#### 3) Requisitos não-funcionais (atributos)

* UI minimalista, navegação simples, botões grandes.

* Responsivo e adaptável; suporte a retrato/paisagem.

* Performance: inicialização rápida; persistência leve.

* Gestos: tap e swipe (Partida ↔ Histórico).

* Teclado: foco visível e atalhos.

* Feedback visual/tátil (haptics opcional).

* Offline-first.

* Privacidade: coletar mínimo; dados locais.

* Documentação e suporte no app.

#### 4) Arquitetura de navegação (IA)

* **Partida** (home)

* **Histórico**

* **Configurações**

* **Ajuda**

#### 5) Telas

##### 5.1 Tela “Partida”

* Dois painéis (J1 e J2):

  * `Prêmios: N` + `-1 prêmio`

  * `Dano: D` + `+10/+20/+30` + `Reset dano`

* Ações globais: `Desfazer`, `Reset partida`, `Salvar resultado`

##### 5.2 Sheet “Salvar resultado” (MVP)

Campos:

* `Nome do torneio` (**opcional**)

* `Vencedor` (J1 / J2 / Empate) (**obrigatório**)

* Resumo (somente leitura): prêmios finais e data/hora

Comportamento:

* Se `Nome do torneio` estiver vazio:

  * o app gera automaticamente um **rótulo** com **data/hora local** no formato `DD/MM/YYYY HH:mm:ss`.

  * esse rótulo é usado no histórico e na exportação.

##### 5.3 Tela “Histórico”

* Cada item mostra:

  * **Torneio:**

    * se preenchido: mostrar o `Nome do torneio`

    * se vazio: mostrar **somente** o timestamp (`DD/MM/YYYY HH:mm:ss`)

  * `Vencedor`

  * `Final: J1 = x | J2 = y`

* Ações: `Ver`, `Exportar`, `Excluir`

##### 5.4 Tela “Configurações”

* `Prêmios iniciais` (inteiro `>= 1`)

* `Haptics` (on/off)

* `UI grande` (on/off)

* `Alto contraste` (on/off)

* (Opcional) `Confirmar antes de resetar` (on/off)

#### 6) Fluxos principais

##### 6.1 Contar prêmios

* Tap em `-1 prêmio`.

* Ao chegar em 0: banner “Fim de partida?” + atalho `Salvar resultado`.

##### 6.2 Correções via Desfazer (sem `+1`)

* `Desfazer` reverte a última ação (stack simples, ex.: até 30 ações).

##### 6.3 Dano do Pokémon Ativo

* Tap em `+10/+20/+30`.

* `Reset dano` zera.

##### 6.4 Salvar e exportar

* Salvar abre sheet, pede vencedor e (opcional) nome do torneio.

* Se torneio vazio, o app usa o timestamp local (`DD/MM/YYYY HH:mm:ss`).

* Exportar gera texto e chama o compartilhamento do sistema.

#### 7) Regras e validações

* `prêmios_iniciais >= 1`

* `prêmios_atual` e `dano_atual` não ficam negativos.

* Para salvar:

  * vencedor é obrigatório

  * torneio é opcional; se vazio, gera timestamp.

#### 8) Modelo de dados (local-first)

> Observação de implementação: mesmo exibindo `DD/MM/YYYY HH:mm:ss`, **também** é recomendado salvar um timestamp “cru” (epoch/ISO) para ordenação/filtros. O formato exibido é apenas apresentação.

**Match (Partida)**

* `id` (uuid)

  I/O/P: J2 dano +10/+20/+30

  Z: Desfazer

  R: Reset partida

  S: Salvar resultado

  H: Histórico

  1. Critérios de aceite (MVP)

  \[ \] Dois contadores iniciando em 6 (ou valor configurado >=1)

  \[ \] Tap simples reduz 1 prêmio

  \[ \] Dano do Pokémon Ativo com +10/+20/+30 fixos

  \[ \] Desfazer (sem +1 prêmio)

  \[ \] Reset individual e reset total

  \[ \] Histórico local salva: data/hora, vencedor, prêmios finais e torneio opcional com fallback timestamp local com segundos

  \[ \] Exportar como texto (inclui tournament_display)

  \[ \] Responsivo em retrato/paisagem + acessível via teclado

  \[ \] Funciona 100% offline

I/O/P: J2 dano +10/+20/+30

Z: Desfazer

R: Reset partida

S: Salvar resultado

H: Histórico

1. Critérios de aceite (MVP)

\[ \] Dois contadores iniciando em 6 (ou valor configurado >=1)

\[ \] Tap simples reduz 1 prêmio

\[ \] Dano do Pokémon Ativo com +10/+20/+30 fixos

\[ \] Desfazer (sem +1 prêmio)

\[ \] Reset individual e reset total

\[ \] Histórico local salva: data/hora, vencedor, prêmios finais e torneio opcional com fallback timestamp local com segundos

\[ \] Exportar como texto (inclui tournament_display)

\[ \] Responsivo em retrato/paisagem + acessível via teclado

\[ \] Funciona 100% offline
