// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import {
  BootstrapVue,
  BootstrapVueIcons
} from 'bootstrap-vue';
import VueTouch from 'vue-touch';
import Trend from 'vuetrend';
import Toasted from 'vue-toasted';
import VueApexCharts from 'vue-apexcharts';
import axios from 'axios';
import store from './store';
import router from './Routes';
import App from './App';
import layoutMixin from './mixins/layout';
import {
  AuthMixin
} from './mixins/auth'
import Vuelidate from 'vuelidate'
import {
  ClientTable
} from 'vue-tables-2';
import config from './config'
import VueCryptojs from 'vue-cryptojs'

// Mixins
import {
  isPermitted
} from "./mixins/permissions";

import { isAuthenticated } from './mixins/auth'


axios.defaults.baseURL = config.baseURLApi;
Vue.use(VueCryptojs)
Vue.use(ClientTable, {
  theme: 'bootstrap4'
});
Vue.use(Vuelidate)
Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.use(VueTouch);
Vue.use(Trend);
Vue.component('apexchart', VueApexCharts);
Vue.mixin(layoutMixin);
Vue.mixin(AuthMixin);
Vue.use(Toasted, {
  duration: 10000
});

//store.dispatch('auth/doInit')
Vue.config.productionTip = false;

router.beforeEach((to, from, next) => {
  
  var rout = ""
  if (to.params.father) {
    rout = to.params.father
  } else {
    rout = to.name
  }

  const pulbicsRoutes = ['Login', 'CertColaboradoresConsulta','registro']
  if (!pulbicsRoutes.includes(rout)) {
    if (!isAuthenticated() || !isPermitted(rout)) {  
      next({
        name: 'Login'
      })
    } else {   
      next()
    }
  } else { 
    next()
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App),
});