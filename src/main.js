import Vue from "vue";
import App from "./App.vue";

import router from "./router";
import api from "./api";
import cookies from "vue-cookies";
import axios from "./modules/axios-custom";
import directives from "./modules/directives-custom";
import vmc from "./modules/vue-marterial-custom";

// custom style
import "vue-material/dist/vue-material.min.css";
import "./assets/scss/custom.scss";

// config
Vue.config.productionTip = false;

// custome prototype
Vue.prototype.$api = api;
Vue.prototype.$axios = axios;

// plugins
Vue.use(cookies);
Vue.use(vmc);

// custom directives
Vue.directive("visible", directives.visible);

Vue.component("router-link", Vue.options.components.RouterLink);
Vue.component("router-view", Vue.options.components.RouterView);

new Vue({
	router,
	render: h => h(App)
}).$mount("#app");
