<template>
  <main>
    <nav>
      <RouterLink to="/form" class="form-link">Перейти к форме</RouterLink>
    </nav>
  </main>
</template>

<style scoped>
main {
  padding: 20px;
  text-align: center;
}

.form-link {
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  text-decoration: none;
  border-radius: 4px;
}

.form-link:hover {
  background-color: #45a049;
}
</style>
