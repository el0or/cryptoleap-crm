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