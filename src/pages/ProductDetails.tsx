import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { Button } from '../components/ui/Button';
import { ShoppingCart, ArrowLeft, ShieldCheck, Truck, Check } from 'lucide-react';

export function ProductDetails() {
  const { id } = useParams();
  const { products, api } = useData();
  const product = products.find(p => p.id === id);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showToast, setShowToast] = useState(false);

  if (!product) return <div className="p-12 text-center text-gray-500">Product not found</div>;

  const handleAddToCart = () => {
    api.addToCart(product, quantity);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left">
      <Link to="/shop" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-8">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Shop
      </Link>
      
      <div className="grid lg:grid-cols-2 gap-12 mb-16">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-2xl p-8 flex items-center justify-center aspect-square relative">
            {product.isNew && (
              <div className="absolute top-4 left-4 z-10 bg-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
                New Arrival
              </div>
            )}
            <img src={product.images[activeImage] || product.image} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveImage(idx)}
                  className={`bg-gray-50 rounded-lg p-2 aspect-square flex items-center justify-center border-2 transition-colors ৳{activeImage === idx ? 'border-indigo-600' : 'border-transparent hover:border-gray-200'}`}
                >
                  <img src={img} alt={`${product.name} ৳{idx + 1}`} className="w-full h-full object-contain mix-blend-multiply" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-indigo-600 font-semibold">{product.brand} • {product.category}</div>
            <div className="text-sm text-gray-500">SKU: {product.id}</div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
          
          <div className="flex items-end mb-6 space-x-3">
            <div className="text-4xl font-bold text-gray-900">৳{product.price.toLocaleString()}</div>
            {product.originalPrice && (
              <div className="text-xl text-gray-400 line-through mb-1">৳{product.originalPrice.toLocaleString()}</div>
            )}
          </div>

          {product.stock === 0 ? (
            <div className="mb-6 inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-800 text-sm font-medium">
              Out of Stock
            </div>
          ) : product.stock < 5 ? (
            <div className="mb-6 inline-flex items-center px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-sm font-medium">
              Only {product.stock} left in stock - order soon
            </div>
          ) : (
            <div className="mb-6 inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
              In Stock
            </div>
          )}

          <p className="text-gray-600 mb-8 leading-relaxed text-lg">
            {product.description}
          </p>

          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Key Features</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {product.keySpecs.map((spec, idx) => (
                <li key={idx} className="flex items-center text-gray-600">
                  <Check className="h-5 w-5 text-emerald-500 mr-2 shrink-0" />
                  <span>{spec}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex space-x-4 mb-8">
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <button 
                className="px-4 py-3 text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                disabled={quantity <= 1}
              >-</button>
              <span className="px-4 py-3 font-medium min-w-[3rem] text-center border-x border-gray-200">{quantity}</span>
              <button 
                className="px-4 py-3 text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                disabled={quantity >= product.stock}
              >+</button>
            </div>
            <Button 
              size="lg" 
              className="flex-1 h-14 text-lg" 
              disabled={product.stock === 0}
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-2 h-5 w-5" /> 
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4 py-6 border-y border-gray-200">
            <div className="flex items-center text-gray-600">
              <Truck className="h-5 w-5 mr-3 text-indigo-600" />
              <span className="text-sm">Free Shipping & Returns</span>
            </div>
            <div className="flex items-center text-gray-600">
              <ShieldCheck className="h-5 w-5 mr-3 text-indigo-600" />
              <span className="text-sm">{product.warranty}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Full Specs Table */}
      <div className="max-w-3xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Technical Specifications</h2>
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <tbody className="divide-y divide-gray-200">
              {Object.entries(product.fullSpecs).map(([key, value]) => (
                <tr key={key} className="hover:bg-gray-50">
                  <th className="py-4 px-6 font-medium text-gray-900 bg-gray-50/50 w-1/3">{key}</th>
                  <td className="py-4 px-6 text-gray-600">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="bg-white/20 p-1 rounded-full">
            <Check className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-sm">Added to Cart</p>
            <p className="text-green-100 text-xs">{quantity}x {product.name}</p>
          </div>
        </div>
      )}
    </div>
  );
}
