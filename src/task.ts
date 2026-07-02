export type Priority = "Low" | "Medium" | "High";
export type Status = "To Do" | "In Progress" | "Done";

export interface Task {
  id: string;
  title: string;
  description?: string;
  assignee: string;
  priority: Priority;
  status: Status;
  dueDate: string; // yyyy-mm-dd
  createdAt: string; // timestamp
}
