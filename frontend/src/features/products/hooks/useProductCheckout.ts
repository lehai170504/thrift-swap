import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAvailableVouchers, Voucher } from '@/features/orders/hooks/useVouchers';
import { useCreateBuyNowOrder } from '@/features/orders/hooks/useOrders';
import { formatCurrency } from '@/lib/utils';
import { Product } from '@/features/products/types/product';


export function useProductCheckout(product: Product | null | undefined, user: any, isSeller: boolean) {
  const router = useRouter();
  const buyNowMutation = useCreateBuyNowOrder();
  const { data: availableVouchers } = useAvailableVouchers(product?.sellerId);

  const [isMissingInfoModalOpen, setIsMissingInfoModalOpen] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const discountAmount = useMemo(() => {
    if (!appliedVoucher || !product) return 0;
    const totalProductPrice = product.price * purchaseQuantity;
    if (totalProductPrice < (appliedVoucher.minOrderValue || 0)) return 0;

    if (appliedVoucher.type === 'FIXED_AMOUNT') {
      return Math.min(appliedVoucher.discountValue, totalProductPrice);
    } else if (appliedVoucher.type === 'PERCENTAGE') {
      let calc = (totalProductPrice * appliedVoucher.discountValue) / 100;
      if (appliedVoucher.maxDiscount && calc > appliedVoucher.maxDiscount) {
        calc = appliedVoucher.maxDiscount;
      }
      return Math.min(calc, totalProductPrice);
    }
    return 0;
  }, [appliedVoucher, product, purchaseQuantity]);

  const finalPrice = product ? (product.price * purchaseQuantity) - discountAmount : 0;

  const handleApplyVoucher = () => {
    if (!voucherCode.trim()) {
      setAppliedVoucher(null);
      return;
    }
    const found = availableVouchers?.find(v => v.code.toUpperCase() === voucherCode.toUpperCase().trim());
    if (!found) {
      toast.error('Mã giảm giá không tồn tại hoặc đã hết hạn.');
      setAppliedVoucher(null);
      return;
    }
    if (product) {
      const totalProductPrice = product.price * purchaseQuantity;
      if (totalProductPrice < (found.minOrderValue || 0)) {
        toast.error(`Đơn hàng tối thiểu để áp dụng mã này là ${formatCurrency(found.minOrderValue || 0)}.`);
        setAppliedVoucher(null);
        return;
      }
    }
    setAppliedVoucher(found);
    toast.success('Áp dụng mã giảm giá thành công!');
  };

  const proceedWithPurchase = () => {
    if (!product) return;
    buyNowMutation.mutate({ productId: product.id, voucherCode, quantity: purchaseQuantity }, {
      onSuccess: () => {
        toast.success('Đã đặt hàng thành công! Vui lòng thanh toán.');
        router.push('/orders');
      },
      onError: (err: any) => {
        toast.error(err.response?.data || 'Có lỗi xảy ra khi mua hàng.');
      }
    });
  };

  const handleBuyNow = () => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để mua hàng!');
      router.push('/login');
      return;
    }

    if (isSeller) {
      toast.error('Bạn không thể mua sản phẩm của chính mình!');
      return;
    }

    if (!user.phone || !user.address) {
      setPendingAction(() => proceedWithPurchase);
      setIsMissingInfoModalOpen(true);
      return;
    }

    proceedWithPurchase();
  };

  const handleMissingInfoSuccess = () => {
    setIsMissingInfoModalOpen(false);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  return {
    isMissingInfoModalOpen,
    setIsMissingInfoModalOpen,
    voucherCode,
    setVoucherCode,
    appliedVoucher,
    setAppliedVoucher,
    purchaseQuantity,
    setPurchaseQuantity,
    availableVouchers,
    discountAmount,
    finalPrice,
    handleApplyVoucher,
    handleBuyNow,
    handleMissingInfoSuccess,
    buyNowMutation,
    setPendingAction
  };
}
