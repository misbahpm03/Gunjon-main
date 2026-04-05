import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home, Smartphone, Tablet, Headphones, Watch } from 'lucide-react';
import { useData } from '../context/DataContext';

const iconMap: Record<string, React.ElementType> = {
  Smartphone,
  Tablet,
  Headphones,
  Watch
};

export function Categories() {
  const { categories, products } = useData();

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex text-sm text-gray-500" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link to="/" className="inline-flex items-center hover:text-indigo-600 transition-colors">
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRight className="w-4 h-4 mx-1" />
                  <span className="text-gray-900 font-medium">Categories</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Shop by Category</h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">Find exactly what you're looking for by browsing our curated collections.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map(c => {
            const Icon = iconMap[c.icon] || Smartphone;
            const productCount = products.filter(p => p.category === c.name).length;
            
            return (
              <Link 
                key={c.id} 
                to={`/shop?category=${encodeURIComponent(c.name)}`} 
                className="bg-white border border-gray-200 hover:border-indigo-300 hover:shadow-xl rounded-3xl overflow-hidden transition-all group flex flex-col h-full"
              >
                <div className="h-48 w-full overflow-hidden relative">
                  <img src={c.image} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ৳{c.color} shadow-lg`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                      {productCount} {productCount === 1 ? 'Product' : 'Products'}
                    </span>
                  </div>
                </div>
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-2">{c.name}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{c.description}</p>
                  </div>
                  <div className="mt-4 flex items-center text-indigo-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                    Browse Category <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
