import { useState, useEffect } from 'react';
import { Phone, MessageCircle, Mail, ShieldCheck, Wrench, MapPin, ChevronDown, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const faqs = [
  {
    q: "What is the estimated delivery time?",
    a: "We typically deliver within 2-3 business days for home delivery. Store pickup is available immediately for in-stock items."
  },
  {
    q: "What is your return policy?",
    a: "We offer a 7-day hassle-free return policy for all unused products in their original packaging. Mobile phones must be unactivated."
  },
  {
    q: "How does the EMI option work?",
    a: "We offer 0% EMI for up to 6 months on major credit cards. You can select the EMI option during checkout to see your monthly breakdown."
  }
];

export function Support() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      {/* Header */}
      <header className={`sticky top-0 md:top-16 z-30 bg-white/90 backdrop-blur-xl pt-safe-top md:pt-0 transition-all duration-300 ৳{isScrolled ? 'shadow-sm border-b border-gray-200' : 'border-b border-gray-100'}`}>
        <div className="px-4 h-14 flex items-center justify-center relative">
          <h1 className="text-lg font-bold text-gray-900">Support & Contact</h1>
        </div>
      </header>

      <main className="p-4 space-y-6">
        {/* 1. Contact Options */}
        <section>
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Get in Touch</h2>
          <div className="grid grid-cols-3 gap-3">
            <button className="flex flex-col items-center justify-center gap-2 bg-emerald-50 text-emerald-600 p-4 rounded-2xl active:scale-95 transition-transform">
              <MessageCircle size={24} />
              <span className="text-xs font-semibold">WhatsApp</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-2 bg-blue-50 text-blue-600 p-4 rounded-2xl active:scale-95 transition-transform">
              <Phone size={24} />
              <span className="text-xs font-semibold">Call Us</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-2 bg-white border border-gray-100 text-gray-700 p-4 rounded-2xl shadow-sm active:scale-95 transition-transform">
              <Mail size={24} />
              <span className="text-xs font-semibold">Email</span>
            </button>
          </div>
        </section>

        {/* 2. Warranty & Service */}
        <section>
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Warranty & Service</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
            <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors active:bg-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <ShieldCheck size={20} />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-sm text-gray-900">Warranty Information</div>
                  <div className="text-xs text-gray-500">Check your device coverage</div>
                </div>
              </div>
              <ExternalLink size={16} className="text-gray-300" />
            </button>
            <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors active:bg-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">
                  <Wrench size={20} />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-sm text-gray-900">Repair Request</div>
                  <div className="text-xs text-gray-500">Book a service appointment</div>
                </div>
              </div>
              <ExternalLink size={16} className="text-gray-300" />
            </button>
          </div>
        </section>

        {/* 3. Store Locations */}
        <section>
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Store Location</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="h-32 bg-gray-200 relative">
              <img 
                src="https://picsum.photos/seed/city/600/300?grayscale&blur=2" 
                alt="Map Preview" 
                className="w-full h-full object-cover opacity-80"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/5" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center shadow-lg shadow-black/20 border-2 border-white">
                <MapPin size={20} />
              </div>
            </div>
            <div className="p-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="font-bold text-gray-900 text-sm">RAMC, Super Market</h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  123 Tech Avenue, Electronics Wing<br/>
                  Open Today: 10:00 AM - 9:00 PM
                </p>
              </div>
              <button className="px-4 py-2 bg-black text-white text-xs font-bold rounded-full active:scale-95 transition-transform shrink-0">
                Directions
              </button>
            </div>
          </div>
        </section>

        {/* 4. FAQ Section */}
        <section>
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Frequently Asked Questions</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
            {faqs.map((faq, index) => (
              <div key={index} className="overflow-hidden">
                <button 
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-sm text-gray-900 pr-4">{faq.q}</span>
                  <motion.div
                    animate={{ rotate: openFaq === index ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown size={16} className="text-gray-400 shrink-0" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-4 pb-4 text-sm text-gray-500 leading-relaxed">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
