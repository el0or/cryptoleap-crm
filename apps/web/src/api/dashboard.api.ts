import type { IDashboardSummary, IDashboardLayout, DashboardWidgetType } from "@cryptoleap_crm/shared";
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