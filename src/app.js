const form = document.getElementById("taskForm");
const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const assigneeInput = document.getElementById("assignee");
const priorityInput = document.getElementById("priority");
const dueDateInput = document.getElementById("dueDate");
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const newTask = {
        id: crypto.randomUUID(),
        title: titleInput.value,
        description: descriptionInput.value,
        assignee: assigneeInput.value,
        priority: priorityInput.value,
        status: "To Do",
        dueDate: dueDateInput.value,
        createdAt: new Date().toISOString()
    };
    console.log("New Task Created:", newTask);
    form.reset();
});
export {};
//# sourceMappingURL=app.js.map