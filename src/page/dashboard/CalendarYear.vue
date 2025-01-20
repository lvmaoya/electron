<template>
    <div class="calendar">
        <div class="calendar-header">
            <h1 @dblclick="handleCheckDateView">{{ currentYear }}</h1>
            <div class="calendar-nav">
                <button @click="changeYear(-1)">
                    <svg t="1737097174023" class="icon" viewBox="0 0 1024 1024" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" p-id="4338" width="20" height="20">
                        <path
                            d="M729.4 871L377.9 519.5c-1.9-1.9-3.1-4.5-3.1-7.5s1.2-5.6 3.2-7.6L729.4 153c13.9-13.9 13.9-36.7 0-50.6-13.9-13.9-36.7-13.9-50.6 0L294.6 486.7c-13.9 13.9-13.9 36.7 0 50.6 0.1 0.1 0.1 0.1 0.2 0.1l384.1 384.1c13.9 13.9 36.7 13.9 50.6 0 13.8-13.8 13.8-36.6-0.1-50.5z"
                            p-id="4339" fill="#333"></path>
                        <path
                            d="M382.8 522.2c0.2 0 0.3 0.1 0.5 0.1-0.2 0-0.3 0-0.5-0.1zM381.1 521.6c0.1 0 0.1 0.1 0.2 0.1-0.1 0-0.1 0-0.2-0.1zM385.4 522.6h-0.1 0.1z"
                            p-id="4340" fill="#333"></path>
                    </svg>
                </button>
                <button @click="goToToday" class="today">今天</button>
                <button @click="changeYear(1)">
                    <svg t="1737097450443" class="icon" viewBox="0 0 1024 1024" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" p-id="1781" width="20" height="20">
                        <path
                            d="M294.6 152.99999999L646.1 504.5c1.9 1.9 3.1 4.5 3.1 7.5s-1.2 5.6-3.2 7.6L294.6 871.00000001c-13.9 13.9-13.9 36.7 0 50.59999998 13.9 13.9 36.7 13.9 50.6 1e-8L729.4 537.29999999c13.9-13.9 13.9-36.7 0-50.59999998-0.1-0.1-0.1-0.1-0.2-0.10000001l-384.1-384.10000001c-13.9-13.9-36.7-13.9-50.6 1e-8-13.8 13.8-13.8 36.6 0.1 50.49999999z"
                            p-id="1782" fill="#333"></path>
                        <path
                            d="M641.2 501.8c-0.20000001 0-0.3-0.1-0.50000001-0.1 0.20000001 0 0.29999999 0 0.50000001 0.1zM642.9 502.4c-0.1 0-0.1-0.1-0.2-0.1 0.1 0 0.1 0 0.2 0.1zM638.6 501.4l0.10000001 0-0.10000001 0z"
                            p-id="1783" fill="#333"></path>
                    </svg>
                </button>
            </div>
        </div>

        <div class="calendar-body">
            <div class="month-container" v-for="(month, index) in calendarDays">
                <div class="calendar-month" @click="handleMonthClick(index + 1)">
                    {{ chineseMonths[index] }}
                </div>
                <div class="calendar-weekdays">
                    <div v-for="day in weekdays" :key="day">{{ day }}</div>
                </div>
                <div class="day-container">
                    <div v-for="{ date, isCurrentMonth, isToday } in month" :key="date.valueOf()" :class="{
                        'calendar-day': true,
                        'current-month': isCurrentMonth,
                        'today': isToday
                    }" @click="handleDayClick(date)">
                        <div class="day-number">
                            <span>
                                {{ date.date() }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import dayjs from "dayjs";
import { computed, ref } from "vue";
import { useRouter, useRoute } from 'vue-router';
import { strToDayjs } from "../../utils/date.js";

const router = useRouter();
const route = useRoute();

const currentDate = ref(route.query.date ? strToDayjs(route.query.date) : route.query.date ?? dayjs());

const currentYear = computed(() => {
    return route.query.date ?? currentDate.value.format('YYYY年');
});

const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
const chineseMonths = [
    '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'
];


const calendarDays = computed(() => {
    const yearCalendar = [];
    // 遍历 12 个月
    for (let month = 0; month < 12; month++) {
        // 获取当月的第一天
        const firstDayOfMonth = currentDate.value.month(month).startOf('month');
        // 获取当月的最后一天
        const lastDayOfMonth = currentDate.value.month(month).endOf('month');
        // 获取当月第一天所在周的第一天（周日）
        const startDate = firstDayOfMonth.startOf('week');
        // 获取当月最后一天所在周的最后一天（周六）
        const endDate = lastDayOfMonth.endOf('week');

        const monthDays = [];
        let day = startDate;

        while (day.isBefore(endDate) || day.isSame(endDate, 'day')) {
            monthDays.push({
                date: day,
                isCurrentMonth: day.month() === month,
                isToday: day.isSame(dayjs(), 'day'),
            });
            day = day.add(1, 'day');
        }
        yearCalendar.push(monthDays);
    }
    return yearCalendar;
});

const changeYear = (delta) => {
    currentDate.value = currentDate.value.add(delta, 'year');
};

const goToToday = () => {
    currentDate.value = dayjs();
};
const handleDayClick = (date) => {
    localStorage.setItem('dashboard', '/calendar-year');
    router.push({
        path: '/',
        query: {
            date: dayjs(date.valueOf()).format('YYYY-MM-DD')
        }
    });
}
const handleMonthClick = (month) => {
    let params = currentYear.value + month + "月";
    router.replace({
        path: '/calendar-month',
        query: {
            date: params
        }
    });
}
const handleCheckDateView = () => {
    router.replace({
        path: '/calendar-month',
    });
}
</script>

<style scoped>
.calendar {
    user-select: none;
    color: #333;
    --border-style: 0.5px solid #ccc;
    display: flex;
    flex-direction: column;
    height: 100%;

    .calendar-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 10px;
        user-select: none;
        -webkit-user-select: none;
        -webkit-app-region: drag;

        h1 {
            -webkit-app-region: no-drag;
        }

        .calendar-nav {
            display: flex;
            gap: 4px;
            font-size: 14px;

            button {
                cursor: pointer;
                padding: 4px 4px;
                background-color: #fff;
                border: var(--border-style);
                border-radius: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 24px;
                -webkit-app-region: no-drag;

                svg {
                    width: 12px;
                    height: 12px;
                    fill: #333;
                }

                &.today {
                    padding: 0 12px;
                }
            }
        }
    }



    .calendar-body {
        flex: 1;
        overflow: hidden;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 12px;
        padding: 12px;
        overflow: hidden;

        .month-container {
            width: 100%;
            overflow: hidden;
            font-size: 10px;
            font-weight: 500;
            display: flex;
            flex-direction: column;

            .calendar-month {
                font-size: 16px;
                font-size: 400;
                color: #ff3b30;
                padding-left: 8px;
            }

            .calendar-weekdays {
                display: grid;
                grid-template-columns: repeat(7, 1fr);
                box-sizing: border-box;
                font-size: 10px;
                padding: 12px 0;

                &>div {
                    color: #ccc;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 400;
                }
            }

            .day-container {
                display: grid;
                grid-template-columns: repeat(7, 1fr);
                width: 100%;
                overflow: hidden;
                flex: 1;

                .calendar-day {
                    text-align: left;
                    height: 100%;
                    color: #ccc;

                    &.current-month {
                        color: #333;
                    }

                    .day-number {
                        display: flex;
                        align-items: center;
                        justify-content: center;

                        span {
                            display: block;
                        }
                    }

                    &.today {
                        font-weight: bold;
                        display: flex;
                        align-items: center;
                        justify-content: center;

                        .day-number {
                            background-color: #ff3b30;
                            color: white;
                            border-radius: 50%;
                            width: fit-content;
                            height: fit-content;
                        }
                    }
                }
            }
        }



    }
}
</style>