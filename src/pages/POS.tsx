import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useData } from '../context/DataContext';
import { Product, Order } from '../types';
import { Search, ShoppingCart, Trash2, Plus, Minus, CreditCard, Banknote, User, Phone, Tag, Barcode, CheckCircle2, Printer } from 'lucide-react';
import { InvoiceModal } from '../components/InvoiceModal';

interface CartItem extends Product {
  quantity: number;
}

export function POS() {
  const { products, api } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Checkout State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [discountInput, setDiscountInput] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Online'>('Cash');
  const [isSuccess, setIsSuccess] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  // Filter products based on search term
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product: Product) => {
    if (product.stock <= 0) return; // Prevent adding out of stock items
    
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        // Check if we have enough stock
        if (existing.quantity >= product.stock) return prev;
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const product = products.find(p => p.id === id);
        const maxStock = product ? product.stock : item.quantity;
        const newQuantity = Math.max(1, Math.min(item.quantity + delta, maxStock));
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;
    
    // Mock barcode logic: just find a product that includes the barcode string in its ID or name
    const matchedProduct = products.find(p => 
      p.id.toLowerCase().includes(barcodeInput.toLowerCase()) || 
      p.name.toLowerCase().includes(barcodeInput.toLowerCase())
    );

    if (matchedProduct && matchedProduct.stock > 0) {
      addToCart(matchedProduct);
    }
    setBarcodeInput('');
  };

  const handleCompleteSale = async () => {
    if (cart.length === 0) return;

    try {
      // Create order
      const newOrder = await api.addOrder({
        customerName: customerName || 'Walk-in Customer',
        customerPhone: customerPhone || undefined,
        items: cart.length,
        itemsList: cart.map(item => ({
          id: `OI-৳{Date.now()}-৳{item.id}`,
          productId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        total: Math.max(0, cart.reduce((sum, item) => sum + item.price * item.quantity, 0) - (parseFloat(discountInput) || 0)),
        status: 'Delivered', // POS sales are usually delivered immediately
        paymentMethod: paymentMethod === 'Cash' ? 'Cash' : 'Online'
      });

      // Show success state
      setCompletedOrder(newOrder);
      setIsSuccess(true);
      
    } catch (error) {
      console.error('Failed to complete sale', error);
    }
  };

  const resetPOS = () => {
    setCart([]);
    setCustomerName('');
    setCustomerPhone('');
    setDiscountInput('');
    setPaymentMethod('Cash');
    setIsSuccess(false);
    setCompletedOrder(null);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = parseFloat(discountInput) || 0;
  const total = Math.max(0, subtotal - discountAmount);

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-6">
      {/* Products Section */}
      <div className="flex-1 flex flex-col space-y-4 overflow-hidden">
        <div className="flex items-center justify-between shrink-0">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Point of Sale</h1>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input 
              className="pl-10 h-12 text-lg bg-white shadow-sm" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <form onSubmit={handleBarcodeSubmit} className="relative w-full sm:w-64">
            <Barcode className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input 
              className="pl-10 h-12 text-lg bg-white shadow-sm" 
              placeholder="Scan Barcode..." 
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
            />
            <button type="submit" className="hidden">Submit</button>
          </form>
        </div>

        <div className="flex-1 overflow-y-auto pb-4 pr-2 custom-scrollbar">
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map(product => (
              <Card 
                key={product.id} 
                className={`cursor-pointer transition-colors overflow-hidden flex flex-col ৳{product.stock <= 0 ? 'opacity-50 cursor-not-allowed' : 'hover:border-indigo-500 hover:shadow-md'}`}
                onClick={() => addToCart(product)}
              >
                <div className="h-32 bg-gray-100 relative">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover mix-blend-multiply p-4" />
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-gray-900 shadow-sm">
                    ৳{product.price}
                  </div>
                  {product.stock <= 0 && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                      <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded">Out of Stock</span>
                    </div>
                  )}
                </div>
                <div className="p-3 flex-1 flex flex-col justify-between bg-white">
                  <h3 className="text-sm font-medium line-clamp-2 text-gray-900 leading-snug">{product.name}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <p className={`text-xs font-medium ৳{product.stock >= 5 ? 'text-green-600' : product.stock > 0 ? 'text-amber-600' : 'text-red-600'}`}>
                      {product.stock} in stock
                    </p>
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0 rounded-full bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600" disabled={product.stock <= 0}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
            {filteredProducts.length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-500">
                No products found matching your search.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cart & Checkout Section */}
      <Card className="w-full lg:w-[400px] flex flex-col h-full shrink-0 shadow-lg border-gray-200 overflow-hidden relative">
        {isSuccess && (
          <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-200 p-6 text-center">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Sale Completed!</h2>
            <p className="text-gray-500 mb-6">Receipt generated successfully.</p>
            <div className="flex gap-4">
              <Button onClick={() => setIsInvoiceModalOpen(true)} variant="outline" className="border-indigo-600 text-indigo-600 hover:bg-indigo-50">
                <Printer className="mr-2 h-4 w-4" /> Print Invoice
              </Button>
              <Button onClick={resetPOS}>
                New Sale
              </Button>
            </div>
          </div>
        )}

        <CardHeader className="border-b border-gray-100 bg-gray-50/80 py-3 shrink-0">
          <CardTitle className="flex items-center justify-between text-base">
            <span className="flex items-center"><ShoppingCart className="mr-2 h-5 w-5 text-indigo-600" /> Current Order</span>
            <span className="bg-indigo-100 text-indigo-700 text-xs px-2.5 py-1 rounded-full font-medium">{cart.length} items</span>
          </CardTitle>
        </CardHeader>
        
        {/* Cart Items */}
        <CardContent className="flex-1 overflow-y-auto p-0 custom-scrollbar">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 p-6 text-center">
              <ShoppingCart className="h-12 w-12 mb-4 opacity-20" />
              <p className="font-medium text-gray-500">Your cart is empty</p>
              <p className="text-sm mt-1">Scan a barcode or select products to add them to the order.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {cart.map(item => (
                <li key={item.id} className="p-3 flex items-center justify-between hover:bg-gray-50/50 transition-colors group">
                  <div className="flex-1 min-w-0 pr-3">
                    <h4 className="text-sm font-medium text-gray-900 truncate" title={item.name}>{item.name}</h4>
                    <div className="text-sm text-indigo-600 font-semibold">৳{item.price.toLocaleString()}</div>
                  </div>
                  <div className="flex items-center space-x-2 shrink-0">
                    <div className="flex items-center border border-gray-200 rounded-md bg-white shadow-sm">
                      <button onClick={() => updateQuantity(item.id, -1)} className="p-1.5 hover:bg-gray-100 text-gray-600 rounded-l-md transition-colors"><Minus className="h-3.5 w-3.5" /></button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="p-1.5 hover:bg-gray-100 text-gray-600 rounded-r-md transition-colors"><Plus className="h-3.5 w-3.5" /></button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>

        {/* Checkout Panel */}
        <div className="border-t border-gray-200 bg-gray-50/80 shrink-0">
          {/* Customer Info */}
          <div className="p-3 border-b border-gray-200 space-y-2">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <User className="absolute left-2.5 top-2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Customer Name (Optional)" 
                  className="pl-8 h-8 text-sm bg-white"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>
              <div className="relative flex-1">
                <Phone className="absolute left-2.5 top-2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Phone Number" 
                  className="pl-8 h-8 text-sm bg-white"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Summary & Payment */}
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900">৳{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span className="flex items-center"><Tag className="h-3.5 w-3.5 mr-1" /> Discount</span>
                <div className="relative w-24">
                  <span className="absolute left-2 top-1.5 text-gray-500">$</span>
                  <Input 
                    type="number" 
                    min="0" 
                    step="0.01"
                    className="h-8 pl-6 text-right text-sm bg-white" 
                    placeholder="0.00"
                    value={discountInput}
                    onChange={(e) => setDiscountInput(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
                <span>Total</span>
                <span className="text-indigo-600">৳{total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  type="button"
                  variant={paymentMethod === 'Cash' ? 'default' : 'outline'}
                  className={`w-full ৳{paymentMethod === 'Cash' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-white'}`}
                  onClick={() => setPaymentMethod('Cash')}
                >
                  <Banknote className="mr-2 h-4 w-4" /> Cash
                </Button>
                <Button 
                  type="button"
                  variant={paymentMethod === 'Online' ? 'default' : 'outline'}
                  className={`w-full ৳{paymentMethod === 'Online' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-white'}`}
                  onClick={() => setPaymentMethod('Online')}
                >
                  <CreditCard className="mr-2 h-4 w-4" /> Online
                </Button>
              </div>

              <Button 
                className="w-full h-12 text-base font-bold bg-gray-900 hover:bg-gray-800 text-white shadow-md" 
                disabled={cart.length === 0}
                onClick={handleCompleteSale}
              >
                Complete Sale
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <InvoiceModal 
        isOpen={isInvoiceModalOpen} 
        onClose={() => setIsInvoiceModalOpen(false)} 
        order={completedOrder} 
      />
    </div>
  );
}

