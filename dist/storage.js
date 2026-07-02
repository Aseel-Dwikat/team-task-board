const STORAGE_KEY = "tasks";
export function getTasks() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data)
        return [];
    try {
        return JSON.parse(data);
    }
    catch {
        // إذا صار خطأ بالبيانات المخزنة، منرجع مصفوفة فاضية بدل ما البرنامج يطيح
        return [];
    }
}
function saveTasks(tasks) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}
export function addTask(task) {
    const tasks = getTasks();
    tasks.push(task);
    saveTasks(tasks);
    return tasks;
}
export function updateTask(updated) {
    const tasks = getTasks().map((t) => (t.id === updated.id ? updated : t));
    saveTasks(tasks);
    return tasks;
}
export function deleteTask(id) {
    const tasks = getTasks().filter((t) => t.id !== id);
    saveTasks(tasks);
    return tasks;
}
export function updateTaskStatus(id, status) {
    const tasks = getTasks().map((t) => (t.id === id ? { ...t, status } : t));
    saveTasks(tasks);
    return tasks;
}
//# sourceMappingURL=storage.js.map