import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { ArrowRight, Gavel, Sparkles } from 'lucide-react';

/* eslint-disable @typescript-eslint/no-explicit-any */
export function ProductCard({ product }: { product: any }) {
  const imageUrl = product.imageUrl || `https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600&h=600&seed=${product.id}`;
  const isBoosted = product.boostedUntil && new Date(product.boostedUntil) > new Date();

  return (
    <Link href={`/products/${product.id}`} className="block group h-full">
      <Card className="overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 border-neutral-200/60 rounded-2xl bg-white h-full cursor-pointer">
        <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden">
          <img
            src={imageUrl}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&w=600&h=600&q=80';
            }}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
          {isBoosted && (
            <Badge className="absolute top-4 left-4 bg-amber-500 hover:bg-amber-600 text-white shadow-sm border-none gap-1.5 px-3 py-1.5 text-sm font-bold rounded-full z-10">
              <Sparkles className="w-4 h-4" /> Nổi bật
            </Badge>
          )}
          {product.sellType === 'AUCTION' && (
            <Badge className="absolute top-4 right-4 bg-primary/95 hover:bg-primary/90 shadow-sm border-none gap-1.5 px-3 py-1.5 text-sm backdrop-blur-md rounded-full z-10">
              <Gavel className="w-4 h-4" /> Đấu giá
            </Badge>
          )}
        </div>
        <CardHeader className="p-5 pb-2">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full w-fit">
              {product.categoryName || 'Đồ cũ'}
            </div>
            <div className="flex gap-2 items-center">
              {product.sellType === 'BUY_NOW' && (
                <div className="text-xs text-orange-600 bg-orange-100 font-medium px-2 py-0.5 rounded">
                  Kho: {product.quantity || 1}
                </div>
              )}
              <div className="text-xs text-neutral-500 font-medium">
                {product.condition === 'NEW' ? 'Mới 100%' : product.condition === 'LIKE_NEW' ? 'Như mới' : 'Đã sử dụng'}
              </div>
            </div>
          </div>
          <h3 className="font-bold text-xl line-clamp-1 group-hover:text-primary transition-colors mt-1">
            {product.title}
          </h3>
        </CardHeader>
        <CardContent className="p-5 pt-0 flex-1 flex flex-col justify-between">
          <div>
            <p className="text-sm text-neutral-500 line-clamp-2 leading-relaxed">{product.description}</p>
          </div>
          <div className="mt-5 flex items-end justify-between">
            <div>
              <div className="text-xs text-neutral-400 font-medium mb-1">
                {product.sellType === 'BUY_NOW' ? 'Giá bán' : 'Khởi điểm'}
              </div>
              <span className="text-2xl font-extrabold text-neutral-900 tracking-tight group-hover:text-primary transition-colors duration-300">
                {formatCurrency(product.price)}
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/5 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
              <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
