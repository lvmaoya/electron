<template>
    <div class="google-loader">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
    </div>
</template>

<script>

</script>

<style scoped>
.google-loader {
    display: block;
}

.google-loader span {
    display: inline-block;
    margin-top: 10px;
    height: 12px;
    width: 12px;
    border-radius: 50%;
}

@keyframes move {
    from {
        transform: translateY(-10px);
    }

    to {
        transform: translateY(5px);
    }
}

.google-loader span:not(:first-child) {
    margin-left: 12px;
}

.google-loader span:nth-child(1) {
    background: #4285F4;
    animation: move 1s ease-in-out -0.25s infinite alternate;
}

.google-loader span:nth-child(2) {
    background: #DB4437;
    animation: move 1s ease-in-out -0.5s infinite alternate;
}

.google-loader span:nth-child(3) {
    background: #F4B400;
    animation: move 1s ease-in-out -0.75s infinite alternate;
}

.google-loader span:nth-child(4) {
    background: #0F9D58;
    animation: move 1s ease-in-out -1s infinite alternate;
}



h1 {
    font-family: 'Montserrat', sans-serif;
    font-size: 4em;
    text-align: center;
    letter-spacing: -8px;
    margin-top: 0;
}

h1 span:first-child {
    color: #4285F4;
}

h1 span:nth-child(2) {
    color: #DB4437;
}

h1 span:nth-child(3) {
    color: #F4B400;
}

h1 span:nth-child(4) {
    color: #4285F4;
}

h1 span:nth-child(5) {
    color: #0F9D58;
}

h1 span:last-child {
    color: #DB4437;
    transform: rotate(-20deg);
    display: inline-block;
}
</style>