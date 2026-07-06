import React from 'react';
import {
  Laptop, Shirt, Sofa, BookOpen, Coffee,
  Dumbbell, Car, Gem, Baby, Cat, Package, LucideProps
} from 'lucide-react';

const iconMap: Record<string, React.FC<LucideProps>> = {
  Laptop,
  Shirt,
  Sofa,
  BookOpen,
  Coffee,
  Dumbbell,
  Car,
  Gem,
  Baby,
  Cat,
};

export function CategoryIcon({ name, className, ...props }: { name?: string, className?: string } & LucideProps) {
  if (!name) return <Package className={className} {...props} />;
  const Icon = iconMap[name] || Package;
  return <Icon className={className} {...props} />;
}
