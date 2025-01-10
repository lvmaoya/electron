<template>
  <RouterView />
</template>

<script setup>
import { RouterView } from 'vue-router'
</script>

<style>
/* 你可以在这里添加全局样式 */
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;
}

#app {
  height: 100%;
  width: 100%;
}
</style>