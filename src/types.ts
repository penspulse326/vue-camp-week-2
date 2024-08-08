export interface TodoItem {
  content: string;
  createTime: number;
  id: string;
  status: boolean;
}

export type FormType = 'login' | 'signup';

export interface LoginForm {
  email: string;
  password: string;
}

export interface SignupForm extends LoginForm {
  nickname: string;
}
