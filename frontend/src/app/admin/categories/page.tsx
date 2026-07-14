'use client';

import { useState } from 'react';
import { Tags, Plus, Trash2, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useAdminCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '@/features/admin/hooks/useAdminCategories';
import { CategoryIcon } from '@/components/ui/category-icon';

export default function AdminCategoriesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: categories = [], isLoading } = useAdminCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const handleCreate = (data: any) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        toast.success('Thêm danh mục thành công!');
        setCreateModalOpen(false);
        resetForm();
      },
      onError: () => toast.error('Lỗi khi thêm danh mục.')
    });
  };

  const handleUpdate = (id: string, data: any) => {
    updateMutation.mutate({ id, data }, {
      onSuccess: () => {
        toast.success('Cập nhật danh mục thành công!');
        setEditModalOpen(false);
        resetForm();
      },
      onError: () => toast.error('Lỗi khi cập nhật danh mục.')
    });
  };

  const handleDelete = () => {
    if (!selectedId) return;
    deleteMutation.mutate(selectedId, {
      onSuccess: () => {
        toast.success('Xóa danh mục thành công!');
        setDeleteModalOpen(false);
      },
      onError: () => toast.error('Lỗi khi xóa. Đảm bảo danh mục không chứa sản phẩm.')
    });
  };

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', icon: '' });

  const resetForm = () => setFormData({ name: '', description: '', icon: '' });

  const handleOpenEdit = (cat: any) => {
    setSelectedId(cat.id);
    setFormData({ name: cat.name, description: cat.description || '', icon: cat.icon || '' });
    setEditModalOpen(true);
  };

  const handleOpenDelete = (id: string) => {
    setSelectedId(id);
    setDeleteModalOpen(true);
  };

  const filteredCategories = categories.filter((c: any) => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-fuchsia-500/10 rounded-[24px] glass border border-fuchsia-500/20">
            <Tags className="w-7 h-7 text-fuchsia-400" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground">Quản lý Danh Mục</h1>
            <p className="text-muted-foreground text-sm">Tạo và cấu hình các danh mục sản phẩm</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Input
            placeholder="Tìm danh mục..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64 rounded-[24px] bg-background/50 border-border glass"
          />
          <Button onClick={() => { resetForm(); setCreateModalOpen(true); }} className="rounded-[24px] shrink-0">
            <Plus className="w-4 h-4 mr-2" />
            Thêm mới
          </Button>
        </div>
      </div>

      <div className="bg-background/50 rounded-[24px] border border-border shadow-lg glass backdrop-blur-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left min-w-[600px]">
            <thead className="bg-muted text-muted-foreground border-b border-border uppercase text-xs font-bold tracking-wider">
              <tr>
                <th className="px-5 py-4 w-16 text-center">Icon</th>
                <th className="px-5 py-4">Tên danh mục</th>
                <th className="px-5 py-4">Mô tả</th>
                <th className="px-5 py-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {isLoading ? (
                <tr><td colSpan={4} className="text-center py-8 text-muted-foreground">Đang tải...</td></tr>
              ) : filteredCategories.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-8 text-muted-foreground">Chưa có danh mục nào</td></tr>
              ) : (
                filteredCategories.map((cat: any) => (
                  <tr key={cat.id} className="hover:bg-accent transition-colors">
                    <td className="px-5 py-4 text-center">
                      <CategoryIcon name={cat.icon} className="w-5 h-5 mx-auto text-muted-foreground" />
                    </td>
                    <td className="px-5 py-4 font-bold text-foreground">{cat.name}</td>
                    <td className="px-5 py-4 text-muted-foreground">{cat.description || 'Không có mô tả'}</td>
                    <td className="px-5 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleOpenEdit(cat)} className="h-8 w-8 p-0 rounded-full border-blue-500/20 text-blue-400 hover:bg-blue-500/10">
                          <Settings2 className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleOpenDelete(cat.id)} className="h-8 w-8 p-0 rounded-full border-red-500/20 text-red-400 hover:bg-red-500/10">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE MODAL */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="sm:max-w-[425px] glass border-border bg-background/90 backdrop-blur-2xl">
          <DialogHeader>
            <DialogTitle>Thêm Danh Mục Mới</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tên danh mục *</label>
              <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="bg-muted border-border" placeholder="VD: Điện thoại" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tên Icon (Lucide)</label>
              <Input value={formData.icon} onChange={e => setFormData({ ...formData, icon: e.target.value })} className="bg-muted border-border" placeholder="VD: Laptop, Shirt, Sofa..." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Mô tả</label>
              <Input value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="bg-muted border-border" placeholder="Mô tả ngắn..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateModalOpen(false)}>Hủy</Button>
            <Button disabled={!formData.name || createMutation.isPending} onClick={() => handleCreate(formData)}>Lưu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* EDIT MODAL */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-[425px] glass border-border bg-background/90 backdrop-blur-2xl">
          <DialogHeader>
            <DialogTitle>Cập Nhật Danh Mục</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tên danh mục *</label>
              <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="bg-muted border-border" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tên Icon (Lucide)</label>
              <Input value={formData.icon} onChange={e => setFormData({ ...formData, icon: e.target.value })} className="bg-muted border-border" placeholder="VD: Laptop, Shirt, Sofa..." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Mô tả</label>
              <Input value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="bg-muted border-border" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>Hủy</Button>
            <Button disabled={!formData.name || updateMutation.isPending} onClick={() => handleUpdate(selectedId!, formData)}>Cập nhật</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE MODAL */}
      <ConfirmDialog
        isOpen={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Xóa danh mục"
        description="Bạn có chắc chắn muốn xóa danh mục này? Hành động này không thể hoàn tác và có thể gây lỗi nếu có sản phẩm đang sử dụng danh mục này."
        onConfirm={handleDelete}
        confirmText="Xóa"
        cancelText="Hủy"
        variant="destructive"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
