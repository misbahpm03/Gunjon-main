import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { ShoppingCart, Check } from 'lucide-react';
import { Button } from './ui/Button';
import { useData } from '../context/DataContext';

export function ProductCard({ product, ...props }: { product: Product } & React.HTMLAttributes<HTMLDivElement>) {
  const { api } = useData();
  const [quantity, setQuantity] = useState(1);
  const [showToast, setShowToast] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    api.addToCart(product, quantity);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="group relative border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col" {...props}>
      {/* Local Toast Notification */}
      {showToast && (
        <div className="absolute z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-900/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg shadow-xl flex items-center gap-2 animate-in fade-in zoom-in-95 duration-200">
          <Check className="h-4 w-4 text-green-400" />
          <span className="text-xs font-medium whitespace-nowrap">Added {quantity} to cart</span>
        </div>
      )}
      <Link to={`/product/${product.id}`} className="block aspect-square bg-[#F5F5F7] overflow-hidden relative p-4 flex items-center justify-center">
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {product.originalPrice && product.originalPrice > product.price && (
            <div className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full w-fit shadow-sm leading-none flex items-center justify-center">
              -{Math.round((1 - product.price / product.originalPrice) * 100)}%
            </div>
          )}
          {product.isNew && (
            <div className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded-full w-fit shadow-sm leading-none flex items-center justify-center tracking-wide">
              NEW
            </div>
          )}
        </div>
        <div className="absolute bottom-3 left-3 z-10">
          {product.stock === 0 ? (
            <div className="bg-white/90 backdrop-blur-sm text-red-600 border border-red-100 text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
              Out of Stock
            </div>
          ) : product.stock < 5 ? (
            <div className="bg-white/90 backdrop-blur-sm text-orange-600 border border-orange-100 text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
              Only {product.stock} left
            </div>
          ) : null}
        </div>
        <img 
          src={product.image} 
          alt={product.name} 
          className={`w-full h-full object-contain mix-blend-multiply group-hover:scale-[1.05] transition-transform duration-500 ease-out ৳{product.stock === 0 ? 'opacity-50 grayscale' : ''}`} 
        />
      </Link>
      <div className="p-3 sm:p-5 flex flex-col flex-grow">
        <div className="text-[10px] sm:text-xs text-gray-400 font-light mb-1.5 flex justify-between tracking-wide">
          <span>{product.brand}</span>
          <span className="truncate ml-2">{product.category}</span>
        </div>
        <Link to={`/product/${product.id}`} className="flex-grow">
          <h3 className="font-bold text-[13px] sm:text-[15px] text-gray-900 line-clamp-2 hover:text-indigo-600 mb-3 leading-snug">{product.name}</h3>
        </Link>
        <div className="mt-auto flex flex-col gap-2.5">
          <div className="flex flex-col sm:flex-row sm:items-end gap-0.5 sm:gap-2 leading-none">
            <span className="text-[16px] sm:text-lg font-bold text-indigo-600">৳{product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="text-[11px] sm:text-sm text-gray-400 line-through font-medium">৳{product.originalPrice.toLocaleString()}</span>
            )}
          </div>
          
          <div className="flex items-center gap-2 justify-between w-full pt-1">
            <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50 overflow-hidden shadow-sm h-8">
              <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setQuantity(q => Math.max(1, q - 1)); }}
                className="px-2.5 h-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors disabled:opacity-30 flex items-center justify-center"
                disabled={quantity <= 1}
              >-</button>
              <span className="text-[11px] font-semibold w-4 text-center">{quantity}</span>
              <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setQuantity(q => Math.min(product.stock, q + 1)); }}
                className="px-2.5 h-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors disabled:opacity-30 flex items-center justify-center"
                disabled={quantity >= product.stock}
              >+</button>
            </div>
            <Button 
              size="sm" 
              variant="default" 
              className="h-8 w-8 !p-0 rounded-full shrink-0 relative z-10 shadow-sm hover:shadow-md"
              disabled={product.stock === 0}
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
