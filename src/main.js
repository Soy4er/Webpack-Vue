import Vue from 'vue';
import VueRouter from 'vue-router';
import VueStore from 'vuex';

import App from './App.vue';
import router from './routes';
import store from './store';

Vue.use(VueRouter);
Vue.use(VueStore);

function main() {
  return new Vue({
    el: '#app',
    render: (h) => h(App),
    router,
    store,
  });
}

main();
