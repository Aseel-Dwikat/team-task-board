export function saveTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
export function getTasks() {
    const data = localStorage.getItem("tasks");
    return data ? JSON.parse(data) : [];
}
//# sourceMappingURL=storage.js.map