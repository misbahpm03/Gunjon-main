import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { ProductCard } from '../components/ProductCard';
import { Input } from '../components/ui/Input';
import { Search, Filter } from 'lucide-react';

export function Shop() {
  const { products, categories, offers } = useData();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  
  // Read from URL params
  const urlCategory = searchParams.get('category') || 'All';
  const urlSort = searchParams.get('sort') || 'popularity';
  const urlFilter = searchParams.get('filter') || 'all';
  const urlOffer = searchParams.get('offer') || null;

  const [selectedCategory, setSelectedCategory] = useState<string>(urlCategory);
  const [sortBy, setSortBy] = useState<string>(urlSort);
  const [filterBy, setFilterBy] = useState<string>(urlFilter);
  const [offerId, setOfferId] = useState<string | null>(urlOffer);

  // Sync state when URL changes
  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || 'All');
    setSortBy(searchParams.get('sort') || 'popularity');
    setFilterBy(searchParams.get('filter') || 'all');
    setOfferId(searchParams.get('offer') || null);
  }, [searchParams]);

  const brands = ['All', ...Array.from(new Set(products.map(p => p.brand)))];
  const categoryNames = ['All', ...categories.map(c => c.name)];

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (category === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    if (sort === 'popularity') {
      searchParams.delete('sort');
    } else {
      searchParams.set('sort', sort);
    }
    setSearchParams(searchParams);
  };

  const activeOffer = offerId ? offers.find(o => o.id === offerId) : null;

  const filteredProducts = products
    .filter(p => !activeOffer || (activeOffer.productIds && activeOffer.productIds.includes(p.id)))
    .filter(p => selectedBrand === 'All' || p.brand === selectedBrand)
    .filter(p => selectedCategory === 'All' || p.category === selectedCategory)
    .filter(p => filterBy === 'all' || (filterBy === 'new' && p.isNew))
    .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.category.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return b.popularity - a.popularity; // default popularity
    });

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 shrink-0 space-y-8">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Search</h3>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search products..." 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Categories</h3>
            <div className="space-y-2">
              {categoryNames.map(cat => (
                <label key={cat} className="flex items-center space-x-3 cursor-pointer">
                  <input 
                    type="radio" 
                    name="category" 
                    value={cat}
                    checked={selectedCategory === cat}
                    onChange={() => handleCategoryChange(cat)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <span className="text-gray-700">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Brands</h3>
            <div className="space-y-2">
              {brands.map(brand => (
                <label key={brand} className="flex items-center space-x-3 cursor-pointer">
                  <input 
                    type="radio" 
                    name="brand" 
                    value={brand}
                    checked={selectedBrand === brand}
                    onChange={() => setSelectedBrand(brand)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <span className="text-gray-700">{brand}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {activeOffer && (
            <div className="mb-6 bg-indigo-50 border border-indigo-100 rounded-lg p-4 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-indigo-900">{activeOffer.title}</h2>
                <p className="text-indigo-700 text-sm">Showing products for this offer ({activeOffer.discount})</p>
              </div>
              <button 
                onClick={() => {
                  searchParams.delete('offer');
                  setSearchParams(searchParams);
                }}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-800 bg-white px-3 py-1.5 rounded-md border border-indigo-200"
              >
                Clear Offer
              </button>
            </div>
          )}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <h1 className="text-3xl font-bold text-gray-900">
              {selectedCategory !== 'All' ? selectedCategory : 'All Products'}
            </h1>
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <select 
                className="border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
              >
                <option value="popularity">Sort by Popularity</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
          
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p className="text-lg">No products found matching your criteria.</p>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedBrand('All');
                  handleCategoryChange('All');
                  setFilterBy('all');
                }}
                className="mt-4 text-indigo-600 font-medium hover:text-indigo-800"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {filteredProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
