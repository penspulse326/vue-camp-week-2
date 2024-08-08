<script setup lang="ts">
import { ref } from 'vue';

const todos = ref([
  {
    content: '買晚餐',
    createTime: 1723092537,
    id: '-O3kJNteBft9itsiVZ0U',
    status: false
  },
  {
    content: '買晚餐',
    createTime: 1723092537,
    id: '-O3kJNteBft9itsiVZ0U',
    status: false
  },
  {
    content: '買晚餐',
    createTime: 1723092537,
    id: '-O3kJNteBft9itsiVZ0U',
    status: false
  }
]);
</script>

<template>
  <main class="container mt-2 px-4">
    <div class="row flex-column align-items-center">
      <h1 class="col-md-6 col-lg-4 py-2 bg-primary rounded-3 text-center">熟悉的 TODO API</h1>
      <form @submit.prevent class="col-md-6 col-lg-4 mx-auto p-4 border border-primary rounded-3">
        <h2 class="text-center">登入</h2>
        <div class="mb-3">
          <label for="input-email" class="form-label">電子信箱</label>
          <input type="text" class="form-control" id="input-email" placeholder="請輸入電子信箱" />
        </div>
        <div class="mb-3">
          <label for="input-password" class="form-label">密碼</label>
          <input
            type="password"
            class="form-control"
            id="input-password"
            placeholder="請輸入 6 位以上密碼"
          />
        </div>
        <button type="submit" class="btn btn-primary w-100">登入</button>
        <a href="#" @click.prevent class="mt-3 d-block text-black text-end">還沒有帳號？註冊一下</a>
      </form>
    </div>
    <hr />
  </main>
  <section class="container">
    <div class="row flex-column align-items-center">
      <h2 class="col-md-6 col-lg-4 py-2 bg-primary rounded-3 text-center">代辦列表</h2>
      <ul class="list-group col-md-6 col-lg-4 mx-auto p-0 rounded-3">
        <li
          v-for="todo in todos"
          :key="todo.id"
          class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
        >
          <div class="form-check">
            <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
            <label class="form-check-label" for="flexCheckDefault"> {{ todo.content }} </label>
          </div>
          <button type="button" class="btn btn-outline-danger btn-sm">刪除</button>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped></style>
