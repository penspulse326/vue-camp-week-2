<script setup lang="ts">
import axios from 'axios';
import { onMounted, ref, watch } from 'vue';
import { API_AUTH, API_TODO } from './services/todo_endpoints';
import type { FormType, TodoItem } from './types';

const formType = ref<FormType>('login');
const isLoading = ref(false);
const isLogin = ref(false);
const username = ref('');
const inputTodo = ref('');
const editingTodo = ref<TodoItem | null>(null);

const loginFormData = ref({
  email: 'ss@11.com',
  password: 'sss111'
});

const signupFormData = ref({
  email: '',
  password: '',
  nickname: ''
});

const todos = ref<TodoItem[]>([]);

/**
 * @description useFetch 將 loading 的狀態控制在一起，先粗暴地阻止重複請求^^
 */
const useFetch = async (cb: Function, effect?: Function) => {
  if (isLoading.value) return;

  isLoading.value = true;
  await cb();
  isLoading.value = false;
  effect && effect();
};

const handleLogin = () => {
  useFetch(async () => {
    const { response, error } = await API_AUTH._LOGIN(loginFormData.value);

    if (error) {
      alert('登入失敗，請檢查輸入資訊是否正確 QAQ');
      return;
    }

    const { nickname, token } = response;
    axios.defaults.headers.common['Authorization'] = token;

    isLogin.value = true;
    username.value = nickname;
  }, getTodos);
};

const handleLogout = () => {
  useFetch(async () => {
    const { error } = await API_AUTH._LOGOUT();

    if (error) {
      alert('登出失敗，請重新整理或稍後再試 QAQ');
      return;
    }

    isLogin.value = false;
    username.value = '';
  });
};

const handleCheckout = () => {
  useFetch(async () => {
    const { error } = await API_AUTH._CHECKOUT();

    if (error) {
      alert(`驗證失敗，可能是登入狀態已過期，請重新整理 QAQ`);
      return;
    }

    alert('驗證成功');
  });
};

const handleSignup = () => {
  useFetch(async () => {
    const { error } = await API_AUTH._SIGNUP(signupFormData.value);

    if (error) {
      alert(`註冊失敗，${error.message} QAQ`);
      return;
    }

    alert('註冊成功');
    formType.value = 'login';
  });
};

const getTodos = () => {
  useFetch(async () => {
    const { response, error } = await API_TODO._GET();

    if (error) {
      alert('載入失敗，請重新整理或稍後再試 QAQ');
      return;
    }

    todos.value = response.data;
  });
};

const addTodo = () => {
  useFetch(async () => {
    const { error } = await API_TODO._ADD(inputTodo.value);
    if (error) {
      alert('新增失敗，請重新整理或稍後再試 QAQ');
      return;
    }

    inputTodo.value = '';
  }, getTodos);
};

const toggleTodo = (id: string) => {
  useFetch(async () => {
    const { error } = await API_TODO._TOGGLE(id);
    if (error) {
      alert('更新失敗，請重新整理或稍後再試 QAQ');
      return;
    }
  }, getTodos);
};

const updateTodo = () => {
  useFetch(async () => {
    if (!editingTodo.value) return;

    const { id, content } = editingTodo.value;
    const { error } = await API_TODO._UPDATE(id, content);

    if (error) {
      alert('更新失敗，請重新整理或稍後再試 QAQ');
      return;
    }

    editingTodo.value = null;
  }, getTodos);
};

const deleteTodo = (id: string) => {
  useFetch(async () => {
    const { error } = await API_TODO._DELETE(id);

    if (error) {
      alert('刪除失敗，請重新整理或稍後再試 QAQ');
      return;
    }
  }, getTodos);
};

watch(isLogin, () => {
  isLogin.value && getTodos();
});

onMounted(() => {
  axios.defaults.baseURL = 'https://todolist-api.hexschool.io';
});
</script>

<template>
  <main class="container mt-2 px-4">
    <div class="row justify-content-center">
      <h1 class="col-md-6 col-xl-4 mb-4 py-2 bg-primary rounded-3 text-center">熟悉的 TODO API</h1>
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
          :disabled="isLoading"
          class="btn btn-primary d-flex justify-content-center align-items-center gap-2 w-100"
        >
          <div v-if="isLoading" class="spinner-border spinner-border-sm" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <span>登入</span>
        </button>
        <button
          v-else
          type="button"
          @click="handleLogout"
          :disabled="isLoading"
          class="btn btn-primary d-flex justify-content-center align-items-center gap-2 w-100"
        >
          <div v-if="isLoading" class="spinner-border spinner-border-sm" role="status">
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
          :disabled="isLoading"
          class="btn btn-primary d-flex justify-content-center align-items-center gap-2 w-100"
        >
          <div v-if="isLoading" class="spinner-border spinner-border-sm" role="status">
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
  <section v-if="isLogin" class="container mb-3">
    <div class="row flex-column align-items-center">
      <h2 class="col-md-6 col-xl-4 mb-4 py-2 bg-primary rounded-3 text-center">
        {{ username }} 的待辦事項
      </h2>

      <!-- input todo -->
      <div class="col-md-6 col-xl-4 p-0">
        <div class="input-group mb-3">
          <input
            type="text"
            @keydown.enter="addTodo"
            v-model="inputTodo"
            class="form-control"
            placeholder="請輸入待辦事項"
          />
          <button type="button" @click="addTodo" class="btn btn-primary">新增待辦</button>
        </div>
      </div>

      <!-- todo list -->
      <ul class="list-group col-md-6 col-xl-4 mx-auto p-0 rounded-3">
        <li
          v-for="todo in todos"
          :key="todo.id"
          class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
        >
          <div class="d-flex align-items-center gap-2 form-check">
            <input
              @change="toggleTodo(todo.id)"
              v-model="todo.status"
              type="checkbox"
              class="form-check-input"
            />

            <!-- editing -->
            <div
              v-if="editingTodo?.id === todo.id"
              class="input-group-sm d-flex align-items-center"
            >
              <input type="text" v-model="editingTodo.content" class="form-control" />
              <button
                type="button"
                @click="updateTodo"
                class="btn btn-link btn-sm text-black text-nowrap"
              >
                完成
              </button>
            </div>

            <!-- content -->
            <div v-else class="d-flex align-items-center">
              <label> {{ todo.content }} </label>
              <button
                type="button"
                @click="editingTodo = todo"
                class="btn btn-link btn-sm text-black text-nowrap"
              >
                編輯
              </button>
            </div>
          </div>
          <button
            type="button"
            @click="deleteTodo(todo.id)"
            :id="todo.id"
            class="btn btn-outline-danger btn-sm"
          >
            刪除
          </button>
        </li>
      </ul>
    </div>
  </section>
</template>
