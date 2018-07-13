// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlusCircle, faRocket, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faPlusCircle, faRocket, faTimesCircle);

import VueChatScroll from 'vue-chat-scroll'
Vue.use(VueChatScroll)

import App from './App';
import router from './router';
import network from './mixins/network';

Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.use(network, { local: true });

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
