<template>
    <div class="calendar" @wheel="handleWheel">
        <div class="calendar-header">
            <h1 @dblclick="handleCheckDateView">{{ currentMonth }}</h1>
            <div class="calendar-nav">
                <button @click="changeMonth(-1)">
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
                <button @click="changeMonth(1)">
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
        <div class="calendar-weekdays">
            <div v-for="day in weekdays" :key="day">{{ day }}</div>
        </div>
        <div class="calendar-body" ref="calendarBodyRef"
            :style="{ 'grid-template-rows': `repeat(${Math.ceil(calendarDays.length / 7)}, 1fr)` }">
            <div v-for="{ date, isCurrentMonth, isToday, todos, progress } in calendarDays" :key="date.valueOf()"
                :class="{
                    'calendar-day': true,
                    'current-month': isCurrentMonth,
                    'today': isToday
                }" @dblclick="handleDayClick(date)">
                <div class="top">
                    <div class="day-number">
                        <span>
                            {{ date.date() }}
                        </span>
                        <span>
                            日
                        </span>
                    </div>
                    <div class="progress">
                        <div class="progress-bar">
                            {{ progress.toFixed(0) }}%
                        </div>
                    </div>
                </div>
                <div class="middle">
                    <!-- 日程列表 -->
                    <div class="schedule-list">
                        <div v-for="(schedule, index) in todos" :key="schedule.id">
                            <div class="schedule-title" :class="getProgressClass(schedule.progress, index)"
                                v-if="(todos.length <= maxVisible && index < maxVisible) || (todos.length > maxVisible && index < maxVisible - 1)">
                                {{ schedule.taskName }}</div>
                        </div>
                        <div class="schedule-title hide" v-if="todos.length > maxVisible">还有{{ todos.length
                            - maxVisible + 1 }}项...</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import dayjs from "dayjs";
import { computed, ref, onMounted, onUnmounted, watch, onBeforeUnmount } from "vue";
import { useRouter, useRoute } from 'vue-router';
import { strToDayjs } from "../../utils/date.js";
import { throttle } from "@/utils/throttle.js";
import { getTodos } from '@/api/api';

const router = useRouter();
const route = useRoute();
const currentDate = ref(route.query.date ? strToDayjs(route.query.date) : route.query.date ?? dayjs());
const calendarBodyRef = ref(null);
const resizeObserver = new ResizeObserver(entries => {
    updateMaxVisible();
});
const updateMaxVisible = () => {
    if (calendarBodyRef.value) {
        let height = calendarBodyRef.value.offsetHeight;
        height = height / Math.ceil(calendarDays.value.length / 7)
        if (height < 80) {
            maxVisible.value = 3;
        } else {
            maxVisible.value = Math.floor((height - 20 - 60) / 20) + 3;
        }
    }
}
const currentMonth = computed(() => {
    return route.query.date ?? currentDate.value.format('YYYY年M月');
});

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const todoList = ref([]);
const maxVisible = ref(3);

const calendarDays = computed(() => {
    const firstDayOfMonth = currentDate.value.startOf('month');
    const lastDayOfMonth = currentDate.value.endOf('month');
    const startDate = firstDayOfMonth.startOf('week');
    const endDate = lastDayOfMonth.endOf('week');

    const days = [];
    let day = startDate;

    while (day.isBefore(endDate) || day.isSame(endDate, 'day')) {
        const todos = todoList.value.filter(todo => dayjs(todo.dueDate).isSame(day, 'day'));
        let progress = 0;

        if (todos.length) {
            progress = todos.reduce((accumulator, currentValue) => {
                return accumulator + currentValue.progress;
            }, 0) / (todos.length * 100) * 100;
        }
        days.push({
            date: day,
            isCurrentMonth: day.month() === currentDate.value.month(),
            isToday: day.isSame(dayjs(), 'day'),
            todos,
            progress
        });
        day = day.add(1, 'day');
    }
    return days;
});
const getProgressClass = (progress, index) => {
    if (progress >= 0 && progress < 20) {
        return 'progress-low';
    } else if (progress >= 20 && progress < 60) {
        return 'progress-medium';
    } else if (progress >= 60 && progress < 80) {
        return 'progress-high';
    } else {
        return 'progress-complete';
    }
}
const getAllTodos = async () => {
    let data = {
        page: 1,
        pagesize: 99999999,
    }
    const response = await getTodos(data);
    todoList.value = response?.records;
};

onMounted(() => {
    getAllTodos();
    if (calendarBodyRef.value) {
        resizeObserver.observe(calendarBodyRef.value);
    }
});

onBeforeUnmount(() => {
    if (calendarBodyRef.value) {
        resizeObserver.unobserve(calendarBodyRef.value);
    }
});

const changeMonth = (delta) => {
    currentDate.value = currentDate.value.add(delta, 'month');
};

const goToToday = () => {
    currentDate.value = dayjs();
};
const handleDayClick = (date) => {
    localStorage.setItem('dashboard', '/calendar-month');
    router.push({
        path: '/',
        query: {
            date: dayjs(date.valueOf()).format('YYYY-MM-DD')
        }
    });
}
const handleCheckDateView = () => {
    router.replace({
        path: '/calendar-year',
        query: {
            date: currentDate.value.format('YYYY年')
        }
    });
}

const wheel = (event) => {
    if (route.query.date) {
        router.push({
            path: route.path
        });
    }
    if (event.deltaY > 0) {
        changeMonth(-1)
    } else {
        changeMonth(1)
    }
    updateMaxVisible();
};

const throttledWheel = throttle(wheel, 300, true);

const handleWheel = () => throttledWheel(event);

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

    .calendar-weekdays {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        height: 30px;

        &>div {
            text-align: right;
            color: #666;
            padding: 4px;
            display: flex;
            align-items: end;
            justify-content: end;
        }
    }

    .calendar-body {
        flex: 1;
        overflow: hidden;
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        border-top: var(--border-style);
        border-left: var(--border-style);

        .calendar-day {
            text-align: left;
            padding: 4px;
            border-right: var(--border-style);
            border-bottom: var(--border-style);
            color: #ccc;
            min-height: 0;
            min-width: 0;
            overflow: hidden;

            &:nth-child(7n) {
                background-color: rgba(204, 204, 204, 0.1) !important;
            }

            &:nth-child(7n + 1) {
                background-color: rgba(204, 204, 204, 0.1) !important;
            }

            &.current-month {
                /* background-color: rgba(255, 255, 255, 1); */
                color: #333;
            }

            .top {
                display: flex;
                gap: 4px;
                justify-content: space-between;
                margin-bottom: 4px;

                .day-number {
                    display: flex;
                    align-items: center;
                    justify-content: center;

                    span {
                        display: block;
                    }
                }

                .progress {
                    font-size: 14px;
                    color: #ccc;
                }
            }

            .middle {
                display: flex;
                flex-direction: column;
                gap: 4px;
                flex: 1;
                overflow: hidden;

                .schedule-list {
                    .schedule-title {
                        font-size: 10px;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        padding: 2px 4px;
                        border-radius: 83px;
                        color: white;
                        max-width: 100%;
                        margin-bottom: 2px;
                    }

                }
            }

            &.today {

                .day-number {
                    font-weight: bold;
                    /* background-color: #ff3b30; */
                    color: #ff3b30;
                    border-radius: 50%;
                    /* width: 28px;
                    height: 28px; */
                    /* text-align: center;
                    line-height: 28px; */
                }
            }
        }
    }
}

/* 进度等级样式 */
.progress-low {
    background-color: rgba(255, 0, 0, 0.5);
    /* 红色，透明度 0.5 */
}

.progress-medium {
    background-color: rgba(212, 212, 32, 0.9);
    /* 黄色，透明度 0.5 */
}

.progress-high {
    background-color: rgba(255, 165, 0, 0.5);
    /* 橙色，透明度 0.5 */
}

.progress-complete {
    background-color: rgba(0, 128, 0, 0.5);
    /* 绿色，透明度 0.5 */
}

.hide {
    background-color: transparent;
    color: #333 !important;
}
</style>