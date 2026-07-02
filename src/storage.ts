import type { Task } from "./task.js";

const STORAGE_KEY = "tasks";

export function getTasks(): Task[] {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data) as Task[];
  } catch {
    // إذا صار خطأ بالبيانات المخزنة، منرجع مصفوفة فاضية بدل ما البرنامج يطيح
    return [];
  }
}

function saveTasks(tasks: Task[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export function addTask(task: Task): Task[] {
  const tasks = getTasks();
  tasks.push(task);
  saveTasks(tasks);
  return tasks;
}

export function updateTask(updated: Task): Task[] {
  const tasks = getTasks().map((t) => (t.id === updated.id ? updated : t));
  saveTasks(tasks);
  return tasks;
}

export function deleteTask(id: string): Task[] {
  const tasks = getTasks().filter((t) => t.id !== id);
  saveTasks(tasks);
  return tasks;
}

export function updateTaskStatus(id: string, status: Task["status"]): Task[] {
  const tasks = getTasks().map((t) => (t.id === id ? { ...t, status } : t));
  saveTasks(tasks);
  return tasks;
}