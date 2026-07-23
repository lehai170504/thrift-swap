'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Gavel } from 'lucide-react';
import { Product } from '@/features/products/types/product';

interface ProductGalleryProps {
  product: Product;
}

export function ProductGallery({ product }: ProductGalleryProps) {
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierState, setMagnifierState] = useState({ x: 0, y: 0, mouseX: 0, mouseY: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const elem = e.currentTarget;
    const { left, top, width, height } = elem.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMagnifierState({
      x,
      y,
      mouseX: e.clientX - left,
      mouseY: e.clientY - top
    });
  };

  const imageUrl = product.imageUrl || `https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800&h=800&seed=${product.id}`;

  return (
    <div className="lg:col-span-5 flex flex-col gap-4">
      <div
        className="relative aspect-square rounded-xl overflow-hidden bg-muted border border-border cursor-crosshair group"
        onMouseEnter={() => setShowMagnifier(true)}
        onMouseLeave={() => setShowMagnifier(false)}
        onMouseMove={handleMouseMove}
      >
        <img
          src={imageUrl}
          alt={product.title}
          className="w-full h-full object-cover"
        />

        {/* Magnifier Glass */}
        {showMagnifier && (
          <div
            className="absolute pointer-events-none border-2 border-primary/50 shadow-lg z-50 bg-white dark:bg-black/50"
            style={{
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              left: `${magnifierState.mouseX - 100}px`,
              top: `${magnifierState.mouseY - 100}px`,
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: '250%',
              backgroundPosition: `${magnifierState.x}% ${magnifierState.y}%`,
              backgroundRepeat: 'no-repeat',
              boxShadow: 'inset 0 0 10px rgba(0,0,0,0.2), 0 4px 10px rgba(0,0,0,0.3)'
            }}
          />
        )}

        {product.sellType === 'AUCTION' && (
          <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground shadow-sm px-3 py-1 text-xs rounded-md">
            <Gavel className="w-4 h-4 mr-1.5" /> Đấu giá
          </Badge>
        )}
      </div>

      {product.videoUrl && (
        <div className="relative aspect-video rounded-xl overflow-hidden bg-black shadow-sm border border-border mt-2">
          <video
            src={product.videoUrl}
            controls
            className="w-full h-full object-contain"
          />
        </div>
      )}
    </div>
  );
}
