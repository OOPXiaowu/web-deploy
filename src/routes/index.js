// import 'nprogress/css/nprogress.css'; // 进度条样式
import { createRouter, createWebHashHistory } from 'vue-router';

const basicRoutes = [
    {
        path: '/',
        component: () => import('../layout/index.vue'),
        children: [
            {
                path: '',
                name: 'Home',
                component: () => import('../views/main/index.vue'),
            },
        ],
    },
]

export const router = createRouter({
    // process.env.BASE_URL
    history: createWebHashHistory(''),
    routes: basicRoutes,
});

export default router;