# Copilot Instructions for pokevidas-quasar

## Build, Test, and Lint Commands
- **Install dependencies:**
  - `npm install` or `yarn`
- **Start development server:**
  - `quasar dev` or `npm run dev`
- **Build for production:**
  - `quasar build` or `npm run build`
- **Lint files:**
  - `npm run lint` or `yarn lint`
- **Testing:**
  - No test suite is currently specified (see package.json: "test" is a placeholder).

## High-Level Architecture
- Built with [Quasar Framework](https://quasar.dev/) on top of Vue 3.
- Main layout: `src/layouts/MainLayout.vue`.
- Pages: `src/pages/IndexPage.vue`, `src/pages/ErrorNotFound.vue`.
- Routing: `src/router/routes.ts` and `src/router/index.ts`.
- Components: Located in `src/components/` (e.g., `ExampleComponent.vue`, `EssentialLink.vue`).
- State and props: Uses Vue's composition API and TypeScript interfaces (see `models.ts`).
- App logic is focused on tracking Pokémon TCG matches, including player prizes, damage, and local match history (see PRD.md for feature details).

## Key Conventions
- Route definitions use lazy loading for components.
- Tournament names are optional; fallback to timestamp if not provided.
- Timestamps are always local device time, formatted as `DD/MM/YYYY HH:mm:ss`.
- History and match data are stored locally and can be exported as text.
- Only "Undo" is allowed for corrections (no +1 prize buttons).
- Damage increments are fixed: +10, +20, +30.
- When tournament is empty, only the timestamp is shown (no prefix).

---

This file summarizes build/test/lint commands, architecture, and conventions for Copilot and other AI tools. Would you like to adjust anything or add coverage for areas I may have missed?
