/**
 * Datentypen von Join – so, wie das Django-Backend sie als JSON liefert.
 * Die Feldnamen müssen exakt zu den Serializern im Backend passen.
 */

export type TaskStatus = 'todo' | 'progress' | 'await' | 'done';
export type TaskPrio = 'urgent' | 'medium' | 'low';

export interface Subtask {
  title: string;
  done: boolean;
  /** nur im Frontend: wird gerade bearbeitet */
  selected?: boolean;
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

/** Eine neue Aufgabe, bevor sie gespeichert ist: id und created_at vergibt das Backend */
export type NewTask = Omit<Task, 'id' | 'created_at'>;

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

/** Benutzer und Kontakte zusammen – so wie in der Kontaktliste angezeigt */
export type Person = User | Contact;

/** Gibt true zurück, wenn die Person ein angelegter Kontakt ist (kein registrierter Benutzer) */
export function isContact(person: Person): person is Contact {
  return 'created_by' in person;
}

/**
 * Der eingeloggte Benutzer, wie er nach dem Login im localStorage liegt.
 * localStorage speichert nur Text, und ein fehlender Eintrag ergibt null.
 */
export interface CurrentUser {
  user_name: string | null;
  email: string | null;
  user_id: string | null;
  token: string | null;
  color: string | null;
  initials: string | null;
}
