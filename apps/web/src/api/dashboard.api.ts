import type { DashboardActivityPeriod, DashboardWidgetType, IDashboardLayout, IDashboardSummary, IDashboardTaskActivityPoint } from '@cryptoleap_crm/shared';
import { apiFetch } from "./http";

export const getDashboardSummaryRequest = () => {
    return apiFetch<IDashboardSummary>('/dashboard/summary');
};

export const getDashboardLayoutRequest = () => {
    return apiFetch<IDashboardLayout>('/dashboard/layout');
};

export const updateDashboardLayoutRequest = (widgets: DashboardWidgetType[]) => {
    return apiFetch<IDashboardLayout>('/dashboard/layout', {
        method: 'PUT',
        body: JSON.stringify({ widgets }),
    });
};

export const getDashboardTaskActivityRequest = (days: DashboardActivityPeriod) => {
    return apiFetch<IDashboardTaskActivityPoint[]>(`/dashboard/task-activity?days=${days}`);
};