<template>
    <div class="container">
        <div class="overlay" @click="handOverLayClick"></div>
        <div class="more-menu">
            <ul>
                <li v-for="(item,index) in menuList" @click="handMenuItemClick(item,index)" :class="{active: item.active}">{{ item.label }}</li>
            </ul>
        </div>
    </div>
</template>
<script setup>
import { defineEmits, ref } from 'vue'
const handOverLayClick = () => {
    emit('closeMenu')
}
const emit = defineEmits(["closeMenu","menuItemClick"])
const menuList = ref([
    {label: "刷新  [F]", key: "refresh"},
    {label: "今日全部", key: "today", active: false},
    {label: "前一天", key: "prev", active: false},
    {label: "后一天", key: "next", active: false},
    {label: "Dashboard", key: "dashboard"},
])
const handMenuItemClick = (item, index) => {
    // if (item.active != undefined) {
    //     menuList.value.forEach(item => item.active = false)
    //     menuList.value[index].active = true
    // }
    emit('menuItemClick', item.key)
}
</script>
<style scoped>
.container {
    .more-menu {
        position: absolute;
        width: max-content;
        top: 45px;
        right: 10px;
        background-color: rgba(255, 255, 255, 0.65);
        border: 1px solid #e6e6e6;
        border-radius: 8px;
        user-select: none;

        ul {
            display: flex;
            width: fit-content;
            flex-direction: column;
            padding: 4px;
            gap: 4px;
            li {
                height: 22.5px;
                line-height: 22.5px;
                padding: 0 12px;
                text-align: start;
                border-radius: 4px;
                &::before {
                    /* content: "✓"; */
                    opacity: 0;
                    margin-right: 4px;
                }
                &:hover {
                    background-color: #3b9afe;
                    color: white;
                }
                &.active::before {
                    opacity: 1;
                }
            }
        }
    }

    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }
}
</style>