import api from '../axios';

export interface TransactionResponse {
  id: string;
  amount: number;
  type: 'DEPOSIT' | 'WITHDRAW' | 'PAYMENT' | 'ESCROW_HOLD' | 'ESCROW_RELEASE' | 'REFUND';
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  createdAt: string;
}

export interface WalletResponse {
  id: string;
  balance: number;
  heldBalance: number;
  recentTransactions: TransactionResponse[];
}

export interface WithdrawRequest {
  amount: number;
  bankName: string;
  accountNumber: string;
  accountName: string;
}

export const getMyWallet = async (): Promise<WalletResponse> => {
  const response = await api.get('/wallets/me');
  return response.data;
};

export const deposit = async (amount: number): Promise<WalletResponse> => {
  const response = await api.post('/wallets/deposit', { amount });
  return response.data;
};

export const withdraw = async (data: WithdrawRequest): Promise<WalletResponse> => {
  const response = await api.post('/wallets/withdraw', data);
  return response.data;
};

export const createVNPayPayment = async (amount: number): Promise<{ paymentUrl: string }> => {
  const response = await api.post('/payment/vnpay/create-payment', { amount });
  return response.data;
};
