import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { Card, CardContent } from '../components/ui/Card';
import { Tag, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export function CustomerOffers() {
  const { offers } = useData();
  const activeOffers = offers.filter(o => o.status === 'Active');
  
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getTimeRemaining = (endDate: string) => {
    const total = Date.parse(endDate) - Date.parse(now.toString());
    if (total <= 0) return 'Expired';
    
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">Special Offers</h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
          Don't miss out on these limited-time deals. Grab them before they're gone!
        </p>
      </div>

      {activeOffers.length === 0 ? (
        <div className="text-center py-24 bg-gray-50 rounded-3xl">
          <Tag className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No active offers right now</h2>
          <p className="text-gray-500 mb-8">Check back later for new deals and discounts.</p>
          <Link to="/shop">
            <Button size="lg" className="rounded-full">
              Continue Shopping
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeOffers.map(offer => (
            <Card key={offer.id} className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 group">
              <div className="bg-indigo-600 p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                <Tag className="h-10 w-10 mb-4 opacity-80" />
                <h3 className="text-2xl font-bold mb-2">{offer.title}</h3>
                <div className="text-4xl font-extrabold text-yellow-300 mb-4">{offer.discount}</div>
              </div>
              <CardContent className="p-6 bg-white">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center text-gray-500 text-sm font-medium">
                    <Clock className="h-4 w-4 mr-2 text-indigo-500" />
                    Ends in:
                  </div>
                  <div className="font-mono font-bold text-red-600 bg-red-50 px-3 py-1 rounded-md">
                    {getTimeRemaining(offer.endDate)}
                  </div>
                </div>
                <Link to={`/shop?offer=${offer.id}`}>
                  <Button className="w-full group-hover:bg-indigo-700 transition-colors">
                    Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
