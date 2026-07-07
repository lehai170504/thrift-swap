// Re-export từ feature folder — file này chỉ là bridge backward compatibility
export * from '@/features/admin/api/adminApi';

// Legacy named function exports (admin.ts gốc dùng function names, không phải object)
import { adminApi } from '@/features/admin/api/adminApi';

export const getPendingWithdrawals = adminApi.getPendingWithdrawals;
export const approveWithdrawal = adminApi.approveWithdrawal;
export const rejectWithdrawal = adminApi.rejectWithdrawal;
export const globalSearch = adminApi.globalSearch;
export const getAllUsers = adminApi.getAllUsers;
export const banUser = adminApi.banUser;
export const unbanUser = adminApi.unbanUser;
export const getTotalEscrow = adminApi.getTotalEscrow;
export const getChartData = adminApi.getChartData;
export const getAllAdminProducts = adminApi.getAllAdminProducts;
export const deleteAdminProduct = adminApi.deleteAdminProduct;
