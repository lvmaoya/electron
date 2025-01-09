<template>
  <div class="container">
    <div class="input-container">
      <input v-model="newTodo" placeholder="Add a new todo" @keyup.enter="addTodo" />
    </div>
    <div class="ul" v-if="todos.length > 0">
      <draggable v-model="todos" :disabled="!state.enabled" item-key="id" ghost-class="ghost" chosen-class="chosen"
        @start="state.dragging = true" @end="onEnd" animation="300">
        <template #item="{ element }">
          <div :class="element.completed ? 'completed todo-item' : 'todo-item'">
            {{ element.id }}{{ element.taskName }}
          </div>
        </template>
      </draggable>
    </div>
    <div v-else class="empty">
      暂无待办事项
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { getTodos, getTodayTodos, orderTodo } from '@/api/api';
import draggable from 'vuedraggable';
const state = reactive({
  enabled: true,
  dragging: false,
});
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
    const response = await getTodayTodos();
    todos.value = response;
  } catch (error) {
    console.error('Failed to fetch todos:', error);
  }
};
const reOrderTodo = async () => {
  try {
    await orderTodo();
  } catch (error) {
    console.error('Failed to order todos:', error);
  }
}
onMounted(() => {
  fetchTodos();
});
const onEnd = (event) => {
  state.dragging = false
  let newIndex = event.newIndex;

  let id = event.item._underlying_vm_.id;
  let prevTodoId = todos.value[newIndex - 1]?.id ?? -1;
  let siblingTodoId = todos.value[newIndex + 1]?.id ?? -1;
  orderTodo({ id, prevTodoId, siblingTodoId });
};

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

.ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
  height: 100%;
  overflow-y: auto;
}

.ul::-webkit-scrollbar {
  width: 0px;
}

.ul::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 10px;
}

.ul::-webkit-scrollbar-thumb:hover {
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

.empty {
  text-align: center;
  color: #ccc;
  padding: 30px;
  font-size: 14px;
}

.completed {
  text-decoration: line-through;
  color: #ccc;
}

.ghost {
  opacity: 0.5;
  border-radius: 10px;
}


.item {
  width: 100%;

  &:hover {
    background-color: #f0f0f0;
  }
}

.not-draggable {
  cursor: no-drop;
}
</style>
