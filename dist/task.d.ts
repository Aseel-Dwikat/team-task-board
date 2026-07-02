export interface Task {
    id: string;
    title: string;
    description?: string;
    assignee: string;
    priority: "Low" | "Medium" | "High";
    status: "To Do" | "In Progress" | "Done";
    dueDate: string;
    createdAt: string;
}
//# sourceMappingURL=task.d.ts.map