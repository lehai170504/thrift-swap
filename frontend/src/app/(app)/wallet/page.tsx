'use client';

import { useWallet, useVNPayPayment, useWithdraw } from '@/features/wallet/hooks/useWallet';
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
  const { mutate: createPayment, isPending: isDepositing } = useVNPayPayment();
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
    <div className="container py-8 max-w-5xl mx-auto space-y-6">
      <Button variant="ghost" onClick={() => router.back()} className="mb-2 -ml-4 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Quay lại
      </Button>

      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-primary/10 rounded-xl">
          <Wallet className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ví điện tử</h1>
          <p className="text-muted-foreground">Quản lý số dư và lịch sử giao dịch của bạn</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Số dư */}
        <Card className="bg-gradient-to-br from-primary/90 to-primary/70 text-primary-foreground border-0 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Wallet className="w-32 h-32" />
          </div>
          <CardHeader>
            <CardTitle className="text-primary-foreground/80 font-medium">Số dư khả dụng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 relative z-10">
            <div>
              <p className="text-5xl font-bold tracking-tight">
                {formatCurrency(wallet.balance)}
              </p>
            </div>

            {wallet.heldBalance > 0 && (
              <div className="pt-4 border-t border-primary-foreground/20 flex items-center justify-between">
                <span className="text-sm text-primary-foreground/80 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> Số dư đang tạm giữ
                </span>
                <span className="font-semibold">{formatCurrency(wallet.heldBalance)}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* Nạp tiền */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Nạp tiền vào ví</CardTitle>
              <CardDescription>Thanh toán bảo mật qua cổng VNPAY</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                {[50000, 100000, 500000].map(val => (
                  <Button
                    key={val}
                    variant="outline"
                    size="sm"
                    onClick={() => setDepositAmount(val.toString())}
                  >
                    +{formatCurrency(val)}
                  </Button>
                ))}
              </div>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">VNĐ</span>
                  <Input
                    type="number"
                    placeholder="Nhập số tiền..."
                    className="pl-12"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    onKeyDown={preventInvalidNumberInput}
                    min="0"
                    step="1"
                  />
                </div>
                <Button onClick={handleDeposit} disabled={!depositAmount || Number(depositAmount) <= 0 || isDepositing}>
                  {isDepositing ? 'Đang xử lý...' : 'Nạp ngay'}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-2">
                <ShieldCheck className="w-3.5 h-3.5" /> Giao dịch được mã hóa và bảo mật an toàn.
              </p>
            </CardContent>
          </Card>

          {/* Rút tiền */}
          <Card className="shadow-md border-orange-100">
            <CardHeader className="bg-orange-50/50 pb-4 border-b border-orange-100">
              <CardTitle className="text-orange-700 flex items-center gap-2">
                <Banknote className="w-5 h-5" /> Rút tiền về Ngân hàng
              </CardTitle>
              <CardDescription>Tiền sẽ được admin duyệt và chuyển khoản thủ công</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">VNĐ</span>
                <Input
                  type="number"
                  placeholder="Số tiền cần rút..."
                  className="pl-12 font-bold"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  onKeyDown={preventInvalidNumberInput}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  placeholder="Tên ngân hàng (VD: Vietcombank)"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                />
                <Input
                  placeholder="Số tài khoản"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                />
              </div>
              <Input
                placeholder="Tên chủ tài khoản"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="uppercase"
              />

              <Button
                variant="default"
                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                onClick={handleWithdraw}
                disabled={!withdrawAmount || Number(withdrawAmount) <= 0 || !bankName || !accountNumber || !accountName || isWithdrawing}
              >
                {isWithdrawing ? 'Đang gửi yêu cầu...' : 'Tạo yêu cầu rút tiền'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Lịch sử */}
      <Card className="shadow-md border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" /> Lịch sử giao dịch
          </CardTitle>
        </CardHeader>
        <CardContent>
          {wallet.recentTransactions.length === 0 ? (
            <div className="py-12 text-center flex flex-col items-center text-muted-foreground">
              <Clock className="w-12 h-12 mb-3 opacity-20" />
              <p>Chưa có giao dịch nào phát sinh.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {wallet.recentTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-background rounded-full border shadow-sm">
                      {getTransactionIcon(tx.type)}
                    </div>
                    <div>
                      <p className="font-medium">{getTransactionLabel(tx.type)}</p>
                      {tx.description && (
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-0.5 pr-4">
                          {tx.description}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(tx.createdAt).toLocaleString('vi-VN')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${getTransactionColor(tx.type)}`}>
                      {getTransactionSign(tx.type)}{formatCurrency(tx.amount)}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {tx.status.toLowerCase()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
