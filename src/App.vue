<template>
  <div class="app">
    <nav>
      <router-link to="/">Главная</router-link> | <router-link to="/form">Форма</router-link> |
      <router-link to="/posts">Посты</router-link>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts"></script>

<style>
.app {
  padding: 20px;
}

nav {
  padding-bottom: 20px;
}

nav a {
  margin: 0 10px;
  color: #ffffff;
  text-decoration: none;
}

nav a.router-link-active {
  color: #42b983;
}
</style>
