import type { CookieOptions } from "express";

export const AUTH_COOKIE_NAME = 'access_token';

export const getAuthCookieOptions = (): CookieOptions => ({
    httpOnly: true,
    secure: process.env.NODE_NEV === 'production',
    sameSite: 'lax',
    path: '/',
})