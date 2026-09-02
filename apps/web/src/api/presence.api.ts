import { apiFetch } from "./http";

export const sendHeartbeatRequest = () => {
    return apiFetch('/presence/heartbeat', {
        method: 'POST',
    });
};