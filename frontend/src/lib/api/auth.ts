// Re-export từ feature folder — bridge backward compatibility
export * from '@/features/auth/api/authApi';

import { authApi } from '@/features/auth/api/authApi';
export const loginApi = authApi.login;
export const googleLoginApi = authApi.googleLogin;
export const registerApi = authApi.register;
export const logoutApi = authApi.logout;
export const refreshTokenApi = authApi.refreshToken;
export const forgotPasswordApi = authApi.forgotPassword;
export const resetPasswordApi = authApi.resetPassword;
