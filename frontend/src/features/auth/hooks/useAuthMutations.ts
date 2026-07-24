/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/features/auth/api/authApi';

export function useLogin() {
  return useMutation({
    mutationFn: authApi.login,
  });
}

export function useVerify2Fa() {
  return useMutation({
    mutationFn: authApi.verify2Fa,
  });
}

export function useGoogleLogin() {
  return useMutation({
    mutationFn: authApi.googleLogin,
  });
}

export function useFacebookLogin() {
  return useMutation({
    mutationFn: authApi.facebookLogin,
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: authApi.register,
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: authApi.forgotPassword,
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: authApi.resetPassword,
  });
}
