export type UserRole =
    | 'ADMIN'
    | 'MANAGER'
    | 'USER';

export interface IUser {
    id: string;
    email: string;
    role: UserRole;
    name: string | null;
}

export interface IAuthResponse {
    user: IUser;
}

export interface ILoginRequest {
    email: string;
    password: string;
}

export interface IRegisterRequest {
    email: string;
    password: string;
    name?: string;
}

export interface IDashboardSummary {
    usersOnline: number;
    usersTotal: number;
    tasksActive: number;
    tasksCompleted: number;
    tasksOverdue: number;
    tasksCreatedToday: number;
}

export const DASHBOARD_WIDGET_TYPES = {
    USERS_ONLINE: 'USERS_ONLINE',
    USERS_TOTAL: 'USERS_TOTAL',
    TASKS_ACTIVE: 'TASKS_ACTIVE',
    TASKS_COMPLETED: 'TASKS_COMPLETED',
    TASKS_OVERDUE: 'TASKS_OVERDUE',
    TASKS_CREATED_TODAY: 'TASKS_CREATED_TODAY',
    TASK_ACTIVITY: 'TASK_ACTIVITY',
    RECENT_ACTIVITY: 'RECENT_ACTIVITY',
} as const;

export type DashboardWidgetType = typeof DASHBOARD_WIDGET_TYPES[keyof typeof DASHBOARD_WIDGET_TYPES];

export const DEFAULT_DASHBOARD_WIDGETS: DashboardWidgetType[] = Object.values(DASHBOARD_WIDGET_TYPES);

export interface IDashboardWidget {
    type: DashboardWidgetType[];
}

export interface IDashboardLayout {
  widgets: DashboardWidgetType[];
}

export const DASHBOARD_ACTIVITY_PERIOD = [7, 30, 90] as const;

export type DashboardActivityPeriod = typeof DASHBOARD_ACTIVITY_PERIOD[number];

export interface IDashboardTaskActivityPoint {
    date: string,
    created: number,
    completed: number, 
};

export const DASHBOARD_ACTIVITY_TYPES = {
    TASK_CREATED: 'TASK_CREATED',
    TASK_UPDATED: 'TASK_UPDATED',
    TASK_STATUS_CHANGED: 'TASK_STATUS_CHANGED',
    TASK_ASSIGNEE_CHANGED: 'TASK_ASSIGNEE_CHANGED',
} as const;

export type DashboardActivityType = typeof DASHBOARD_ACTIVITY_TYPES[keyof typeof DASHBOARD_ACTIVITY_TYPES];

export interface IDashboardRecentActivityItem {
    id: string;
    type: DashboardActivityType;
    message: string;
    createdAt: string;
    user: {
        id: string;
        name: string | null;
        email: string;
    };
    task: {
        id: string;
        title: string;
    } | null;
}

export const TASK_STATUSES = {
    TODO: 'TODO',
    IN_PROGRESS: 'IN_PROGRESS',
    DONE: 'DONE',
    CANCELED: 'CANCELED',
} as const;

export type TaskStatus = typeof TASK_STATUSES[keyof typeof TASK_STATUSES];

export const TASK_PRIORITIES = {
    LOW: 'LOW',
    MEDIUM: 'MEDIUM',
    HIGH: 'HIGH',
    URGENT: 'URGENT',
} as const;

export type TaskPriority = typeof TASK_PRIORITIES[keyof typeof TASK_PRIORITIES];

export interface ITaskUser {
    id: string;
    email: string;
    name: string | null;
}

export interface ITask {
    id: string;
    title: string;
    description: string | null;
    status: TaskStatus;
    priority: TaskPriority;
    createdById: string;
    assigneeId: string | null;
    dueAt: string | null;
    completedAt: string | null;
    createdAt: string;
    updatedAt: string;
    createdBy: ITaskUser;
    assignee: ITaskUser | null;
}

export interface ICreateTaskRequest {
    title: string;
    description?: string;
    priority?: TaskPriority;
    assigneeId?: string;
    dueAt?: string;
}

export interface IUpdateTaskStatusRequest {
    status: TaskStatus;
}