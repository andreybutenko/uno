import Vue from 'vue';
import Router from 'vue-router';

import Game from '@/pages/Game';
import Landing from '@/pages/Landing';
import Library from '@/pages/Library';
import Lobby from '@/pages/Lobby';

import SpinBackground from '@/components/SpinBackground';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Landing',
      component: Landing
    },
    {
      path: '/game/',
      name: 'Game',
      component: Game
    },
    {
      path: '/game/offline',
      name: 'Offline Game',
      component: Game
    },
    {
      path: '/lobby',
      name: 'Lobby',
      component: Lobby,
      beforeEnter (to, from, next) {
        Vue.prototype.$network.setupSocketio();
        next();
     }
    },
    {
      path: '/lobby/offline',
      name: 'Offline Lobby',
      component: Lobby
    },
    {
      path: '/library',
      name: 'Library',
      component: Library
    },
    {
      path: '/spin',
      name: 'Spin',
      component: SpinBackground
    }
  ]
});
