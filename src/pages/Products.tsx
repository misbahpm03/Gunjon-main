import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { ProductForm } from '../components/ProductForm';
import { useData } from '../context/DataContext';
import { Product } from '../types';
import { Search, Plus, Filter, Edit2, Trash2, MoreVertical, CheckSquare, Square, Minus, ArrowUp, ArrowDown } from 'lucide-react';

export function Products() {
  const { products, api } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBrand, setFilterBrand] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkStockAmount, setBulkStockAmount] = useState<number>(0);

  // Derived state
  const brands = useMemo(() => Array.from(new Set(products.map(p => p.brand))), [products]);
  const categories = useMemo(() => Array.from(new Set(products.map(p => p.category))), [products]);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = filterBrand ? p.brand === filterBrand : true;
    const matchesCategory = filterCategory ? p.category === filterCategory : true;
    return matchesSearch && matchesBrand && matchesCategory;
  });

  // Handlers
  const handleSelectAll = () => {
    if (selectedIds.size === filteredProducts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredProducts.map(p => p.id)));
    }
  };

  const handleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteProduct(id);
      if (selectedIds.has(id)) {
        const newSelected = new Set(selectedIds);
        newSelected.delete(id);
        setSelectedIds(newSelected);
      }
    } catch (error) {
      console.error('Failed to delete product', error);
    }
  };

  const handleBulkDelete = async () => {
    try {
      for (const id of Array.from(selectedIds)) {
        await api.deleteProduct(id);
      }
      setSelectedIds(new Set());
    } catch (error) {
      console.error('Failed to bulk delete products', error);
    }
  };

  const handleBulkUpdateStock = async () => {
    try {
      for (const id of Array.from(selectedIds)) {
        const product = products.find(p => p.id === id);
        if (product) {
          const newStock = Math.max(0, product.stock + bulkStockAmount);
          await api.updateProduct(id, {
            stock: newStock,
            status: newStock === 0 ? 'Out of Stock' : newStock < 5 ? 'Low Stock' : 'In Stock'
          });
        }
      }
      setBulkStockAmount(0);
      setSelectedIds(new Set());
    } catch (error) {
      console.error('Failed to bulk update stock', error);
    }
  };

  const handleStockChange = async (id: string, amount: number) => {
    const product = products.find(p => p.id === id);
    if (product) {
      try {
        const newStock = Math.max(0, product.stock + amount);
        await api.updateProduct(id, {
          stock: newStock,
          status: newStock === 0 ? 'Out of Stock' : newStock < 5 ? 'Low Stock' : 'In Stock'
        });
      } catch (error) {
        console.error('Failed to update stock', error);
      }
    }
  };

  const handleSaveProduct = async (data: Partial<Product>) => {
    try {
      if (editingProduct) {
        await api.updateProduct(editingProduct.id, data);
      } else {
        await api.addProduct(data as Omit<Product, 'id'>);
      }
      setIsModalOpen(false);
      setEditingProduct(undefined);
    } catch (error) {
      console.error('Failed to save product', error);
    }
  };

  const openAddModal = () => {
    setEditingProduct(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Products</h1>
        <Button onClick={openAddModal} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <select 
                  className="flex h-10 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={filterBrand}
                  onChange={(e) => setFilterBrand(e.target.value)}
                >
                  <option value="">All Brands</option>
                  {brands.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
                <select 
                  className="flex h-10 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {selectedIds.size > 0 && (
              <div className="flex flex-wrap items-center gap-4 bg-indigo-50 p-3 rounded-md border border-indigo-100">
                <span className="text-sm font-medium text-indigo-900">{selectedIds.size} selected</span>
                <div className="flex items-center gap-2">
                  <Input 
                    type="number" 
                    placeholder="Stock +/-" 
                    className="w-24 h-8 bg-white"
                    value={bulkStockAmount || ''}
                    onChange={(e) => setBulkStockAmount(Number(e.target.value))}
                  />
                  <Button size="sm" variant="outline" onClick={handleBulkUpdateStock} className="h-8 bg-white">
                    Update Stock
                  </Button>
                  <Button size="sm" variant="destructive" onClick={handleBulkDelete} className="h-8">
                    Delete Selected
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">
                    <button onClick={handleSelectAll} className="text-gray-500 hover:text-gray-900">
                      {selectedIds.size === filteredProducts.length && filteredProducts.length > 0 ? (
                        <CheckSquare className="h-5 w-5" />
                      ) : (
                        <Square className="h-5 w-5" />
                      )}
                    </button>
                  </TableHead>
                  <TableHead className="w-[60px]">Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Brand</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id} className={selectedIds.has(product.id) ? 'bg-gray-50' : ''}>
                    <TableCell>
                      <button onClick={() => handleSelect(product.id)} className="text-gray-500 hover:text-gray-900">
                        {selectedIds.has(product.id) ? (
                          <CheckSquare className="h-5 w-5 text-indigo-600" />
                        ) : (
                          <Square className="h-5 w-5" />
                        )}
                      </button>
                    </TableCell>
                    <TableCell>
                      <img src={product.image} alt={product.name} className="h-10 w-10 rounded-md object-cover border border-gray-200" />
                    </TableCell>
                    <TableCell className="font-medium">
                      {product.name}
                      <div className="text-xs text-gray-500 md:hidden">{product.brand} • {product.category}</div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{product.brand}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>${product.price.toLocaleString()}</span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-xs text-gray-400 line-through">${product.originalPrice.toLocaleString()}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="w-8 text-center">{product.stock}</span>
                        <div className="flex flex-col gap-1">
                          <button onClick={() => handleStockChange(product.id, 1)} className="text-gray-400 hover:text-green-600 bg-gray-100 rounded-sm p-0.5">
                            <ArrowUp className="h-3 w-3" />
                          </button>
                          <button onClick={() => handleStockChange(product.id, -1)} className="text-gray-400 hover:text-red-600 bg-gray-100 rounded-sm p-0.5">
                            <ArrowDown className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        product.status === 'In Stock' ? 'success' : 
                        product.status === 'Low Stock' ? 'warning' : 'destructive'
                      }>
                        {product.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEditModal(product)} className="h-8 w-8 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)} className="h-8 w-8 text-red-600 hover:text-red-900 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredProducts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center text-gray-500">
                      No products found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
      >
        <ProductForm 
          initialData={editingProduct} 
          onSubmit={handleSaveProduct} 
          onCancel={() => setIsModalOpen(false)} 
        />
      </Modal>
    </div>
  );
}
