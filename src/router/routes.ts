import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'partida', component: () => import('pages/PartidaPage.vue') },
      { path: 'historico', name: 'historico', component: () => import('pages/HistoricoPage.vue') },
      { path: 'configuracoes', name: 'configuracoes', component: () => import('pages/ConfiguracoesPage.vue') },
      { path: 'ajuda', name: 'ajuda', component: () => import('pages/AjudaPage.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
