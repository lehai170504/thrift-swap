/* eslint-disable react-hooks/incompatible-library */
'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { ShoppingBag, Gavel, Upload, X, Image as ImageIcon, Sparkles } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useCategories, useUpdateProduct } from '../hooks/useProducts';
import { useGenerateDescription, useSuggestPrice } from '@/features/ai/api/aiApi';
import { useUploadImage, useUploadVideo } from '@/features/media/hooks/useMedia';
import { useState } from 'react';
import { CreateProductRequest, Product } from '@/features/products/types/product';
import { createProductSchema, CreateProductFormData } from '../schemas';
import { LocationSelector } from '@/components/ui/LocationSelector';

interface EditProductFormProps {
  initialData: Product;
  onSuccess?: () => void;
}

export const EditProductForm = ({ initialData, onSuccess }: EditProductFormProps) => {

  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm<CreateProductFormData>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      title: initialData.title || '',
      description: initialData.description || '',
      price: initialData.price as unknown as number,
      categoryId: initialData.categoryId || '',
      condition: initialData.condition || 'GOOD',
      sellType: initialData.sellType || 'BUY_NOW',
      quantity: initialData.quantity || 1,
      auctionDurationDays: 3,
      imageUrl: initialData.imageUrl || '',
      location: initialData.location || ''
    }
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData.imageUrl || null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(initialData.videoUrl || null);
  const [suggestedPriceText, setSuggestedPriceText] = useState<string | null>(null);

  const uploadImageMutation = useUploadImage();
  const uploadVideoMutation = useUploadVideo();

  const generateDescMutation = useGenerateDescription();
  const suggestPriceMutation = useSuggestPrice();

  const sellType = watch('sellType');
  const priceWatch = watch('price');

  const { data: categories, isLoading: isLoadingCategories } = useCategories();
  const mutation = useUpdateProduct();

  const handleGenerateDescription = () => {
    const title = watch('title');
    const condition = watch('condition');
    if (!title) {
      toast.error('Vui lòng nhập Tên sản phẩm trước');
      return;
    }
    generateDescMutation.mutate({ productName: title, condition }, {
      onSuccess: (data) => {
        setValue('description', data, { shouldValidate: true });
        toast.success('Đã tạo mô tả bằng AI');
      },
      onError: () => toast.error('Không thể tạo mô tả lúc này')
    });
  };

  const handleSuggestPrice = () => {
    const title = watch('title');
    const condition = watch('condition');
    if (!title) {
      toast.error('Vui lòng nhập Tên sản phẩm trước');
      return;
    }
    suggestPriceMutation.mutate({ productName: title, condition }, {
      onSuccess: (data) => setSuggestedPriceText(data),
      onError: () => toast.error('Không thể gợi ý giá lúc này')
    });
  };

  const onSubmit = async (data: CreateProductRequest) => {
    try {
      if (imageFile) {
        const url = await uploadImageMutation.mutateAsync(imageFile);
        data.imageUrl = url;
      }
      if (videoFile) {
        const url = await uploadVideoMutation.mutateAsync(videoFile);
        data.videoUrl = url;
      }

      mutation.mutate({ id: initialData.id, data }, {
        onSuccess: () => {
          if (onSuccess) onSuccess();
        }
      });
    } catch (error) {
      toast.error('Lỗi khi tải ảnh/video lên');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Ảnh phải nhỏ hơn 5MB');
        return;
      }
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Basic Info */}
      <div className="space-y-6">
        <h3 className="text-lg font-heading font-bold border-b border-white/10 pb-2 text-foreground">Thông tin cơ bản</h3>

        <div className="space-y-2">
          <Label htmlFor="title">Tên sản phẩm <span className="text-red-500">*</span></Label>
          <Input
            id="title"
            placeholder="VD: Áo khoác da thật 100%..."
            {...register('title')}
            className={`h-12 focus-visible:ring-primary ${errors.title ? 'border-red-500' : ''}`}
          />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Danh mục <span className="text-red-500">*</span></Label>
            <Controller
              name="categoryId"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="h-12 focus:ring-primary">
                    <span className="flex flex-1 text-left">
                      {field.value
                        ? categories?.find((c) => c.id === field.value)?.name
                        : (isLoadingCategories ? "Đang tải..." : "Chọn danh mục")}
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Tình trạng <span className="text-red-500">*</span></Label>
            <Controller
              name="condition"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="h-12 focus:ring-primary">
                    <span className="flex flex-1 text-left">
                      {field.value === 'NEW' && 'Mới 100% (New)'}
                      {field.value === 'LIKE_NEW' && 'Như mới (Like New)'}
                      {field.value === 'GOOD' && 'Tốt (Good)'}
                      {field.value === 'FAIR' && 'Khá (Fair)'}
                      {!field.value && 'Chọn tình trạng'}
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NEW">Mới 100% (New)</SelectItem>
                    <SelectItem value="LIKE_NEW">Như mới (Like New)</SelectItem>
                    <SelectItem value="GOOD">Tốt (Good)</SelectItem>
                    <SelectItem value="FAIR">Khá (Fair)</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.condition && <p className="text-red-500 text-xs mt-1">{errors.condition.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <Label htmlFor="description">Mô tả chi tiết <span className="text-red-500">*</span></Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-primary border-primary/50 hover:bg-primary/10 gap-2 h-8 w-fit"
              onClick={handleGenerateDescription}
              disabled={generateDescMutation.isPending}
            >
              <Sparkles className="w-4 h-4" />
              {generateDescMutation.isPending ? 'Đang viết...' : 'Viết bằng AI'}
            </Button>
          </div>
          <Textarea
            id="description"
            placeholder="Mô tả về tình trạng, xuất xứ, màu sắc..."
            {...register('description')}
            className={`min-h-[120px] focus-visible:ring-primary resize-y ${errors.description ? 'border-red-500' : ''}`}
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Khu vực <span className="text-red-500">*</span></Label>
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <LocationSelector value={field.value} onChange={field.onChange} mode="full" />
            )}
          />
          {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <Label>Hình ảnh sản phẩm <span className="text-red-500">*</span></Label>
          <div className="flex items-center gap-4">
            {imagePreview ? (
              <div className="relative w-32 h-32 rounded-[24px] overflow-hidden border border-white/10">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                  }}
                  className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="w-32 h-32 border-2 border-dashed border-white/20 hover:border-primary hover:bg-primary/5 rounded-[24px] flex flex-col items-center justify-center cursor-pointer transition-colors bg-background/50">
                <Upload className="w-6 h-6 text-muted-foreground mb-2" />
                <span className="text-xs text-muted-foreground font-medium">Tải ảnh lên</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            )}
            <div className="text-xs text-muted-foreground">
              <p>• Hỗ trợ JPG, PNG, WEBP</p>
              <p>• Kích thước tối đa 5MB</p>
              <p>• Hình ảnh chân thực giúp bán nhanh hơn</p>
            </div>
          </div>
        </div>

        {/* Video Upload */}
        <div className="space-y-2 mt-4">
          <Label>Video sản phẩm (Tùy chọn)</Label>
          <div className="flex items-center gap-4">
            {videoPreview ? (
              <div className="relative w-32 h-32 rounded-[24px] overflow-hidden border border-white/10 bg-black">
                <video src={videoPreview} className="w-full h-full object-contain" controls />
                <button
                  type="button"
                  onClick={() => {
                    setVideoFile(null);
                    setVideoPreview(null);
                    setValue('videoUrl', '');
                  }}
                  className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-red-500 transition-colors z-10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="w-32 h-32 border-2 border-dashed border-white/20 hover:border-primary hover:bg-primary/5 rounded-[24px] flex flex-col items-center justify-center cursor-pointer transition-colors bg-background/50">
                <Upload className="w-6 h-6 text-muted-foreground mb-2" />
                <span className="text-xs text-muted-foreground font-medium">Tải video lên</span>
                <input
                  type="file"
                  accept="video/mp4,video/webm"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      if (file.size > 30 * 1024 * 1024) {
                        toast.error('Video phải nhỏ hơn 30MB');
                        return;
                      }
                      setVideoFile(file);
                      setVideoPreview(URL.createObjectURL(file));
                    }
                  }}
                />
              </label>
            )}
            <div className="text-xs text-muted-foreground">
              <p>• Hỗ trợ MP4, WEBM</p>
              <p>• Kích thước tối đa 30MB</p>
              <p>• Giúp người mua tin tưởng hơn</p>
            </div>
          </div>
        </div>
      </div>

      {/* Selling Format */}
      <div className="space-y-6 pt-4">
        <h3 className="text-lg font-heading font-bold border-b border-white/10 pb-2 text-foreground">Hình thức bán</h3>

        <div className="grid grid-cols-2 gap-4">
          <div
            className={`border-2 rounded-[24px] p-4 transition-all flex flex-col items-center justify-center gap-2 text-center ${sellType === 'BUY_NOW' ? 'border-primary bg-primary/10' : 'border-white/10 bg-background/50'} pointer-events-none opacity-80`}
          >
            <ShoppingBag className={`h-8 w-8 ${sellType === 'BUY_NOW' ? 'text-primary' : 'text-muted-foreground'}`} />
            <div className="font-bold text-foreground">Mua Ngay</div>
            <div className="text-xs text-muted-foreground">Giá cố định</div>
          </div>

          <div
            className={`border-2 rounded-[24px] p-4 transition-all flex flex-col items-center justify-center gap-2 text-center ${sellType === 'AUCTION' ? 'border-primary bg-primary/10' : 'border-white/10 bg-background/50'} pointer-events-none opacity-80`}
          >
            <Gavel className={`h-8 w-8 ${sellType === 'AUCTION' ? 'text-primary' : 'text-muted-foreground'}`} />
            <div className="font-bold text-foreground">Đấu Giá</div>
            <div className="text-xs text-muted-foreground">Người trả cao nhất mua</div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground italic mt-2">Không thể thay đổi hình thức bán sau khi đã đăng sản phẩm.</p>

        <div className="space-y-2 mt-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="price">
              {sellType === 'BUY_NOW' ? 'Giá bán (VNĐ)' : 'Giá khởi điểm (VNĐ)'} <span className="text-red-500">*</span>
            </Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-primary border-primary/50 hover:bg-primary/10 gap-2 h-8 w-fit"
              onClick={handleSuggestPrice}
              disabled={suggestPriceMutation.isPending}
            >
              <Sparkles className="w-4 h-4" />
              {suggestPriceMutation.isPending ? 'Đang phân tích...' : 'AI Gợi ý giá'}
            </Button>
          </div>
          <div className="relative">
            <Input
              id="price"
              type="number"
              placeholder="VD: 500000"
              {...register('price', { valueAsNumber: true })}
              className={`h-12 pl-4 pr-16 focus-visible:ring-primary text-lg font-medium ${errors.price ? 'border-red-500' : ''}`}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
              VNĐ
            </div>
          </div>
          {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
          {Number(priceWatch) > 0 && (
            <p className="text-sm text-primary font-medium mt-2 flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary"></span>
              Đang hiển thị: {formatCurrency(priceWatch)}
            </p>
          )}
          {suggestedPriceText && (
            <div className="mt-3 p-4 bg-primary/10 border border-primary/20 rounded-xl text-sm text-foreground leading-relaxed glass">
              <span className="font-bold text-primary flex items-center gap-2 mb-1"><Sparkles className="w-4 h-4" /> Gợi ý từ AI:</span>
              {suggestedPriceText}
            </div>
          )}
        </div>

        {sellType === 'BUY_NOW' && (
          <div className="space-y-2 mt-6">
            <Label htmlFor="quantity">Số lượng <span className="text-red-500">*</span></Label>
            <Input
              id="quantity"
              type="number"
              placeholder="VD: 1"
              min="1"
              {...register('quantity', { valueAsNumber: true })}
              className={`h-12 focus-visible:ring-primary ${errors.quantity ? 'border-red-500' : ''}`}
            />
            {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity.message}</p>}
          </div>
        )}

        {sellType === 'AUCTION' && (
          <div className="space-y-2 mt-6">
            <Label>Thời gian đấu giá <span className="text-red-500">*</span></Label>
            <Controller
              name="auctionDurationDays"
              control={control}
              render={({ field }) => (
                <Select onValueChange={(val) => field.onChange(Number(val))} value={String(field.value || 3)}>
                  <SelectTrigger className="h-12 focus:ring-primary">
                    <span className="flex flex-1 text-left">
                      {field.value === 1 && '1 ngày'}
                      {field.value === 3 && '3 ngày'}
                      {field.value === 5 && '5 ngày'}
                      {field.value === 7 && '7 ngày'}
                      {!field.value && 'Chọn thời gian'}
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 ngày (Kết thúc nhanh)</SelectItem>
                    <SelectItem value="3">3 ngày (Tiêu chuẩn)</SelectItem>
                    <SelectItem value="5">5 ngày</SelectItem>
                    <SelectItem value="7">7 ngày (Dài hạn)</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        )}
      </div>

      <Button
        type="submit"
        className="w-full h-14 text-lg bg-primary hover:bg-primary/90 mt-8"
        disabled={mutation.isPending || uploadImageMutation.isPending || uploadVideoMutation.isPending}
      >
        {(uploadImageMutation.isPending || uploadVideoMutation.isPending) ? 'Đang tải media...' : mutation.isPending ? 'Đang xử lý...' : 'Cập nhật sản phẩm'}
      </Button>
    </form>
  );
};
