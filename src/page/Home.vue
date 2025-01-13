<template>
  <div class="container">
    <div class="header">
      <div class="title">我的待办</div>
      <div class="button-group">
        <button @click="toggleState">+</button>
        <button @click="toggleState" aria-label="more">
          <svg t="1736748055817" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
            p-id="4242" width="16" height="16">
            <path
              d="M426.666667 810.666667a85.333333 85.333333 0 1 1 170.666666 0 85.333333 85.333333 0 0 1-170.666666 0z m0-298.666667a85.333333 85.333333 0 1 1 170.666666 0 85.333333 85.333333 0 0 1-170.666666 0z m0-298.666667a85.333333 85.333333 0 1 1 170.666666 0 85.333333 85.333333 0 0 1-170.666666 0z"
              fill="#25583a" p-id="4243"></path>
          </svg> </button>
      </div>
    </div>
    <div class="ul" v-if="todos.length > 0">
      <div class="todo-item add-todo">
        <span>
          添加
        </span>
        <input type="text" class="add-input" placeholder="请输入待办事项" @keyup.enter="addTodo" v-model="newTodo">
      </div>
      <draggable v-model="todos" :disabled="!state.enabled" item-key="id" ghost-class="ghost" chosen-class="chosen"
        @start="state.dragging = true" @end="onEnd" animation="300">
        <template #item="{ element }">
          <div :class="element.progress ? 'progress todo-item' : 'todo-item'" @dblclick="editTodo(element)"
            @longPress="handleLongPress(element)">
            <input type="checkbox" :checked="element.progress == 100">
            {{ element.taskName }}
          </div>
        </template>
      </draggable>
    </div>
    <div v-else class="empty">
      暂无待办事项
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
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { getTodos, getTodayTodos, orderTodo, updateTodo } from '@/api/api';
import draggable from 'vuedraggable';
import dayjs from 'dayjs';

const state = reactive({
  enabled: true,
  dragging: false,
});
const newTodo = ref('');
const todos = ref([]);
const isEditing = ref(false);
const currentEditTodo = ref({});
const saveLoading = ref(false);

const addTodo = () => {
  console.log(newTodo.value);

  if (newTodo.value.trim() !== '') {
    let todo = generateDefaultTodo(newTodo.value);
    todos.value.append(todo);
    newTodo.value = '';
  }
};
const generateDefaultTodo = (title) => {
  return {
    taskName: title,
    progress: 0,
    dueDate: '',
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
    currentEditTodo.value.dueDate = dayjs(currentEditTodo.value.dueDate).format('YYYY-MM-DD HH:mm:ss');
    currentEditTodo.value.reminderDate = dayjs(currentEditTodo.value.reminderDate).format('YYYY-MM-DD HH:mm:ss');

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
const handleLongPress = () => {
  console.log("calculating");

}
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
const closeModal = () => {
  isEditing.value = false;
  currentEditTodo.value = {};
};

</script>

<style scoped>
.container {
  margin: 0 auto;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
  font-size: 16px;
  padding: 0px 10px;

  .header {
    display: flex;
    height: 40px;
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

    .button-group {
      position: absolute;
      right: 0;
      display: flex;
      align-items: center;

      button {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        margin: 0;
        border: none;
        font-size: 20px;
        font-weight: 300;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: transparent;
        color: #25583a;
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
    gap: 4px;
    align-items: center;
    padding: 8px;
    /* border-bottom: 1px solid #eee; */
    cursor: pointer;
    user-select: none;
    border-radius: 10px;

    input {
      vertical-align: middle;
      height: 100%;
      margin: 0px;
    }

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background-color: rgba(255, 255, 255, 0.75);
    }
  }

  .add-todo {
    span {
      color: #007aff;
      font-size: 14px;
      font-weight: 500;
      display: block;
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
    color: rgba(0, 0, 0, 0.75);
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
  color: #ccc;
  padding: 30px;
  font-size: 14px;
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
