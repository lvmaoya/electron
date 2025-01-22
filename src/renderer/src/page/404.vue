<template>
    <div class="container">
        <h1>404</h1>
        <p>Oops! The page you are looking for does not exist.</p>
        <router-link to="/" class="home-link">Go back to Home</router-link>
    </div>
</template>

<script setup>
</script>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    text-align: center;
    background-color: #f9f9f9;
}

h1 {
    font-size: 6rem;
    margin: 0;
    color: #ff4d4d;
}

p {
    font-size: 1.5rem;
    color: #333;
}

.home-link {
    margin-top: 20px;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    background-color: #42b983;
    color: white;
    text-decoration: none;
    cursor: pointer;
}

.home-link:hover {
    background-color: #369f6e;
}
</style>