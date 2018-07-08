import VueSocketio from 'vue-socket.io';
import router from '../router';

export default {
  install(Vue, options) {
    const $network = {
      get offline() {
        return router.currentRoute.path.indexOf('offline') > -1;
      },

      get online() {
        return router.currentRoute.path.indexOf('offline') == -1;
      },

      emit(eventName, payload) {
        if(!this.offline) {
          Vue.prototype.$socket.emit(eventName, payload);
        }
        else {
          console.log('Attempted to emit an event while offline: ' + eventName);
        }
      },

      setupSocketio() {
        if(!options.local) {
          Vue.use(VueSocketio, 'https://playuno.app', { path: '/socket/socket.io' });
        }
        else {
          Vue.use(VueSocketio, 'http://localhost:3000');
        }
      }
    };

    Vue.prototype.$network = $network;
  }
}