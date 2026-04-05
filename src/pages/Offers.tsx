import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { useData } from '../context/DataContext';
import { Plus, Calendar, Tag, Image as ImageIcon, Link as LinkIcon, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Banner, Offer } from '../types';

export function Offers() {
  const { offers, banners, api } = useData();
  const [activeTab, setActiveTab] = useState<'banners' | 'offers'>('banners');
  
  // Modal states
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);

  // Form states
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [bannerForm, setBannerForm] = useState({ title: '', subtitle: '', image: '', link: '' });
  const [uploadingBannerImage, setUploadingBannerImage] = useState(false);

  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [offerForm, setOfferForm] = useState({ title: '', discount: '', startDate: '', endDate: '' });

  // Banner handlers
  const handleOpenBannerModal = (banner?: Banner) => {
    if (banner) {
      setEditingBanner(banner);
      setBannerForm({ title: banner.title, subtitle: banner.subtitle, image: banner.image, link: banner.link });
    } else {
      setEditingBanner(null);
      setBannerForm({ title: '', subtitle: '', image: '', link: '' });
    }
    setIsBannerModalOpen(true);
  };

  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBanner) {
        await api.updateBanner(editingBanner.id, bannerForm);
      } else {
        await api.addBanner(bannerForm);
      }
      setIsBannerModalOpen(false);
    } catch (error) {
      console.error('Failed to save banner', error);
    }
  };

  const handleDeleteBanner = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      try {
        await api.deleteBanner(id);
      } catch (err: any) {
        console.error('Failed to delete banner', err);
        alert(`Failed to delete banner. Error: ${err?.message || "Unknown error"}`);
      }
    }
  };

  const handleBannerImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingBannerImage(true);
      const url = await api.uploadImage(file, 'banners');
      setBannerForm(prev => ({ ...prev, image: url }));
    } catch (err) {
      console.error('Failed to upload banner image', err);
      alert('Failed to upload banner image. Make sure your "banners" bucket is public.');
    } finally {
      setUploadingBannerImage(false);
    }
  };

  // Offer handlers
  const handleOpenOfferModal = (offer?: Offer) => {
    if (offer) {
      setEditingOffer(offer);
      setOfferForm({ title: offer.title, discount: offer.discount, startDate: offer.startDate, endDate: offer.endDate });
    } else {
      setEditingOffer(null);
      setOfferForm({ title: '', discount: '', startDate: '', endDate: '' });
    }
    setIsOfferModalOpen(true);
  };

  const handleSaveOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Determine status based on dates
      const now = new Date();
      const start = new Date(offerForm.startDate);
      const end = new Date(offerForm.endDate);
      let status: 'Active' | 'Scheduled' | 'Expired' = 'Scheduled';
      
      if (now > end) {
        status = 'Expired';
      } else if (now >= start && now <= end) {
        status = 'Active';
      }

      const offerData = { ...offerForm, status };

      if (editingOffer) {
        await api.updateOffer(editingOffer.id, offerData);
      } else {
        await api.addOffer(offerData);
      }
      setIsOfferModalOpen(false);
    } catch (error) {
      console.error('Failed to save offer', error);
    }
  };

  const handleDeleteOffer = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this offer?')) {
      try {
        await api.deleteOffer(id);
      } catch (err: any) {
        console.error('Failed to delete offer', err);
        alert(`Failed to delete offer. Error: ${err?.message || "Unknown error"}`);
      }
    }
  };

  const toggleOfferStatus = async (offer: Offer) => {
    const newStatus = offer.status === 'Active' ? 'Expired' : 'Active';
    await api.updateOffer(offer.id, { status: newStatus });
  };

  // Update offer statuses periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      offers.forEach(offer => {
        const start = new Date(offer.startDate);
        const end = new Date(offer.endDate);
        let newStatus = offer.status;
        
        if (now > end && offer.status !== 'Expired') {
          newStatus = 'Expired';
        } else if (now >= start && now <= end && offer.status === 'Scheduled') {
          newStatus = 'Active';
        }

        if (newStatus !== offer.status) {
          api.updateOffer(offer.id, { status: newStatus });
        }
      });
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [offers, api]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Offers & Banners</h1>
        <Button 
          className="w-full sm:w-auto"
          onClick={() => activeTab === 'banners' ? handleOpenBannerModal() : handleOpenOfferModal()}
        >
          <Plus className="mr-2 h-4 w-4" /> 
          {activeTab === 'banners' ? 'Add Banner' : 'Create Offer'}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-full sm:w-fit">
        <button
          className={`flex-1 sm:flex-none px-4 py-2 text-sm font-medium rounded-md transition-colors ৳{
            activeTab === 'banners' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('banners')}
        >
          Banners
        </button>
        <button
          className={`flex-1 sm:flex-none px-4 py-2 text-sm font-medium rounded-md transition-colors ৳{
            activeTab === 'offers' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('offers')}
        >
          Offers
        </button>
      </div>

      {activeTab === 'banners' && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {banners.map(banner => (
            <Card key={banner.id} className="overflow-hidden flex flex-col">
              <div className="h-48 bg-gray-100 relative group">
                <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button variant="secondary" size="sm" onClick={() => handleOpenBannerModal(banner)}><Edit className="h-4 w-4" /></Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteBanner(banner.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
              <CardContent className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{banner.title}</h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{banner.subtitle}</p>
                </div>
                <div className="mt-4 flex items-center text-sm text-indigo-600 font-medium bg-indigo-50 w-fit px-2.5 py-1 rounded-md">
                  <LinkIcon className="h-3.5 w-3.5 mr-1.5" />
                  Redirect: {banner.link}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'offers' && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {offers.map(offer => (
            <Card key={offer.id} className="relative overflow-hidden group">
              <div className={`absolute top-0 left-0 w-1 h-full ৳{
                offer.status === 'Active' ? 'bg-emerald-500' : 
                offer.status === 'Scheduled' ? 'bg-amber-500' : 'bg-gray-300'
              }`} />
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{offer.title}</CardTitle>
                  <Badge variant={
                    offer.status === 'Active' ? 'success' : 
                    offer.status === 'Scheduled' ? 'warning' : 'secondary'
                  }>
                    {offer.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center text-2xl font-bold text-indigo-600">
                  <Tag className="mr-2 h-5 w-5" />
                  {offer.discount}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="mr-2 h-4 w-4" />
                  {format(new Date(offer.startDate), 'MMM d, yyyy')} - {format(new Date(offer.endDate), 'MMM d, yyyy')}
                </div>
                <div className="pt-4 flex justify-end space-x-2 border-t border-gray-100">
                  <Button variant="outline" size="sm" onClick={() => handleOpenOfferModal(offer)}>Edit</Button>
                  <Button variant={offer.status === 'Active' ? 'destructive' : 'default'} size="sm" onClick={() => toggleOfferStatus(offer)}>
                    {offer.status === 'Active' ? 'Deactivate' : 'Activate'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Banner Modal */}
      <Modal isOpen={isBannerModalOpen} onClose={() => setIsBannerModalOpen(false)} title={editingBanner ? "Edit Banner" : "Add New Banner"}>
        <form className="space-y-4" onSubmit={handleSaveBanner}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Banner Title</label>
            <Input 
              placeholder="e.g., Summer Sale 2026" 
              required 
              value={bannerForm.title}
              onChange={e => setBannerForm({...bannerForm, title: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle / Description</label>
            <Input 
              placeholder="e.g., Up to 50% off on selected items" 
              value={bannerForm.subtitle}
              onChange={e => setBannerForm({...bannerForm, subtitle: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Banner Image</label>
            <div className="flex gap-2">
              <Input 
                placeholder="https://example.com/image.jpg" 
                required 
                value={bannerForm.image}
                onChange={e => setBannerForm({...bannerForm, image: e.target.value})}
                className="flex-1"
              />
              <div className="relative overflow-hidden inline-block align-middle">
                <input type="file" onChange={handleBannerImageUpload} accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10" />
                <Button type="button" variant="secondary" disabled={uploadingBannerImage}>
                  {uploadingBannerImage ? '...' : 'Upload'}
                </Button>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Redirect Target (URL or Path)</label>
            <Input 
              placeholder="e.g., /shop or /product/PRD-001" 
              required 
              value={bannerForm.link}
              onChange={e => setBannerForm({...bannerForm, link: e.target.value})}
            />
          </div>
          <div className="pt-4 flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setIsBannerModalOpen(false)}>Cancel</Button>
            <Button type="submit">{editingBanner ? 'Update Banner' : 'Save Banner'}</Button>
          </div>
        </form>
      </Modal>

      {/* Create/Edit Offer Modal */}
      <Modal isOpen={isOfferModalOpen} onClose={() => setIsOfferModalOpen(false)} title={editingOffer ? "Edit Offer" : "Create New Offer"}>
        <form className="space-y-4" onSubmit={handleSaveOffer}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Offer Title</label>
            <Input 
              placeholder="e.g., Flash Sale" 
              required 
              value={offerForm.title}
              onChange={e => setOfferForm({...offerForm, title: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Discount Details</label>
            <Input 
              placeholder="e.g., 15% OFF or ৳50 OFF" 
              required 
              value={offerForm.discount}
              onChange={e => setOfferForm({...offerForm, discount: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <Input 
                type="date" 
                required 
                value={offerForm.startDate}
                onChange={e => setOfferForm({...offerForm, startDate: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <Input 
                type="date" 
                required 
                value={offerForm.endDate}
                onChange={e => setOfferForm({...offerForm, endDate: e.target.value})}
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setIsOfferModalOpen(false)}>Cancel</Button>
            <Button type="submit">{editingOffer ? 'Update Offer' : 'Create Offer'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

