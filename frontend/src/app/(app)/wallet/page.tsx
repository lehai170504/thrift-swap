'use client';

import { useWallet, usePayOSPayment, useWithdraw } from '@/features/wallet/hooks/useWallet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatCurrency, preventInvalidNumberInput } from '@/lib/utils';
import { Wallet, ArrowDownToLine, ArrowUpRight, History, ShieldCheck, Clock, ArrowLeft, Banknote } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function WalletPage() {
  const router = useRouter();
  const { data: wallet, isLoading } = useWallet();
  const { mutate: createPayment, isPending: isDepositing } = usePayOSPayment();
  const { mutate: withdraw, isPending: isWithdrawing } = useWithdraw();

  const [depositAmount, setDepositAmount] = useState('');

  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');

  if (isLoading) {
    return <div className="container py-8 flex justify-center"><div className="animate-pulse w-full max-w-4xl h-96 bg-muted rounded-xl"></div></div>;
  }

  if (!wallet) {
    return <div className="container py-8 text-center text-muted-foreground">Không thể tải thông tin ví.</div>;
  }

  const handleDeposit = () => {
    const amount = Number(depositAmount);
    if (amount > 0) {
      createPayment(amount, {
        onSuccess: (data) => {
          setDepositAmount('');
          if (data?.paymentUrl) {
            window.location.href = data.paymentUrl;
          }
        }
      });
    }
  };

  const handleWithdraw = () => {
    const amount = Number(withdrawAmount);
    if (amount > 0 && bankName && accountNumber && accountName) {
      withdraw({ amount, bankName, accountNumber, accountName }, {
        onSuccess: () => {
          setWithdrawAmount('');
          setBankName('');
          setAccountNumber('');
          setAccountName('');
        }
      });
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'DEPOSIT': return <ArrowDownToLine className="w-5 h-5 text-green-500" />;
      case 'WITHDRAW': return <ArrowUpRight className="w-5 h-5 text-red-500" />;
      case 'ESCROW_HOLD': return <ShieldCheck className="w-5 h-5 text-orange-500" />;
      case 'ESCROW_RELEASE': return <ShieldCheck className="w-5 h-5 text-green-500" />;
      case 'PAYMENT': return <ArrowUpRight className="w-5 h-5 text-blue-500" />;
      case 'REFUND': return <ArrowDownToLine className="w-5 h-5 text-purple-500" />;
      default: return <History className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getTransactionLabel = (type: string) => {
    switch (type) {
      case 'DEPOSIT': return 'Nạp tiền';
      case 'WITHDRAW': return 'Rút tiền';
      case 'ESCROW_HOLD': return 'Tạm giữ (Ký quỹ)';
      case 'ESCROW_RELEASE': return 'Hoàn trả ký quỹ';
      case 'PAYMENT': return 'Thanh toán đơn hàng';
      case 'REFUND': return 'Hoàn tiền';
      default: return type;
    }
  };

  const getTransactionSign = (type: string) => {
    if (['DEPOSIT', 'ESCROW_RELEASE', 'REFUND'].includes(type)) return '+';
    if (['WITHDRAW', 'PAYMENT', 'ESCROW_HOLD'].includes(type)) return '-';
    return '';
  };

  const getTransactionColor = (type: string) => {
    if (['DEPOSIT', 'ESCROW_RELEASE', 'REFUND'].includes(type)) return 'text-green-600 dark:text-green-400';
    if (['WITHDRAW', 'PAYMENT', 'ESCROW_HOLD'].includes(type)) return 'text-red-600 dark:text-red-400';
    return 'text-foreground';
  };

  return (
    <div className="container py-8 max-w-5xl mx-auto space-y-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-2 -ml-4 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Quay lại
      </Button>

      <div className="flex items-center gap-4 mb-6">
        <div className="p-4 bg-primary/20 rounded-[24px] border border-primary/20 flex-shrink-0">
          <Wallet className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold tracking-tight text-foreground">Ví điện tử</h1>
          <p className="text-muted-foreground">Quản lý số dư và lịch sử giao dịch của bạn</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Số dư */}
        <div className="bg-gradient-to-br from-primary/30 to-primary/5 text-foreground rounded-[32px] relative overflow-hidden border border-primary/20 p-8 lg:p-10 flex flex-col justify-between min-h-[300px]">
          <div className="absolute top-0 right-0 p-8 opacity-20">
            <Wallet className="w-40 h-40 text-primary" />
          </div>
          <div className="relative z-10">
            <h3 className="text-primary font-bold text-lg mb-4">Số dư khả dụng</h3>
            <div className="space-y-6">
              <div>
                <p className="text-5xl font-bold tracking-tight text-foreground">
                  {formatCurrency(wallet.balance)}
                </p>
              </div>

              {wallet.heldBalance > 0 && (
                <div className="pt-6 border-t border-primary/20 flex items-center justify-between">
                  <span className="text-sm text-foreground/80 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-primary" /> Số dư đang tạm giữ
                  </span>
                  <span className="font-semibold text-foreground">{formatCurrency(wallet.heldBalance)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Nạp tiền */}
          <div className="rounded-[32px] bg-white/5 border border-white/10 p-6 lg:p-8 flex flex-col justify-between gap-6 transition-colors hover:bg-white/10">
            <div>
              <h3 className="text-xl font-bold text-foreground mb-1">Nạp tiền vào ví</h3>
              <p className="text-sm text-muted-foreground">Thanh toán bảo mật qua cổng PayOS</p>
            </div>

            <div className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                {[50000, 100000, 500000].map(val => (
                  <Button
                    key={val}
                    variant="outline"
                    size="sm"
                    className="rounded-[16px] border-white/10 bg-white/5 hover:bg-white/10 text-foreground"
                    onClick={() => setDepositAmount(val.toString())}
                  >
                    +{formatCurrency(val)}
                  </Button>
                ))}
              </div>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">VNĐ</span>
                  <Input
                    type="number"
                    placeholder="Nhập số tiền..."
                    className="pl-14 rounded-[20px] bg-white/5 border-white/10 text-foreground h-12"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    onKeyDown={preventInvalidNumberInput}
                    min="0"
                    step="1"
                  />
                </div>
                <Button className="h-12 rounded-[20px] px-6 font-bold" onClick={handleDeposit} disabled={!depositAmount || Number(depositAmount) <= 0 || isDepositing}>
                  {isDepositing ? 'Đang xử lý...' : 'Nạp ngay'}
                </Button>
              </div>
            </div>
          </div>

          {/* Rút tiền */}
          <div className="rounded-[32px] bg-white/5 border border-white/10 p-6 lg:p-8 flex flex-col justify-between gap-6 transition-colors hover:bg-white/10">
            <div>
              <h3 className="text-xl font-bold text-orange-500 flex items-center gap-2 mb-1">
                <Banknote className="w-5 h-5" /> Rút tiền về Ngân hàng
              </h3>
              <p className="text-sm text-muted-foreground">Tiền sẽ được admin duyệt và chuyển khoản thủ công</p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">VNĐ</span>
                <Input
                  type="number"
                  placeholder="Số tiền cần rút..."
                  className="pl-14 rounded-[20px] bg-white/5 border-white/10 text-foreground h-12 font-bold"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  onKeyDown={preventInvalidNumberInput}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  placeholder="Tên ngân hàng"
                  className="rounded-[16px] bg-white/5 border-white/10 text-foreground h-12"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                />
                <Input
                  placeholder="Số tài khoản"
                  className="rounded-[16px] bg-white/5 border-white/10 text-foreground h-12"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                />
              </div>
              <Input
                placeholder="Tên chủ tài khoản"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="uppercase rounded-[16px] bg-white/5 border-white/10 text-foreground h-12"
              />

              <Button
                variant="default"
                className="w-full h-12 rounded-[20px] bg-orange-600 hover:bg-orange-700 text-white font-bold"
                onClick={handleWithdraw}
                disabled={!withdrawAmount || Number(withdrawAmount) <= 0 || !bankName || !accountNumber || !accountName || isWithdrawing}
              >
                {isWithdrawing ? 'Đang gửi yêu cầu...' : 'Tạo yêu cầu rút tiền'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Lịch sử */}
      <div className="rounded-[32px] bg-white/5 border border-white/10 p-6 lg:p-8 mt-8">
        <h3 className="text-xl font-bold text-foreground flex items-center gap-2 mb-6">
          <History className="w-5 h-5" /> Lịch sử giao dịch
        </h3>

        {wallet.recentTransactions.length === 0 ? (
          <div className="py-12 text-center flex flex-col items-center text-muted-foreground bg-white/5 rounded-[24px]">
            <Clock className="w-12 h-12 mb-3 opacity-20" />
            <p>Chưa có giao dịch nào phát sinh.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {wallet.recentTransactions.map((tx) => (
              <div key={tx.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 lg:p-6 rounded-[24px] border border-white/5 bg-white/5 hover:bg-white/10 transition-colors gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-full flex-shrink-0">
                    {getTransactionIcon(tx.type)}
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-lg">{getTransactionLabel(tx.type)}</p>
                    {tx.description && (
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {tx.description}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1.5">
                      {new Date(tx.createdAt).toLocaleString('vi-VN')}
                    </p>
                  </div>
                </div>
                <div className="sm:text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                  <p className={`font-black text-xl ${getTransactionColor(tx.type)}`}>
                    {getTransactionSign(tx.type)}{formatCurrency(tx.amount)}
                  </p>
                  <p className="text-sm text-muted-foreground font-medium mt-1">
                    {tx.status === 'COMPLETED' ? 'Thành công' : tx.status === 'PENDING' ? 'Đang chờ' : tx.status === 'FAILED' ? 'Thất bại' : tx.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
