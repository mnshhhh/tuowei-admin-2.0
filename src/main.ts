import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import { createPinia } from "pinia";
import axios from "axios";
axios.defaults.baseURL = "api";

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(router);
app.use(Antd);
app.mount("#app");
