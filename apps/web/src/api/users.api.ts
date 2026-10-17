import type { User } from '@prisma/client';
import { apiFetch } from "./http";

export const getUsersRequest = () => {
    return apiFetch<User[]>('/users');
}