const STATUS_OPTIONS = ["To Do", "In Progress", "Done"];
function priorityClass(priority) {
    return priority.toLowerCase(); 
}
function formatDate(dateStr) {
    if (!dateStr)
        return "-";
    const d = new Date(dateStr);
    if (isNaN(d.getTime()))
        return dateStr;
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}
function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}
export function renderTasks(container, tasks, callbacks, hasActiveFilters) {
    container.innerHTML = "";
    if (tasks.length === 0) {
        const emptyMessage = hasActiveFilters
            ? "No matching tasks found."
            : "No tasks available. Add a new task to get started!";
        const emptyDiv = document.createElement("div");
        emptyDiv.className = "empty-state";
        emptyDiv.textContent = emptyMessage;
        container.appendChild(emptyDiv);
        return;
    }
    console.log("RENDER TASKS:", tasks);
    for (const task of tasks) {
        const card = document.createElement("div");
        card.className = `task-card ${priorityClass(task.priority)}`;
        card.dataset.id = task.id;
        card.innerHTML = `
      <h3>${escapeHtml(task.title)}</h3>
      ${task.description ? `<p class="task-desc">${escapeHtml(task.description)}</p>` : ""}
      <p>Assignee: ${escapeHtml(task.assignee)}</p>
      <p class="priority-${priorityClass(task.priority)}">Priority: ${task.priority}</p>
      <p>Due: ${formatDate(task.dueDate)}</p>
      <label class="status-label">
        Status:
        <select class="status-select" data-id="${task.id}">
          ${STATUS_OPTIONS.map((s) => `<option value="${s}" ${s === task.status ? "selected" : ""}>${s}</option>`).join("")}
        </select>
      </label>
      <div class="card-actions">
        <button type="button" class="edit-btn" data-id="${task.id}">Edit</button>
        <button type="button" class="delete-btn" data-id="${task.id}">Delete</button>
      </div>
    `;
        container.appendChild(card);
    }
    // نربط الأحداث مرة وحدة بعد ما نبني كل الكروت (event delegation)
    container.querySelectorAll(".edit-btn").forEach((btn) => {
        btn.addEventListener("click", () => callbacks.onEdit(btn.dataset.id));
    });
    container.querySelectorAll(".delete-btn").forEach((btn) => {
        btn.addEventListener("click", () => callbacks.onDelete(btn.dataset.id));
    });
    container.querySelectorAll(".status-select").forEach((select) => {
        select.addEventListener("change", () => callbacks.onStatusChange(select.dataset.id, select.value));
    });
}
//# sourceMappingURL=render.js.map