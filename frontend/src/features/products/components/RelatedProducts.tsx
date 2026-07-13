import { useRelatedProducts } from '@/features/products/hooks/useProducts';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Gavel, ArrowRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

export function RelatedProducts({ categoryId, currentProductId }: { categoryId: string, currentProductId: string }) {
  const { data: relatedProducts, isLoading } = useRelatedProducts(currentProductId, categoryId);

  if (isLoading || !relatedProducts || relatedProducts.length === 0) return null;

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-heading font-bold text-foreground mb-8">Sản phẩm cùng danh mục</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {relatedProducts.map((product: any) => {
          const imageUrl = product.imageUrl || `https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400&h=400&seed=${product.id}`;

          return (
            <Link href={`/products/${product.id}`} key={product.id} className="block group h-full">
              <Card className="overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 border-border rounded-[24px] glass h-full cursor-pointer">
                <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                  {product.sellType === 'AUCTION' && (
                    <Badge className="absolute top-3 right-3 bg-primary/95 shadow-sm border-none px-2.5 py-1 text-xs rounded-full">
                      <Gavel className="w-3 h-3 mr-1 inline-block" /> Đấu giá
                    </Badge>
                  )}
                </div>
                <CardContent className="p-5 flex-1 flex flex-col justify-between">
                  <h3 className="font-bold text-lg line-clamp-2 group-hover:text-primary transition-colors mb-4">
                    {product.title}
                  </h3>
                  <div className="flex items-end justify-between mt-auto">
                    <div className="text-xl font-bold text-foreground tracking-tight group-hover:text-primary transition-colors duration-300">
                      {formatCurrency(product.price)}
                    </div>
                    <div className="w-8 h-8 rounded-full bg-primary/5 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
                      <ArrowRight className="w-4 h-4 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
