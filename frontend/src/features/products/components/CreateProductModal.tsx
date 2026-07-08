'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CreateProductForm } from '@/features/products/components/CreateProductForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export function CreateProductModal() {
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
      <Button onClick={() => handleOpenChange(true)} className="bg-primary hover:bg-primary/90 text-white rounded-xl shadow-md transition-transform hover:-translate-y-0.5">
        <Plus className="mr-2 h-5 w-5" /> Đăng tin
      </Button>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-3xl p-0 flex flex-col gap-0 border-none overflow-hidden max-h-[90vh] bg-white">
          <div className="p-6 pb-4 border-b border-neutral-100 flex-shrink-0 relative z-10 bg-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold pr-8">Đăng bán sản phẩm</DialogTitle>
              <DialogDescription>
                Điền thông tin chi tiết về sản phẩm bạn muốn bán hoặc đấu giá.
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="p-6 pt-6 overflow-y-auto flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <CreateProductForm onSuccess={() => setOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
