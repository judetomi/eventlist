import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from './plugins/vuetify';
import { VueHammer } from 'vue2-hammer'

Vue.use(VueHammer)

Vue.config.productionTip = false;

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount("#app");
