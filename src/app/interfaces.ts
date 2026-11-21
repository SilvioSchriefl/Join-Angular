/**
 * Datentypen von Join – so, wie das Django-Backend sie als JSON liefert.
 * Die Feldnamen müssen exakt zu den Serializern im Backend passen.
 */

export type TaskStatus = 'todo' | 'progress' | 'await' | 'done';
export type TaskPrio = 'urgent' | 'medium' | 'low';

export interface Subtask {
  title: string;
  done: boolean;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  created_at: string;
  due_date: string;
  status: TaskStatus;
  category_title: string;
  category_color: string;
  assigned_emails: string[];
  prio: TaskPrio | '';
  subtasks: Subtask[];
}

export interface Category {
  id: number;
  title: string;
  color: string;
  creator_email: string;
}

export interface User {
  id: number;
  email: string;
  color: string;
  initials: string;
  user_name: string;
  phone: string;
  user_contact: boolean;
  /** nur im Frontend: im Auswahlmenü angehakt */
  selected?: boolean;
}

export interface Contact {
  id: number;
  email: string;
  color: string;
  initials: string;
  user_name: string;
  phone: string;
  user_contact: boolean;
  created_by: number;
  /** nur im Frontend: im Auswahlmenü angehakt */
  selected?: boolean;
}
