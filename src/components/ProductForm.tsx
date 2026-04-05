import React, { useState } from 'react';
import { Product } from '../types';
import { useData } from '../context/DataContext';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { X, Plus } from 'lucide-react';

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: Partial<Product>) => void;
  onCancel: () => void;
}

export function ProductForm({ initialData, onSubmit, onCancel }: ProductFormProps) {
  const { categories, products, api } = useData();
  const uniqueBrands = Array.from(new Set(products.map(p => p.brand).filter(Boolean)));
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>(
    initialData || {
      name: '',
      brand: '',
      category: '',
      price: 0,
      originalPrice: 0,
      stock: 0,
      description: '',
      image: '',
      images: [],
      fullSpecs: {},
      keySpecs: [],
      warranty: '',
      status: 'In Stock',
      popularity: 0,
      isNew: false,
    }
  );

  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'originalPrice' || name === 'stock' ? Number(value) : value,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingImage(true);
      const url = await api.uploadImage(file, 'products');
      setFormData(prev => ({ ...prev, image: url }));
    } catch (err) {
      console.error('Failed to upload image', err);
      alert('Failed to upload image. Make sure your bucket exists and is public.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddSpec = () => {
    if (specKey && specValue) {
      setFormData((prev) => ({
        ...prev,
        fullSpecs: {
          ...(prev.fullSpecs || {}),
          [specKey]: specValue,
        },
      }));
      setSpecKey('');
      setSpecValue('');
    }
  };

  const handleRemoveSpec = (key: string) => {
    setFormData((prev) => {
      const newSpecs = { ...prev.fullSpecs };
      delete newSpecs[key];
      return { ...prev, fullSpecs: newSpecs };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Determine status based on stock
    let status: 'In Stock' | 'Low Stock' | 'Out of Stock' = 'In Stock';
    const stock = formData.stock || 0;
    if (stock === 0) status = 'Out of Stock';
    else if (stock < 5) status = 'Low Stock';

    onSubmit({ ...formData, status });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Name</label>
          <Input required name="name" value={formData.name || ''} onChange={handleChange} placeholder="Product Name" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Brand</label>
          <Input required list="brand-list" name="brand" value={formData.brand || ''} onChange={handleChange} placeholder="Select or type Brand" />
          <datalist id="brand-list">
            {uniqueBrands.map((b) => (
              <option key={b} value={b} />
            ))}
          </datalist>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <select required name="category" value={formData.category || ''} onChange={handleChange} className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Stock Quantity</label>
          <Input required type="number" min="0" name="stock" value={formData.stock || 0} onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Price ($)</label>
          <Input required type="number" min="0" step="0.01" name="price" value={formData.price || 0} onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Original Price ($) (Optional)</label>
          <Input type="number" min="0" step="0.01" name="originalPrice" value={formData.originalPrice || 0} onChange={handleChange} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium">Main Image</label>
          <div className="flex gap-2">
            <Input required name="image" value={formData.image || ''} onChange={handleChange} placeholder="Image URL or drop file" className="flex-1" />
            <div className="relative overflow-hidden inline-block">
              <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10" />
              <Button type="button" variant="secondary" disabled={uploadingImage}>
                {uploadingImage ? 'Uploading...' : 'Upload File'}
              </Button>
            </div>
          </div>
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium">Description</label>
          <textarea 
            required
            name="description" 
            value={formData.description || ''} 
            onChange={handleChange} 
            className="flex min-h-[80px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2"
            placeholder="Product description..."
          />
        </div>
      </div>

      <div className="space-y-4 border-t pt-4">
        <h3 className="text-sm font-medium">Specifications</h3>
        <div className="flex items-end gap-2">
          <div className="flex-1 space-y-2">
            <label className="text-xs text-gray-500">Spec Name (e.g., RAM)</label>
            <Input value={specKey} onChange={(e) => setSpecKey(e.target.value)} placeholder="Name" />
          </div>
          <div className="flex-1 space-y-2">
            <label className="text-xs text-gray-500">Value (e.g., 8GB)</label>
            <Input value={specValue} onChange={(e) => setSpecValue(e.target.value)} placeholder="Value" />
          </div>
          <Button type="button" onClick={handleAddSpec} variant="secondary">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {Object.entries(formData.fullSpecs || {}).length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
            {Object.entries(formData.fullSpecs || {}).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between bg-gray-50 p-2 rounded-md border border-gray-100">
                <div className="text-sm truncate mr-2">
                  <span className="font-medium">{key}:</span> {value}
                </div>
                <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveSpec(key)} className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-50">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 pt-4 border-t">
        <input 
          type="checkbox" 
          id="isNewArrival"
          name="isNew"
          checked={formData.isNew || false}
          onChange={(e) => setFormData(p => ({ ...p, isNew: e.target.checked }))}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
        />
        <label htmlFor="isNewArrival" className="text-sm font-medium text-gray-700">
          Mark as New Arrival (Displays on Homepage)
        </label>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">{initialData ? 'Update Product' : 'Add Product'}</Button>
      </div>
    </form>
  );
}
