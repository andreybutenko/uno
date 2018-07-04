// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueSocketio from 'vue-socket.io';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faPlusCircle);

import App from './App';
import router from './router';

Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.use(VueSocketio, 'https://playuno.app', { path: '/socket/socket.io' });


Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
