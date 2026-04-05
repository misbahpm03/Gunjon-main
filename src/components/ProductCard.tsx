import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { ShoppingCart } from 'lucide-react';
import { Button } from './ui/Button';
import { useData } from '../context/DataContext';

export function ProductCard({ product, ...props }: { product: Product } & React.HTMLAttributes<HTMLDivElement>) {
  const { api } = useData();

  return (
    <div className="group relative border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-lg transition-all flex flex-col" {...props}>
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {product.isNew && (
          <div className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide w-fit">
            New
          </div>
        )}
        {product.stock === 0 ? (
          <div className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide w-fit">
            Out of Stock
          </div>
        ) : product.stock < 5 ? (
          <div className="bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide w-fit">
            Only {product.stock} left
          </div>
        ) : null}
      </div>
      <Link to={`/product/${product.id}`} className="block aspect-square bg-gray-50 overflow-hidden relative p-6 flex items-center justify-center">
        <img 
          src={product.image} 
          alt={product.name} 
          className={`w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300 ${product.stock === 0 ? 'opacity-50 grayscale' : ''}`} 
        />
      </Link>
      <div className="p-4 flex flex-col flex-grow">
        <div className="text-xs text-gray-500 mb-1 flex justify-between">
          <span>{product.brand}</span>
          <span>{product.category}</span>
        </div>
        <Link to={`/product/${product.id}`} className="flex-grow">
          <h3 className="font-medium text-gray-900 line-clamp-2 hover:text-indigo-600 mb-2">{product.name}</h3>
        </Link>
        <div className="mt-auto flex items-end justify-between">
          <div>
            <span className="text-lg font-bold text-gray-900">${product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through ml-2">${product.originalPrice.toLocaleString()}</span>
            )}
          </div>
          <Button 
            size="sm" 
            variant="outline" 
            className="h-8 w-8 p-0 rounded-full shrink-0"
            disabled={product.stock === 0}
            onClick={(e) => {
              e.preventDefault();
              api.addToCart(product, 1);
            }}
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
