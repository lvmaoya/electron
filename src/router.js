import { createRouter, createWebHashHistory } from 'vue-router';
import Home from './page/Home.vue';
import Calendar from './page/Calendar.vue';
import NotFound from './page/404.vue';

const routes = [
    { path: '/', component: Home },
    { path: '/calendar', component: Calendar },
    { path: '/404', component: NotFound },
    { path: '/:pathMatch(.*)*', redirect: '/404' }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

export default router;