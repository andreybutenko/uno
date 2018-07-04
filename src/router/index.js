import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloWorld';

import Game from '@/pages/Game';
import Library from '@/pages/Library';
import Lobby from '@/pages/Lobby';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/lobby/'
    },
    {
      path: '/game/',
      name: 'Game',
      component: Game
    },
    {
      path: '/lobby',
      name: 'Lobby',
      component: Lobby
    },
    {
      path: '/library',
      name: 'Library',
      component: Library
    }
  ]
});
