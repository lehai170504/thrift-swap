'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { EditProductForm } from '@/features/products/components/EditProductForm';
import { Button } from '@/components/ui/button';
import { SquarePen } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Product } from '@/features/products/types/product';

interface EditProductModalProps {
  product: Product;
  iconOnly?: boolean;
}

export function EditProductModal({ product, iconOnly = false }: EditProductModalProps) {
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
      {iconOnly ? (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleOpenChange(true)}
          className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg size-8"
          title="Chỉnh sửa sản phẩm"
        >
          <SquarePen className="w-4 h-4" />
        </Button>
      ) : (
        <Button variant="outline" size="sm" onClick={() => handleOpenChange(true)} className="h-8 px-3 rounded-lg text-xs font-semibold border-border hover:bg-accent text-foreground">
          <SquarePen className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" /> Sửa
        </Button>
      )}
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-3xl p-0 flex flex-col gap-0 border-border overflow-hidden max-h-[90vh] bg-card rounded-2xl shadow-lg">
          <div className="p-6 pb-4 border-b border-border flex-shrink-0 relative z-10 bg-background/50">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold pr-8 text-foreground tracking-tight">Chỉnh sửa thông tin sản phẩm</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
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
