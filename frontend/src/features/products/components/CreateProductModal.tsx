'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CreateProductForm } from '@/features/products/components/CreateProductForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { MissingInfoModal } from '@/features/checkout/components/MissingInfoModal';
import React from 'react';

interface CreateProductModalProps {
  children?: React.ReactNode;
}

export function CreateProductModal({ children }: CreateProductModalProps) {
  const [open, setOpen] = useState(false);
  const [isMissingInfoOpen, setIsMissingInfoOpen] = useState(false);
  const { user, isAuthenticated, openLoginModal } = useAuth();

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      if (!isAuthenticated) {
        openLoginModal();
        return;
      }
      if (!user?.phone || !user?.address) {
        setIsMissingInfoOpen(true);
        return;
      }
    }
    setOpen(newOpen);
  };

  const handleSuccessMissingInfo = () => {
    setIsMissingInfoOpen(false);
    setOpen(true);
  };

  return (
    <>
      {children ? (
        React.isValidElement(children) ? (
          React.cloneElement(children as React.ReactElement<any>, {
            onClick: (e: React.MouseEvent) => {
              e.preventDefault();
              handleOpenChange(true);
            }
          })
        ) : (
          <span onClick={() => handleOpenChange(true)}>{children}</span>
        )
      ) : (
        <Button onClick={() => handleOpenChange(true)} className="bg-primary hover:bg-primary/90 text-white rounded-xl shadow-md transition-transform hover:-translate-y-0.5">
          <Plus className="mr-2 h-5 w-5" /> Đăng tin
        </Button>
      )}

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-3xl p-0 flex flex-col gap-0 border-border overflow-hidden max-h-[90vh] glass rounded-[24px]">
          <div className="p-6 pb-4 border-b border-border flex-shrink-0 relative z-10 bg-background/50">
            <DialogHeader>
              <DialogTitle className="text-2xl font-heading font-bold pr-8 text-foreground">Đăng bán sản phẩm</DialogTitle>
              <DialogDescription>
                Điền thông tin chi tiết về sản phẩm bạn muốn bán hoặc đấu giá.
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="flex-1 overflow-hidden flex flex-col min-h-0">
            <CreateProductForm onSuccess={() => setOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>

      <MissingInfoModal
        isOpen={isMissingInfoOpen}
        onOpenChange={setIsMissingInfoOpen}
        onSuccess={handleSuccessMissingInfo}
      />
    </>
  );
}
