import type { Task, Status } from "./task.js";

export interface RenderCallbacks {
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Status) => void;
}

const STATUS_OPTIONS: Status[] = ["To Do", "In Progress", "Done"];

function priorityClass(priority: Task["priority"]): string {
  return priority.toLowerCase(); 
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}

function escapeHtml(str: string): string {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

export function playDeleteAnimation(container: HTMLElement, id: string): Promise<void> {
  return new Promise((resolve) => {
    const card = container.querySelector<HTMLElement>(`.task-card[data-id="${id}"]`);
    if (!card) {
      resolve();
      return;
    }

    card.classList.add("card-exit");

    const fallback = setTimeout(resolve, 350);
    card.addEventListener(
      "animationend",
      () => {
        clearTimeout(fallback);
        resolve();
      },
      { once: true }
    );
  });
}

export function playStatusPulse(container: HTMLElement, id: string): void {
  const card = container.querySelector<HTMLElement>(`.task-card[data-id="${id}"]`);
  if (!card) return;
  card.classList.add("status-pulse");
  card.addEventListener("animationend", () => card.classList.remove("status-pulse"), {
    once: true,
  });
}

export function renderTasks(
  container: HTMLElement,
  tasks: Task[],
  callbacks: RenderCallbacks,
  hasActiveFilters: boolean
): void {
  container.innerHTML = "";

  if (tasks.length === 0) {
    const emptyMessage = hasActiveFilters
      ? "No tasks match your search or filters."
      : "No tasks yet. Start by adding a new task!";
    const emptyDiv = document.createElement("div");
    emptyDiv.className = "empty-state";
    emptyDiv.textContent = emptyMessage;
    container.appendChild(emptyDiv);
    return;
  }

  tasks.forEach((task, index) => {
    const card = document.createElement("div");
    card.className = `task-card ${priorityClass(task.priority)}`;
    card.dataset.id = task.id;
    card.style.animationDelay = `${Math.min(index, 10) * 0.05}s`;

    card.innerHTML = `
      <h3>${escapeHtml(task.title)}</h3>
      ${task.description ? `<p class="task-desc">${escapeHtml(task.description)}</p>` : ""}
      <p>Assignee: ${escapeHtml(task.assignee)}</p>
      <p class="priority-${priorityClass(task.priority)}">Priority: ${task.priority}</p>
      <p>Due: ${formatDate(task.dueDate)}</p>
      <label class="status-label">
        Status:
        <select class="status-select" data-id="${task.id}">
          ${STATUS_OPTIONS.map(
            (s) => `<option value="${s}" ${s === task.status ? "selected" : ""}>${s}</option>`
          ).join("")}
        </select>
      </label>
      <div class="card-actions">
        <button type="button" class="edit-btn" data-id="${task.id}">Edit</button>
        <button type="button" class="delete-btn" data-id="${task.id}">Delete</button>
      </div>
    `;

    container.appendChild(card);
  });

  container.querySelectorAll<HTMLButtonElement>(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", () => callbacks.onEdit(btn.dataset.id!));
  });

  container.querySelectorAll<HTMLButtonElement>(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", () => callbacks.onDelete(btn.dataset.id!));
  });

  container.querySelectorAll<HTMLSelectElement>(".status-select").forEach((select) => {
    select.addEventListener("change", () =>
      callbacks.onStatusChange(select.dataset.id!, select.value as Status)
    );
  });
}