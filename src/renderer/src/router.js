import { createRouter, createWebHashHistory } from 'vue-router';
import Home from './page/Home.vue';
import NotFound from './page/404.vue';
import CalendarMonth from './page/dashboard/CalendarMonth.vue';
import CalendarYear from './page/dashboard/CalendarYear.vue';

const routes = [
    { path: '/', component: Home },
    { path: '/calendar-month', component: CalendarMonth },
    { path: '/calendar-year', component: CalendarYear },
    { path: '/404', component: NotFound },
    { path: '/:pathMatch(.*)*', redirect: '/404' }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

export default router;