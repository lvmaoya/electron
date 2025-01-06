<template>
  <div class="container">
    <div class="input-container">
      <input v-model="newTodo" placeholder="Add a new todo" @keyup.enter="addTodo" />
    </div>
    <ul v-if="todos.length > 0">
      <li v-for="(todo, index) in todos" :key="index" :class="todo.completed ? 'completed todo-item' : 'todo-item'">
        {{ todo.taskName }}
      </li>
    </ul>
    <div v-else class="empty">
      暂无待办事项
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getTodos, } from '@/api/api';

const newTodo = ref('');
const todos = ref([]);

const addTodo = () => {
  if (newTodo.value.trim() !== '') {
    todos.value.push(newTodo.value);
    newTodo.value = '';
  }
};

const removeTodo = (index) => {
  todos.value.splice(index, 1);
};
const fetchTodos = async () => {
  try {
    const response = await getTodos({sortBy: "completed"});
    todos.value = response;
  } catch (error) {
    console.error('Failed to fetch todos:', error);
  }
};
onMounted(() => {
  fetchTodos();
});
</script>

<style scoped>
.container {
  margin: 0 auto;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
  font-size: 14px;
}

.input-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: none;
}

input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
  height: 100%;
  overflow-y: auto;
}

ul::-webkit-scrollbar {
  width: 0px;
}

ul::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 10px;
}

ul::-webkit-scrollbar-thumb:hover {
  background-color: #555;
}

.todo-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  user-select: none;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f1f1f1;
  }
}
.empty{
  text-align: center;
  color: #ccc;
  padding: 30px;
  font-size: 14px;
}
.completed {
  text-decoration: line-through;
  color: #ccc;
}
</style>