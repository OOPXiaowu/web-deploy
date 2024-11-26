import { createApp } from 'vue';
import Antd from 'ant-design-vue';
import App from './App.vue';
import 'ant-design-vue/dist/reset.css';
import * as Icons from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import pinia from "@/stores";

import router from './routes/index.js';
import tool from '@/utils/tool';
import ipcRenderer from '@/utils/ipcRenderer';
import directive from '@/directive';

const app = createApp(App);

/** 挂载全局对象*/
app.config.globalProperties.$ipcRenderer = ipcRenderer;
app.config.globalProperties.$tool = tool;
app.config.globalProperties.$message = message;
app.use(Antd).use(router).use(pinia);

app.use(Antd).use(router).use(pinia);
directive(app);
app.mount('#app');

const icons = Icons;
for (const icon in icons) {
    app.component(icon, icons[icon]);
}
