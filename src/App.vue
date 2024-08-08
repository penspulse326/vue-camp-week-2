<script setup lang="ts">
import axios from 'axios';
import { onMounted, ref } from 'vue';

const formType = ref('login');
const isFetching = ref(false);
const isLogin = ref(false);
const nickname = ref('');

const loginFormData = ref({
  email: 'ss@11.com',
  password: 'sss111'
});

const signupFormData = ref({
  email: '',
  password: '',
  nickname: ''
});

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

async function handleLogin() {
  if (isFetching.value) return;
  isFetching.value = true;

  try {
    const res = await axios.post('/users/sign_in', loginFormData.value);
    const token = res.data.token;
    axios.defaults.headers.common['Authorization'] = token;
    isLogin.value = true;
  } catch (error) {
    alert('登入失敗，請檢查輸入資訊是否有誤 QAQ');
  }

  isFetching.value = false;
}

async function handleLogout() {
  if (isFetching.value) return;
  isFetching.value = true;

  try {
    await axios.get('/users/sign_out');
  } catch (error) {
    alert('登出失敗，可能是登入狀態已過期，請重新整理 QAQ');
  }

  isFetching.value = false;
  isLogin.value = false;
}

async function handleCheckout() {
  try {
    const res = await axios.get('/users/checkout');
    alert(`驗證${res.data.status ? '成功' : '失敗'}`);
  } catch (error: any) {
    alert(`驗證失敗，可能是登入狀態已過期，請重新整理 QAQ`);
  }
}

async function handleSignup() {
  if (isFetching.value) return;
  isFetching.value = true;

  try {
    const res = await axios.post('/users/sign_up', signupFormData.value);
    alert(`註冊${res.data.status ? '成功' : '失敗'}`);
  } catch (error: any) {
    alert(`註冊失敗，${error.response.data.message} QAQ`);
  }

  isFetching.value = false;
}

onMounted(() => {
  axios.defaults.baseURL = 'https://todolist-api.hexschool.io';
});
</script>

<template>
  <main class="container mt-2 px-4">
    <div class="row justify-content-center">
      <h1 class="col-md-6 col-xl-4 py-2 bg-primary rounded-3 text-center">熟悉的 TODO API</h1>
    </div>
    <div class="row flex-column align-items-center">
      <!-- login -->
      <form
        v-if="formType === 'login'"
        @submit.prevent="handleLogin"
        class="col-md-6 col-xl-4 p-4 border border-primary rounded-3"
      >
        <h2 class="text-center">{{ isLogin ? '你已經登入' : '登入' }}</h2>
        <div v-if="!isLogin">
          <div class="mb-3">
            <label for="input-login-email" class="form-label">電子信箱</label>
            <input
              type="text"
              v-model="loginFormData.email"
              class="form-control"
              id="input-login-email"
              placeholder="請輸入電子信箱"
            />
          </div>
          <div class="mb-3">
            <label for="input-password" class="form-label">密碼</label>
            <input
              type="password"
              v-model="loginFormData.password"
              class="form-control"
              id="input-password"
              placeholder="請輸入 6 位以上密碼"
            />
          </div>
        </div>
        <button
          v-if="!isLogin"
          type="submit"
          :disabled="isFetching"
          class="btn btn-primary d-flex justify-content-center align-items-center gap-2 w-100"
        >
          <div v-if="isFetching" class="spinner-border spinner-border-sm" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <span>登入</span>
        </button>
        <button
          v-else
          type="button"
          @click="handleLogout"
          :disabled="isFetching"
          class="btn btn-primary d-flex justify-content-center align-items-center gap-2 w-100"
        >
          <div v-if="isFetching" class="spinner-border spinner-border-sm" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <span>登出</span>
        </button>
        <button
          v-if="isLogin"
          type="button"
          @click="handleCheckout"
          class="btn btn-warning col-md-6 col-xl-4 mt-2 w-100"
        >
          驗證偷肯
        </button>
        <button
          v-if="!isLogin"
          @click="formType = 'signup'"
          type="button"
          class="btn btn-link w-100 text-black text-end"
        >
          我要註冊
        </button>
      </form>

      <!-- signup -->
      <form
        v-if="formType === 'signup'"
        @submit.prevent="handleSignup"
        class="col-md-6 col-xl-4 p-4 border border-primary rounded-3"
      >
        <h2 class="text-center">註冊</h2>
        <div>
          <div class="mb-3">
            <label for="input-signup-email" class="form-label">電子信箱</label>
            <input
              type="text"
              v-model="signupFormData.email"
              class="form-control"
              id="input-signup-email"
              placeholder="請輸入電子信箱"
            />
          </div>
          <div class="mb-3">
            <label for="input-signup-password" class="form-label">密碼</label>
            <input
              type="password"
              v-model="signupFormData.password"
              class="form-control"
              id="input-signup-password"
              placeholder="請輸入 6 位以上密碼"
            />
          </div>
          <div class="mb-3">
            <label for="input-signup-nickname" class="form-label">暱稱</label>
            <input
              type="text"
              v-model="signupFormData.nickname"
              class="form-control"
              id="input-signup-nickname"
              placeholder="請輸入暱稱"
            />
          </div>
        </div>
        <button
          v-if="!isLogin"
          type="submit"
          :disabled="isFetching"
          class="btn btn-primary d-flex justify-content-center align-items-center gap-2 w-100"
        >
          <div v-if="isFetching" class="spinner-border spinner-border-sm" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <span>註冊</span>
        </button>
        <button
          type="button"
          @click="formType = 'login'"
          class="btn btn-link w-100 text-black text-end"
        >
          我要登入
        </button>
      </form>
    </div>
    <hr />
  </main>
  <section class="container">
    <div class="row flex-column align-items-center">
      <h2 class="col-md-6 col-xl-4 py-2 bg-primary rounded-3 text-center">
        {{ nickname }} 的代辦列表
      </h2>
      <ul class="list-group col-md-6 col-xl-4 mx-auto p-0 rounded-3">
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
