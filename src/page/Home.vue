<template>
    <div class="container">
      <h1>Todo List</h1>
      <div class="input-container">
        <input v-model="newTodo" placeholder="Add a new todo" />
        <button @click="addTodo">Add</button>
      </div>
      <ul>
        <li v-for="(todo, index) in todos" :key="index" class="todo-item">
          {{ todo }}
          <button @click="removeTodo(index)" class="remove-button">Remove</button>
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
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
  </script>
  
  <style scoped>
  .container {
    max-width: 600px;
    margin: 50px auto;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    background-color: #f9f9f9;
  }
  
  h1 {
    text-align: center;
    color: #333;
  }
  
  .input-container {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  
  input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-right: 10px;
  }
  
  button {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    background-color: #42b983;
    color: white;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #369f6e;
  }
  
  ul {
    list-style-type: none;
    padding: 0;
  }
  
  .todo-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #eee;
  }
  
  .remove-button {
    background-color: #ff4d4d;
  }
  
  .remove-button:hover {
    background-color: #e60000;
  }
  </style>