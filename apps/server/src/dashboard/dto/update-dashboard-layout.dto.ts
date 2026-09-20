import { ArrayUnique, IsArray, IsIn } from 'class-validator';
import { DASHBOARD_WIDGET_TYPES, type DashboardWidgetType } from '@cryptoleap_crm/shared';

export class UpdateDashboardLayoutDto {
    @IsArray()
    @ArrayUnique()
    @IsIn(Object.values(DASHBOARD_WIDGET_TYPES), { each: true })
    widgets: DashboardWidgetType[];
}