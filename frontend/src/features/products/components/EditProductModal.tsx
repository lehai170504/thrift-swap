'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { EditProductForm } from '@/features/products/components/EditProductForm';
import { Button } from '@/components/ui/button';
import { Edit2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Product } from '@/features/products/types/product';

interface EditProductModalProps {
  product: Product;
}

export function EditProductModal({ product }: EditProductModalProps) {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, openLoginModal } = useAuth();

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen && !isAuthenticated) {
      openLoginModal();
      return;
    }
    setOpen(newOpen);
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => handleOpenChange(true)} className="text-primary hover:text-primary hover:bg-primary/10">
        <Edit2 className="w-4 h-4 mr-1.5" /> Sửa
      </Button>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-3xl p-0 flex flex-col gap-0 border-white/10 overflow-hidden max-h-[90vh] glass rounded-[24px]">
          <div className="p-6 pb-4 border-b border-white/10 flex-shrink-0 relative z-10 bg-background/50">
            <DialogHeader>
              <DialogTitle className="text-2xl font-heading font-bold pr-8 text-foreground">Chỉnh sửa thông tin sản phẩm</DialogTitle>
              <DialogDescription>
                Cập nhật thông tin chi tiết về sản phẩm bạn đang bán.
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="p-6 pt-6 overflow-y-auto flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <EditProductForm initialData={product} onSuccess={() => setOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
