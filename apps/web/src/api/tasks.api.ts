import type { ICreateTaskRequest, ITask, IUpdateTaskStatusRequest } from '@cryptoleap_crm/shared';
import { apiFetch } from './http';

export const getTasksRequest = () => {
    return apiFetch<ITask[]>('/tasks');
};

export const createTaskRequest = (payload: ICreateTaskRequest) => {
    return apiFetch<ITask>('/tasks', {
        method: 'POST',
        body: JSON.stringify(payload),
    });
};

export const updateTaskStatusRequest = (taskId: string, payload: IUpdateTaskStatusRequest) => {
    return apiFetch<ITask>(`/tasks/${taskId}/status`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
    });
};