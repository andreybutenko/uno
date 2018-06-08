import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloWorld';

import Game from '@/pages/Game';
import Library from '@/pages/Library';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/game',
      name: 'Game',
      component: Game
    },
    {
      path: '/library',
      name: 'Library',
      component: Library
    }
  ]
});
