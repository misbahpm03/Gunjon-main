import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { ProductCard } from '../components/ProductCard';
import { Button } from '../components/ui/Button';
import { ArrowRight, ShieldCheck, Truck, Clock, MapPin, Store, Info } from 'lucide-react';

export function Home() {
  const { products, banners } = useData();
  const navigate = useNavigate();
  
  // Sort by popularity for Trending
  const trending = [...products].sort((a, b) => b.popularity - a.popularity).slice(0, 4);
  const newArrivals = products.filter(p => p.isNew).slice(0, 4);
  
  // Extract unique categories
  const categories = Array.from(new Set(products.map(p => p.category))) as string[];

  return (
    <div>
      {/* Hero Banners */}
      {banners.length > 0 && (
        <section className="relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 mt-4 sm:mt-6 mb-8">
          <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar rounded-3xl shadow-xl bg-gray-900 relative">
            {banners.map((banner) => (
              <div key={banner.id} className="w-full flex-shrink-0 snap-start relative h-[60vh] min-h-[400px]">
                <div className="absolute inset-0">
                  <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent" />
                </div>
                <div className="relative h-full flex flex-col justify-center text-left px-8 md:px-16 z-10 w-full max-w-3xl">
                  <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-white">
                    {banner.title}
                  </h1>
                  <p className="text-xl text-gray-200 mb-10 max-w-2xl">
                    {banner.subtitle}
                  </p>
                  <Link to={banner.link}>
                    <Button size="lg" className="rounded-full px-8 bg-white text-gray-900 hover:bg-gray-100 hover:-translate-y-1 transition-transform shadow-lg w-fit font-bold">
                      Shop Now <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Features */}
      <section className="border-b border-gray-200 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-200">
            <div className="flex flex-col items-center pt-4 md:pt-0">
              <Truck className="h-8 w-8 text-indigo-600 mb-3" />
              <h3 className="font-semibold text-gray-900">Free Shipping</h3>
              <p className="text-sm text-gray-500 mt-1">On all orders over ৳50</p>
            </div>
            <div className="flex flex-col items-center pt-8 md:pt-0">
              <ShieldCheck className="h-8 w-8 text-indigo-600 mb-3" />
              <h3 className="font-semibold text-gray-900">Secure Payment</h3>
              <p className="text-sm text-gray-500 mt-1">100% secure payment</p>
            </div>
            <div className="flex flex-col items-center pt-8 md:pt-0">
              <Clock className="h-8 w-8 text-indigo-600 mb-3" />
              <h3 className="font-semibold text-gray-900">24/7 Support</h3>
              <p className="text-sm text-gray-500 mt-1">Dedicated support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Shop by Category</h2>
            <p className="text-gray-500 mt-1">Find exactly what you're looking for.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 px-2 sm:px-0">
          {categories.slice(0, 8).map((category, idx) => (
            <button
              key={idx}
              onClick={() => navigate(`/shop?category=${encodeURIComponent(category)}`)}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-[#f9fafb] shadow-sm border border-gray-100 flex items-center justify-center group-hover:bg-indigo-600 group-hover:border-indigo-600 group-hover:shadow-lg group-hover:-translate-y-2 transition-all duration-300 mb-4">
                <span className="text-2xl sm:text-3xl font-extrabold text-gray-300 group-hover:text-white transition-colors">{category.charAt(0).toUpperCase()}</span>
              </div>
              <span className="font-bold text-sm sm:text-base text-gray-900 group-hover:text-indigo-600 transition-colors text-center">{category}</span>
            </button>
          ))}
        </div>
      </section>
      
      {/* Trending Products */}
      <section className="py-12 px-4 sm:px-8 max-w-[1200px] mx-auto bg-[#F5F5F7] rounded-3xl mb-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900">Trending Products</h2>
            <p className="text-gray-500 mt-1">Our most popular devices right now.</p>
          </div>
          <Link to="/shop?sort=popularity" className="text-indigo-600 font-bold hover:text-indigo-700 hidden sm:flex items-center">
            See All <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {trending.map(p => (
            <div key={p.id}>
              <ProductCard product={p} />
            </div>
          ))}
        </div>
        <div className="mt-8 sm:hidden px-2">
          <Link to="/shop?sort=popularity" className="block w-full">
            <Button variant="outline" className="w-full bg-white font-bold border-2 border-gray-200">See All Trending</Button>
          </Link>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-12 px-4 sm:px-8 max-w-[1200px] mx-auto bg-[#F5F5F7] rounded-3xl mb-8">
        <div className="flex justify-between items-end mb-8 text-left">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900">New Arrivals</h2>
            <p className="text-gray-500 mt-1">The latest tech just landed.</p>
          </div>
          <Link to="/shop?filter=new" className="text-indigo-600 font-bold hover:text-indigo-700 hidden sm:flex items-center">
            See All <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {newArrivals.map(p => (
            <div key={p.id}>
              <ProductCard product={p} />
            </div>
          ))}
        </div>
        <div className="mt-8 sm:hidden px-2">
          <Link to="/shop?filter=new" className="block w-full">
            <Button variant="outline" className="w-full bg-white font-bold border-2 border-gray-200">See All New Arrivals</Button>
          </Link>
        </div>
      </section>

      {/* About Me / Store Info */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto mb-8">
        <Link to="/about" className="block group">
          <div className="bg-white rounded-3xl border-0 shadow-xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="md:flex">
              <div className="md:w-1/3 bg-indigo-600 p-8 text-white flex flex-col justify-center items-center text-center">
                <Store className="h-16 w-16 mb-4 opacity-90" />
                <h2 className="text-2xl font-bold mb-2">Gunjan Telecom</h2>
                <p className="text-indigo-100">Your trusted tech partner</p>
              </div>
              <div className="md:w-2/3 p-8 md:p-10 flex flex-col justify-center">
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-indigo-600 transition-colors flex items-center">
                  About Our Store <ArrowRight className="ml-2 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity transform -translate-x-2 group-hover:translate-x-0" />
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  We are a premium electronics retailer specializing in the latest smartphones, accessories, and gadgets. With over 5 years of experience, we pride ourselves on delivering authentic products with exceptional customer service.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-indigo-500 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Location</p>
                      <p className="text-sm text-gray-500">RAMC, Super Market</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Info className="h-5 w-5 text-indigo-500 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Store Hours</p>
                      <p className="text-sm text-gray-500">Mon-Sat: 10AM - 8PM<br/>Sun: Closed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </section>
    </div>
  );
}
