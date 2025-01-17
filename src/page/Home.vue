<template>
  <div class="container">
    <div class="header">
      <div :class="isTodoLoading ? 'todo-loading is-loading' : 'todo-loading'">
        <svg t="1736932401807" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
          p-id="11683" width="20" height="20">
          <path
            d="M512 64a32 32 0 0 1 32 32v192a32 32 0 0 1-64 0V96a32 32 0 0 1 32-32m0 640a32 32 0 0 1 32 32v192a32 32 0 1 1-64 0V736a32 32 0 0 1 32-32m448-192a32 32 0 0 1-32 32H736a32 32 0 1 1 0-64h192a32 32 0 0 1 32 32m-640 0a32 32 0 0 1-32 32H96a32 32 0 0 1 0-64h192a32 32 0 0 1 32 32M195.2 195.2a32 32 0 0 1 45.248 0L376.32 331.008a32 32 0 0 1-45.248 45.248L195.2 240.448a32 32 0 0 1 0-45.248m452.544 452.544a32 32 0 0 1 45.248 0L828.8 783.552a32 32 0 0 1-45.248 45.248L647.744 692.992a32 32 0 0 1 0-45.248M828.8 195.264a32 32 0 0 1 0 45.184L692.992 376.32a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0m-452.544 452.48a32 32 0 0 1 0 45.248L240.448 828.8a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0"
            p-id="11684" fill="#5e5e5e"></path>
        </svg>
      </div>
      <div class="title">{{ currentDate }}</div>
      <div class="button-group">
        <button @click="handleAddTodoClick" title="添加待办">
          <svg t="1736905509671" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
            p-id="5351" width="20" height="20">
            <path
              d="M640 469.333333h170.666667a42.666667 42.666667 0 0 1 0 85.333334h-170.666667a42.666667 42.666667 0 0 1 0-85.333334z m-85.333333 341.333334a42.666667 42.666667 0 0 1-85.333334 0v-256H213.333333a42.666667 42.666667 0 0 1 0-85.333334h256V213.333333a42.666667 42.666667 0 0 1 85.333334 0v597.333334z"
              fill="#5e5e5e" p-id="5352"></path>
          </svg> </button>
        <button @click="showMoreMenu = true" title="更多操作...">
          <svg t="1736748055817" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
            p-id="4242" width="16" height="16">
            <path
              d="M426.666667 810.666667a85.333333 85.333333 0 1 1 170.666666 0 85.333333 85.333333 0 0 1-170.666666 0z m0-298.666667a85.333333 85.333333 0 1 1 170.666666 0 85.333333 85.333333 0 0 1-170.666666 0z m0-298.666667a85.333333 85.333333 0 1 1 170.666666 0 85.333333 85.333333 0 0 1-170.666666 0z"
              fill="#5e5e5e" p-id="4243"></path>
          </svg>
        </button>
      </div>
    </div>
    <div class="ul" v-if="todos.length > 0 || isAddingTodo">
      <div class="todo-item add-todo" v-if="isAddingTodo">
        <span @click="handleAddTodo">
          <svg t="1736911421239" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
            p-id="5915" width="20" height="20">
            <path
              d="M512 1024A512 512 0 1 1 512 0a512 512 0 0 1 0 1024z m0-73.142857A438.857143 438.857143 0 1 0 512 73.142857a438.857143 438.857143 0 0 0 0 877.714286z m218.112-403.236572H547.547429v182.564572a36.571429 36.571429 0 0 1-72.996572 0V547.620571H291.986286a36.571429 36.571429 0 0 1 0-72.996571h182.564571V291.986286a36.571429 36.571429 0 0 1 72.996572 0V474.697143h182.564571a36.571429 36.571429 0 0 1 0 72.996571z"
              p-id="5916" fill="#999999"></path>
          </svg>
        </span>
        <input ref="addTodoInputRef" type="text" class="add-input" placeholder="请输入待办事项" @keyup.enter="handleAddTodo"
          @blur="handleAddInputBlur" v-model="newTodo">
      </div>
      <draggable v-model="todos" :disabled="!state.enabled" item-key="id" ghost-class="ghost" chosen-class="chosen"
        @start="state.dragging = true" @end="onEnd" animation="300">
        <template #item="{ element }">
          <div :class="element.progress ? 'progress todo-item' : 'todo-item'" @dblclick="editTodo(element)">
            <span :class="element.progress == 100 ? 'checkbox checked' : 'checkbox'" @click="handleDonePress(element)">

            </span>
            {{ element.taskName }}
          </div>
        </template>
      </draggable>
    </div>
    <div v-else class="empty">
      {{ isTodoLoading ? 'Loading...' : errorMessage ? errorMessage : '暂无待办事项' }}
    </div>
  </div>
  <!-- 编辑弹窗 -->
  <div v-if="isEditing" class="modal" @click="closeModal">
    <div class="modal-content" @click.stop>
      <!-- <h2>编辑 Todo</h2> -->
      <div class="form-group">
        <label for="taskName">Task name</label>
        <input id="taskName" v-model="currentEditTodo.taskName" placeholder="Edit task name" />
      </div>
      <div class="form-group">
        <label for="progress">Progress</label>
        <select id="progress" v-model="currentEditTodo.progress">
          <option value="0">0%</option>
          <option value="20">20%</option>
          <option value="40">40%</option>
          <option value="60">60%</option>
          <option value="80">80%</option>
          <option value="100">100%</option>
        </select>
      </div>

      <div class="form-group">
        <label for="dueDate">Due date</label>
        <input id="dueDate" type="datetime-local" v-model="currentEditTodo.dueDate" />
      </div>
      <div class="form-group">
        <label for="reminderDate">Reminder date</label>
        <input id="reminderDate" type="datetime-local" v-model="currentEditTodo.reminderDate" />
      </div>
      <div class="form-group">
        <label for="priority">Priority</label>
        <select id="priority" v-model="currentEditTodo.priority">
          <option value="1">一级</option>
          <option value="2">二级</option>
          <option value="3">三级</option>
          <option value="4">四级</option>
          <option value="5">五级</option>
        </select>
      </div>
      <div class="form-group">
        <label for="category">Category</label>
        <select id="category" v-model="currentEditTodo.category">
          <option value="1">个人</option>
          <option value="2">工作</option>
          <option value="3">学习</option>
        </select>
      </div>
      <div class="form-group desc">
        <label for="description">Description</label>
        <textarea id="description" rows="4" v-model="currentEditTodo.description"
          placeholder="some description..."></textarea>
      </div>
      <button @click="saveTodo">
        保存
      </button>
    </div>
  </div>
  <MoreMenu v-show="showMoreMenu" @close-menu="handCloseMenu" @menu-item-click="handMenuItemClick"></MoreMenu>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import { getTodos, getTodayTodos, orderTodo, updateTodo, addTodo } from '@/api/api';
import draggable from 'vuedraggable';
import dayjs from 'dayjs';
import MoreMenu from './MoreMenu.vue';
import Mousetrap from 'mousetrap';
const router = useRouter();
const route = useRoute();

const state = reactive({
  enabled: true,
  dragging: false,
});

const currentDate = ref(route.query.date ?? dayjs().format('YYYY-MM-DD'))
const newTodo = ref('');
const todos = ref([]);
const isEditing = ref(false);
const currentEditTodo = ref({});
const saveLoading = ref(false);
const isAddingTodo = ref(false);
const addTodoInputRef = ref();
const showMoreMenu = ref(false);
const isTodoLoading = ref(false);
const errorMessage = ref("");
const handleAddTodo = () => {
  if (newTodo.value.trim() !== '') {
    let todo = generateDefaultTodo(newTodo.value);
    todos.value.unshift(todo);
    newTodo.value = '';
    addTodo(todo);
  }
};
const handleAddTodoClick = () => {
  isAddingTodo.value = true;
  nextTick(() => {
    addTodoInputRef.value.focus()
  })
};
const generateDefaultTodo = (title) => {
  return {
    taskName: title,
    progress: 0,
    dueDate: currentDate.value + " 00:00:00",
    reminderDate: '',
    priority: 1,
    category: 1,
    description: ''
  }
}
const editTodo = (todo) => {
  currentEditTodo.value = { ...todo };
  isEditing.value = true;
};

const saveTodo = async () => {
  if (saveLoading.value) return;
  try {
    saveLoading.value = true;
    delete currentEditTodo.value.updatedTime
    if (currentEditTodo.value.dueDate) {
      currentEditTodo.value.dueDate = dayjs(currentEditTodo.value.dueDate).format('YYYY-MM-DD HH:mm:ss')
    }
    if (currentEditTodo.value.reminderDate) {
      currentEditTodo.value.reminderDate = dayjs(currentEditTodo.value.reminderDate).format('YYYY-MM-DD HH:mm:ss')
    }

    await updateTodo(currentEditTodo.value);
    const index = todos.value.findIndex(todo => todo.id === currentEditTodo.value.id);
    if (index !== -1) {
      todos.value[index] = { ...currentEditTodo.value };
    }
    closeModal();
  } catch (error) {
    console.error('Failed to save todo:', error);
  } finally {
    saveLoading.value = false;
  }
};
const handleDonePress = (element) => {
  let index = todos.value.findIndex(todo => todo.id === element.id);
  if (index !== -1) {
    todos.value[index].progress = todos.value[index].progress === 100 ? 0 : 100;
    currentEditTodo.value = todos.value[index]
    saveTodo()
  }
}
const removeTodo = (index) => {
  todos.value.splice(index, 1);
};

const getTodaytTodos = async () => {
  isTodoLoading.value = true;
  try {
    const response = await getTodayTodos();
    todos.value = response;
  } catch (error) {
    errorMessage.value = error.message
    console.error('Failed to fetch todos:', error);
  } finally {
    isTodoLoading.value = false;
  }
};
const getTodolist = async () => {
  isTodoLoading.value = true;
  try {
    let data = {
      dueDateStart: currentDate.value + " 00:00:00",
      dueDateEnd: currentDate.value + " 23:59:59",
    }
    const response = await getTodos(data);
    todos.value = response?.records;
  } catch (error) {
    errorMessage.value = error.message
    console.error('Failed to fetch todos:', error);
  } finally {
    isTodoLoading.value = false;
  }
}
const handleAddInputBlur = () => {
  isAddingTodo.value = false;
}
onMounted(() => {
  refreshTodo();
});
const onEnd = (event) => {
  if (currentDate.value != dayjs().format('YYYY-MM-DD')) {
    return;
  }
  state.dragging = false
  let newIndex = event.newIndex;

  let id = event.item._underlying_vm_.id;
  let prevTodoId = todos.value[newIndex - 1]?.id ?? -1;
  let siblingTodoId = todos.value[newIndex + 1]?.id ?? -1;
  orderTodo({ id, prevTodoId, siblingTodoId });
};
const closeModal = () => {
  isEditing.value = false;
  currentEditTodo.value = {};
};
const handCloseMenu = () => {
  showMoreMenu.value = false;
}

Mousetrap.bind('f', function () {
  getTodaytTodos();
});
Mousetrap.bind('command+n', function () {
  handleAddTodoClick();
});
const handMenuItemClick = (key) => {
  showMoreMenu.value = false;
  switch (key) {
    case 'refresh':
      refreshTodo()
      break;
    case 'today':
      currentDate.value = dayjs().format('YYYY-MM-DD')
      break;
    case 'prev':
      currentDate.value = dayjs(currentDate.value).subtract(1, 'day').format('YYYY-MM-DD')
      break;
    case 'next':
      currentDate.value = dayjs(currentDate.value).add(1, 'day').format('YYYY-MM-DD')
      break;
    case 'dashboard':
      router.push('/calendar');
      break;
    default:
      console.log('unknown');
  }
}
watch(() => currentDate.value, (n, o) => {
  refreshTodo()
})
const refreshTodo = () => {
  if (currentDate.value != dayjs().format('YYYY-MM-DD')) {
    getTodolist()
  } else {
    getTodaytTodos()
  }
}
</script>

<style scoped>
@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.container {
  margin: 0 auto;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
  padding: 0px 10px;

  .header {
    display: flex;
    height: 60px;
    justify-content: center;
    align-items: center;
    user-select: none;
    text-align: center;
    position: relative;
    user-select: none;
    -webkit-user-select: none;
    -webkit-app-region: drag;

    .title {
      font-size: 18px;
      font-weight: bold;
      color: #007aff;
    }

    .todo-loading {
      position: absolute;
      left: 0;
      display: flex;
      align-items: center;
      opacity: 0;
      transition: opacity 0.3s linear;

      svg {
        width: 18px;
        height: 18px;
      }

      &.is-loading {
        opacity: 1;

        svg {
          animation: spin 5s linear infinite;
        }
      }
    }

    .button-group {
      position: absolute;
      right: 0;
      display: flex;
      align-items: center;
      gap: 2px;
      -webkit-app-region: no-drag;

      button {
        width: 25px;
        height: 25px;
        border-radius: 4px;
        margin: 0;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: transparent;
        padding: 4px;

        &:last-child {
          padding: 4.8px;
        }

        svg {
          width: 100%;
          height: 100%;
        }

        &:hover {
          background-color: #e1e1e1;
        }

        &:focus {
          background-color: #e1e1e1;
        }
      }
    }

    .item {
      width: 33.33%;
      text-align: center;

      &:last-child {
        text-align: right;
      }
    }
  }
}

.ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
  height: 100%;
  overflow-y: auto;

  .todo-item {
    display: flex;
    justify-content: start;
    gap: 8px;
    align-items: center;
    padding: 6px 8px;
    /* border-bottom: 1px solid #eee; */
    cursor: pointer;
    user-select: none;
    border-radius: 10px;
    margin-bottom: 4px;

    .checkbox {
      height: 14px;
      width: 14px;
      margin: 0 1px;
      border: 1px solid #999;
      border-radius: 50%;
      position: relative;

      &::after {
        content: '';
        display: block;
        height: 12px;
        width: 12px;
        border-radius: 50%;
        background-color: #999;
        position: absolute;
        left: 1px;
        top: 1px;
        display: none;
      }

      &:active&::after {
        display: block;
      }

      &.checked {
        border-color: #439fff;
      }

      &.checked::after {
        background-color: #439fff;
        display: block;
      }
    }

    &:last-child {
      border-bottom: none;
      margin-bottom: 0px;
    }

    &:hover {
      background-color: rgba(255, 255, 255, 0.75);
    }
  }

  .add-todo {
    span {
      display: flex;
      height: 100%;
      align-items: center;
      box-sizing: border-box;
      margin: 0 1px;

      svg {
        height: 16px;
        width: 16px;
        padding-bottom: 1px;
      }
    }

    .add-input {
      border: none;
      fill: none;
      flex: 1;
      background-color: transparent;
      vertical-align: middle;

      &:focus {
        outline: none;
      }
    }

    &:hover {
      background-color: rgba(0, 0, 0, 0.0) !important;
    }
  }

  .progress {
    text-decoration: line-through;
    color: rgba(0, 0, 0, 0.5);
  }

  .ghost {
    opacity: 0.5;
    border-radius: 10px;
  }
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


.empty {
  text-align: center;
  margin-top: 250px;
  color: #999;
}

.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.05);

  .modal-content {
    background-color: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    padding: 20px;
    border-radius: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: 400px;
    text-align: center;
    display: flex;
    flex-wrap: wrap;
    column-gap: 20px;
    row-gap: 16px;
    box-sizing: content-box;
    overflow: hidden;

    .form-group {
      width: calc(50% - 10px);
      display: flex;
      flex-direction: column;
      align-items: flex-start;

      label {
        display: block;
        font-size: 12px;
        color: #333;
        margin-bottom: 4px;
        font-weight: 500;
      }

      input,
      select {
        width: 100%;
        box-sizing: border-box;
        border: 1px solid #ccc;
        border-radius: 6px;
        padding: 0 8px;
        height: 30px;
        flex: none;
      }

      select {
        padding-right: 20px;
        appearance: none;
        -moz-appearance: none;
        -webkit-appearance: none;
      }

      input[type="date"] {
        user-select: none !important;
      }

      &.desc {
        width: 100%;

        textarea {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid #ccc;
          border-radius: 6px;
          padding: 8px;
          flex: none;
          resize: none
        }
      }
    }

    button {
      width: 100%;
      height: 36px;
      border-radius: 6px;
      border: none;
      background-color: #439fff;
      color: white;
    }
  }
}
</style>
