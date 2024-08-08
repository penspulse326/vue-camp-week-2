export interface TodoItem {
  content: string;
  createTime: number;
  id: string;
  status: boolean;
}

export type FormType = 'login' | 'signup';
