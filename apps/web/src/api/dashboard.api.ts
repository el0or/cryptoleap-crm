import type { IDashboardSummary } from "@cryptoleap_crm/shared";
import { apiFetch } from "./http";

export const getDashboardSummaryRequest = () => {
    return apiFetch<IDashboardSummary>('/dashboard/summary');
};