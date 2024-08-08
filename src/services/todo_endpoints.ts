import axios from 'axios';
import { sendRequest } from '.';
import type { LoginForm, SignupForm } from '@/types';

export const API_AUTH = {
  _SIGNUP: (signupFormData: SignupForm) =>
    sendRequest(() => axios.post('/users/sign_up', signupFormData)),
  _LOGIN: (loginFormData: LoginForm) =>
    sendRequest(() => axios.post('/users/sign_in', loginFormData)),
  _LOGOUT: () => sendRequest(() => axios.post('/users/sign_out')),
  _CHECKOUT: () => sendRequest(() => axios.get('/users/checkout'))
};

export const API_TODO = {
  _GET: () => sendRequest(() => axios.get('/todos')),
  _ADD: (newItem: string) => sendRequest(() => axios.post('/todos', { content: newItem })),
  _TOGGLE: (id: string) => sendRequest(() => axios.patch(`/todos/${id}/toggle`)),
  _UPDATE: (id: string, content: string) =>
    sendRequest(() => axios.put(`/todos/${id}`, { content })),
  _DELETE: (id: string) => sendRequest(() => axios.delete(`/todos/${id}`))
};
