import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import cookies from "vue-cookies";
import axios from "./modules/axios-custom";
// eslint-disable-next-line
import {
  MdButton,
  MdContent,
  MdField,
  MdProgress,
  MdTabs,
  MdCard,
  MdTable,
  MdRipple,
  MdEmptyState,
  MdRadio,
  MdSnackbar,
  MdTooltip,
  MdCheckbox,
  MdChips
} from "vue-material/dist/components";
import "vue-material/dist/vue-material.min.css";
import "./assets/scss/vm-theme.scss";
// import 'vue-material/dist/theme/black-green-light.css';

Vue.config.productionTip = false;

// custome prototype
Vue.prototype.$axios = axios;

// plugins
Vue.use(cookies);

// vue-material components
Vue.use(MdButton);
Vue.use(MdContent);
Vue.use(MdField);
Vue.use(MdProgress);
Vue.use(MdTabs);
Vue.use(MdTable);
Vue.use(MdCard);
Vue.use(MdRipple);
Vue.use(MdEmptyState);
Vue.use(MdRadio);
Vue.use(MdSnackbar);
Vue.use(MdTooltip);
Vue.use(MdCheckbox);
Vue.use(MdChips);

Vue.component("router-link", Vue.options.components.RouterLink);
Vue.component("router-view", Vue.options.components.RouterView);

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
