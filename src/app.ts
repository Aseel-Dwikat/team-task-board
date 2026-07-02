import type { Task, Priority, Status } from "./task.js";
import { getTasks, addTask, updateTask, deleteTask, updateTaskStatus } from "./storage.js";
import { renderTasks, playDeleteAnimation, playStatusPulse } from "./render.js";
import { confirmDialog } from "./modal.js";


const form = document.getElementById("taskForm") as HTMLFormElement;
const taskIdInput = document.getElementById("taskId") as HTMLInputElement;
const titleInput = document.getElementById("title") as HTMLInputElement;
const descriptionInput = document.getElementById("description") as HTMLTextAreaElement;
const assigneeInput = document.getElementById("assignee") as HTMLInputElement;
const priorityInput = document.getElementById("priority") as HTMLSelectElement;
const dueDateInput = document.getElementById("dueDate") as HTMLInputElement;
const submitBtn = document.getElementById("submitBtn") as HTMLButtonElement;
const cancelEditBtn = document.getElementById("cancelEditBtn") as HTMLButtonElement;


const searchInput = document.getElementById("searchInput") as HTMLInputElement;
const statusFilter = document.getElementById("statusFilter") as HTMLSelectElement;
const priorityFilter = document.getElementById("priorityFilter") as HTMLSelectElement;
const sortSelect = document.getElementById("sortSelect") as HTMLSelectElement;
const clearFiltersBtn = document.getElementById("clearFiltersBtn") as HTMLButtonElement;

const taskBoard = document.getElementById("taskBoard") as HTMLElement;

let editingTaskId: string | null = null;

function clearFieldError(el: HTMLElement): void {
  el.classList.remove("field-error");
}

function markFieldError(el: HTMLElement): void {
  el.classList.add("field-error");
}

function validateForm(): boolean {
  let isValid = true;

  [titleInput, assigneeInput, dueDateInput].forEach(clearFieldError);

  if (!titleInput.value.trim()) {
    markFieldError(titleInput);
    isValid = false;
  }

  if (!assigneeInput.value.trim()) {
    markFieldError(assigneeInput);
    isValid = false;
  }

  if (!dueDateInput.value) {
    markFieldError(dueDateInput);
    isValid = false;
  }

  return isValid;
}

[titleInput, assigneeInput, dueDateInput].forEach((el) => {
  el.addEventListener("input", () => clearFieldError(el));
});

function enterEditMode(task: Task): void {
  editingTaskId = task.id;
  taskIdInput.value = task.id;
  titleInput.value = task.title;
  descriptionInput.value = task.description ?? "";
  assigneeInput.value = task.assignee;
  priorityInput.value = task.priority;
  dueDateInput.value = task.dueDate;

  submitBtn.textContent = "Save Changes";
  cancelEditBtn.classList.remove("hidden");
  form.scrollIntoView({ behavior: "smooth", block: "start" });
}

function exitEditMode(): void {
  editingTaskId = null;
  form.reset();
  taskIdInput.value = "";
  priorityInput.value = "Medium";
  submitBtn.textContent = "Add Task";
  cancelEditBtn.classList.add("hidden");
  [titleInput, assigneeInput, dueDateInput].forEach(clearFieldError);
}

cancelEditBtn.addEventListener("click", exitEditMode);

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  if (editingTaskId) {
    const existing = getTasks().find((t) => t.id === editingTaskId);
    if (!existing) return;

    const updated: Task = {
      ...existing,
      title: titleInput.value.trim(),
      description: descriptionInput.value.trim() || undefined,
      assignee: assigneeInput.value.trim(),
      priority: priorityInput.value as Priority,
      dueDate: dueDateInput.value,
    };

    updateTask(updated);
    exitEditMode();
  } else {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: titleInput.value.trim(),
      description: descriptionInput.value.trim() || undefined,
      assignee: assigneeInput.value.trim(),
      priority: priorityInput.value as Priority,
      status: "To Do",
      dueDate: dueDateInput.value,
      createdAt: new Date().toISOString(),
    };

    addTask(newTask);
    form.reset();
    priorityInput.value = "Medium";
  }

  refreshBoard();
});

async function handleDelete(id: string): Promise<void> {
  const task = getTasks().find((t) => t.id === id);
  const taskName = task ? task.title : "this task";
  const confirmed = await confirmDialog(`Are you sure you want to delete "${taskName}"?`);
  if (!confirmed) return;

  await playDeleteAnimation(taskBoard, id);

  deleteTask(id);
  if (editingTaskId === id) exitEditMode();
  refreshBoard();
}

function handleEdit(id: string): void {
  const task = getTasks().find((t) => t.id === id);
  if (task) enterEditMode(task);
}

function handleStatusChange(id: string, status: Status): void {
  updateTaskStatus(id, status);

  if (statusFilter.value && statusFilter.value !== status) {
    refreshBoard();
    return;
  }

  playStatusPulse(taskBoard, id);
}

function getFilteredAndSortedTasks(): { tasks: Task[]; hasActiveFilters: boolean } {
  let tasks = getTasks();

  const searchTerm = searchInput.value.trim().toLowerCase();
  const statusValue = statusFilter.value;
  const priorityValue = priorityFilter.value;
  const sortValue = sortSelect.value;

  const hasActiveFilters = !!(searchTerm || statusValue || priorityValue);

  if (searchTerm) {
    tasks = tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(searchTerm) ||
        t.assignee.toLowerCase().includes(searchTerm)
    );
  }

  if (statusValue) {
    tasks = tasks.filter((t) => t.status === statusValue);
  }

  if (priorityValue) {
    tasks = tasks.filter((t) => t.priority === priorityValue);
  }

  if (sortValue === "dueDate") {
    tasks = [...tasks].sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    );
  } else if (sortValue === "priority") {
    const order: Record<Priority, number> = { High: 0, Medium: 1, Low: 2 };
    tasks = [...tasks].sort((a, b) => order[a.priority] - order[b.priority]);
  } else if (sortValue === "createdAt") {
    tasks = [...tasks].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }

  return { tasks, hasActiveFilters };
}

function refreshBoard(): void {
  const { tasks, hasActiveFilters } = getFilteredAndSortedTasks();
  renderTasks(
    taskBoard,
    tasks,
    { onEdit: handleEdit, onDelete: handleDelete, onStatusChange: handleStatusChange },
    hasActiveFilters
  );
}

[searchInput, statusFilter, priorityFilter, sortSelect].forEach((el) => {
  el.addEventListener("input", refreshBoard);
  el.addEventListener("change", refreshBoard);
});

clearFiltersBtn.addEventListener("click", () => {
  searchInput.value = "";
  statusFilter.value = "";
  priorityFilter.value = "";
  sortSelect.value = "";
  refreshBoard();
});

refreshBoard();