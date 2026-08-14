import type { UserRole } from "@cryptoleap_crm/shared";

export interface JwtPayload {
    sub: string;
    email: string;
    role: UserRole;
}