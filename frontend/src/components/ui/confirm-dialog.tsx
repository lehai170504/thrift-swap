'use client';

import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Info } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: React.ReactNode;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  variant?: 'destructive' | 'default';
}

export function ConfirmDialog({
  isOpen,
  onOpenChange,
  title,
  description,
  onConfirm,
  onCancel,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy bỏ',
  isLoading = false,
  variant = 'destructive'
}: ConfirmDialogProps) {
  const handleCancel = () => {
    if (onCancel) onCancel();
    onOpenChange(false);
  };

  const isDestructive = variant === 'destructive';
  const Icon = isDestructive ? AlertTriangle : Info;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md glass border-border p-0 overflow-hidden rounded-[24px]">
        <div className={`${isDestructive ? 'bg-red-950/20 border-red-900/30' : 'bg-primary/10 border-border'} p-6 flex flex-col items-center justify-center text-center border-b`}>
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isDestructive ? 'bg-red-500/20 text-red-500' : 'bg-primary/20 text-primary'}`}>
            <Icon className="w-8 h-8" />
          </div>
          <DialogTitle className={`text-2xl font-heading font-bold mb-2 ${isDestructive ? 'text-red-500' : 'text-primary'}`}>
            {title}
          </DialogTitle>
          <DialogDescription render={<div className="text-muted-foreground" />}>
            {description}
          </DialogDescription>
        </div>
        <div className="p-6 bg-transparent flex items-center justify-end gap-3">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="rounded-xl h-12 px-6 border-border text-muted-foreground hover:bg-accent font-bold"
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant={isDestructive ? 'destructive' : 'default'}
            onClick={onConfirm}
            className="rounded-xl h-12 px-6 font-bold"
            disabled={isLoading}
          >
            {isLoading ? 'Đang xử lý...' : confirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
