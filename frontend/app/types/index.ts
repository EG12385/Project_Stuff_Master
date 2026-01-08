// User, Workspace, Project, Task, Attachments, Members, etc.

export interface User {
  _id: string;
  email: string;
  name: string;
  createdAt: string;
  isEmailVerified: boolean;
  updatedAt: string;
  profilePicture?: string;
}

export interface Workspace {
  _id: string;
  name: string;
  description?: string;
  owner: User | string;
  color: string;
  projects?: Project[];
  members: {
    user: User;
    role: "admin" | "member" | "owner" | "viewer";
    joinedAt: string;
  }[];
  tasks?: Task[];  
  notes?: Note[];   
  createdAt: string;
  updatedAt: string;
}


// Project and Task Enums
export enum ProjectStatus {
  PLANNING = "Planning",
  IN_PROGRESS = "In Progress",
  ON_HOLD = "On Hold",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled",
}

export enum TaskStatus {
  TO_DO = "To Do",
  IN_PROGRESS = "In Progress",
  DONE = "Done",
}

export enum TaskPriority {
  HIGH = "High",
  MEDIUM = "Medium",
  LOW = "Low",
}

// Project, Task, Subtask, Attachments
export interface Project {
  _id: string;
  title: string;
  description?: string;
  status: ProjectStatus;
  workspace: Workspace;
  startDate: string;
  dueDate: string;
  progress: number;
  tasks: Task[];
  members: {
    user: User;
    role: "admin" | "member" | "owner" | "viewer";
  }[];
  createdAt: string;
  updatedAt: string;
  isArchived: boolean;
}

export interface Subtask {
  _id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  project: Project;
  createdAt: string;
  updatedAt: string;
  isArchived: boolean;
  dueDate: string;
  priority: TaskPriority;
  assignee: User | string;
  createdBy: User | string;
  assignees: User[];
  subtasks?: Subtask[];
  watchers?: User[];
  attachments?: Attachment[];
}

export interface Attachment {
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedBy: string;
  uploadedAt: string;
  _id: string;
}

// Stats, Dashboard Types
export interface StatsCardProps {
  totalProjects: number;
  totalTasks: number;
  totalProjectInProgress: number;
  totalTaskCompleted: number;
  totalTaskToDo: number;
  totalTaskInProgress: number;
  totalOverdueTasks: number;
}

export interface TaskTrendsData {
  name: string;
  completed: number;
  inProgress: number;
  todo: number;
}

export interface TaskPriorityData {
  name: string;
  value: number;
  color: string;
}

export interface ProjectStatusData {
  name: string;
  value: number;
  color: string;
}

export interface WorkspaceProductivityData {
  name: string;
  completed: number;
  total: number;
}


export interface Note {
  _id: string;
  content: string;
  createdAt: string;
  createdBy: User | string;
}