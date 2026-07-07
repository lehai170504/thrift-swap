import api from '@/lib/axios';

export interface WalletResponse {
  id: string;
  balance: number;
  heldBalance: number;
  recentTransactions: TransactionResponse[];
}

export interface TransactionResponse {
  id: string;
  amount: number;
  type: 'DEPOSIT' | 'WITHDRAW' | 'PAYMENT' | 'ESCROW_HOLD' | 'ESCROW_RELEASE' | 'REFUND';
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  createdAt: string;
}

export interface WithdrawRequest {
  amount: number;
  bankName: string;
  accountNumber: string;
  accountName: string;
}

export const walletApi = {
  getMyWallet: async (): Promise<WalletResponse> => {
    const { data } = await api.get('/wallets/me');
    return data;
  },

  deposit: async (amount: number): Promise<WalletResponse> => {
    const { data } = await api.post('/wallets/deposit', { amount });
    return data;
  },

  withdraw: async (data: WithdrawRequest): Promise<WalletResponse> => {
    const response = await api.post('/wallets/withdraw', data);
    return response.data;
  },

  createVNPayPayment: async (amount: number): Promise<{ paymentUrl: string }> => {
    const { data } = await api.post('/payment/vnpay/create-payment', { amount });
    return data;
  },
};
