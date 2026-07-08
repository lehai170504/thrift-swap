/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from '@tanstack/react-query';
import { loginApi, googleLoginApi, registerApi, forgotPasswordApi, resetPasswordApi } from '@/lib/api/auth';

export function useLogin() {
  return useMutation({
    mutationFn: loginApi,
  });
}

export function useGoogleLogin() {
  return useMutation({
    mutationFn: googleLoginApi,
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: registerApi,
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: forgotPasswordApi,
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: resetPasswordApi,
  });
}
