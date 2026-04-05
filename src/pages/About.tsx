import React from 'react';
import { Store, MapPin, Clock, Phone, Mail, MessageCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
          About Gunjan Telecom
        </h1>
        <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
          Your trusted partner for the latest electronics, smartphones, and accessories.
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden mb-12">
        <div className="md:flex">
          <div className="md:w-1/2 bg-indigo-600 p-12 text-white flex flex-col justify-center items-center text-center">
            <Store className="h-24 w-24 mb-6 opacity-90" />
            <h2 className="text-3xl font-bold mb-4">Our Story</h2>
            <p className="text-indigo-100 text-lg leading-relaxed">
              Founded with a passion for technology, Gunjan Telecom has grown from a small local shop to a premier electronics destination. We believe in providing our customers with not just products, but solutions that enhance their digital lives.
            </p>
          </div>
          
          <div className="md:w-1/2 p-12 flex flex-col justify-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Visit Our Store</h3>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <MapPin className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">Location</h4>
                  <p className="mt-1 text-gray-500">
                    RAMC, Super Market<br />
                    (Replace with full address)
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Clock className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">Business Hours</h4>
                  <p className="mt-1 text-gray-500">
                    Monday - Saturday: 10:00 AM - 8:00 PM<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Phone className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">Contact</h4>
                  <p className="mt-1 text-gray-500">
                    +1 (555) 123-4567
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Mail className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">Email</h4>
                  <p className="mt-1 text-gray-500">
                    support@gunjontelecom.com
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <a href="tel:+15551234567" className="flex-1">
                <Button className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700">
                  <Phone size={18} /> Call Us
                </Button>
              </a>
              <a href="https://wa.me/15551234567" target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white border-none">
                  <MessageCircle size={18} /> WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Mock Map Preview */}
      <div className="bg-gray-100 rounded-3xl overflow-hidden h-96 relative border border-gray-200 flex items-center justify-center">
        <div className="absolute inset-0 opacity-50" style={{ backgroundImage: 'url("https://maps.googleapis.com/maps/api/staticmap?center=RAMC+Super+Market&zoom=15&size=1200x400&maptype=roadmap&markers=color:red%7CRAMC+Super+Market&key=YOUR_API_KEY")', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
        <div className="relative z-10 bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg text-center max-w-sm mx-4">
          <MapPin className="h-10 w-10 text-indigo-600 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Find Us Here</h3>
          <p className="text-gray-600 mb-4">RAMC, Super Market</p>
          <Button variant="outline" className="w-full">Get Directions</Button>
        </div>
      </div>
    </div>
  );
}
