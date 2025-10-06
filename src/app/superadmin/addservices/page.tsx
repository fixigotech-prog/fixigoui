'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

import CloudinaryUploadWidget, { CloudinaryUploadResult } from '@/components/CloudinaryUploadWidget';

interface Category {
  id: number;
  name: string;
}

interface ServiceDetail {
  id: string;
  name: string;
  description: string;
  lang: string;
}

interface ServicePricing {
  id: string;
  price: number;
  term: string;
  termUnit: string;
  lang: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function AddServicePage() {

  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [price, setPrice] = useState(0);
  const [term, setTerm] = useState('');
  const [termUnit, setTermUnit] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [serviceDetails, setServiceDetails] = useState<ServiceDetail[]>([
    { id: '1', name: '', description: '', lang: 'en' }
  ]);
  const [servicePricing, setServicePricing] = useState<ServicePricing[]>([
    { id: '1', price: 0, term: '', termUnit: '', lang: 'en' }
  ]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get<Category[]>(`${API_URL}/api/categories`);
        setCategories(response.data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);



  const handleUploadSuccess = (result: CloudinaryUploadResult) => {
    setImageUrl(result.secure_url);
  };

  const addServiceDetail = () => {
    const newId = (serviceDetails.length + 1).toString();
    setServiceDetails([...serviceDetails, { id: newId, name: '', description: '', lang: 'en' }]);
  };

  const removeServiceDetail = (id: string) => {
    if (serviceDetails.length > 1) {
      setServiceDetails(serviceDetails.filter(detail => detail.id !== id));
    }
  };

  const updateServiceDetail = (id: string, field: keyof ServiceDetail, value: string) => {
    setServiceDetails(serviceDetails.map(detail => 
      detail.id === id ? { ...detail, [field]: value } : detail
    ));
  };

  const addServicePricing = () => {
    const newId = (servicePricing.length + 1).toString();
    setServicePricing([...servicePricing, { id: newId, price: 0, term: '', termUnit: '', lang: 'en' }]);
  };

  const removeServicePricing = (id: string) => {
    if (servicePricing.length > 1) {
      setServicePricing(servicePricing.filter(pricing => pricing.id !== id));
    }
  };

  const updateServicePricing = (id: string, field: keyof ServicePricing, value: string | number) => {
    setServicePricing(servicePricing.map(pricing => 
      pricing.id === id ? { ...pricing, [field]: value } : pricing
    ));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!selectedCategoryId) {
      setError('Category is required');
      setIsSubmitting(false);
      return;
    }

    const validDetails = serviceDetails.filter(detail => detail.name && detail.description);
    const validPricing = servicePricing.filter(pricing => pricing.price > 0 && pricing.termUnit);

    if (validDetails.length === 0) {
      setError('At least one service detail is required');
      setIsSubmitting(false);
      return;
    }

    try {
      const serviceData = {
        categoryId: parseInt(selectedCategoryId),
        price,
        term,
        termUnit,
        isActive,
        imageUrl,
        videoUrl,
        details: validDetails.map(detail => ({
          name: detail.name,
          description: detail.description,
          lang: detail.lang
        })),
        pricing: validPricing.map(pricing => ({
          price: pricing.price,
          term: pricing.term,
          termUnit: pricing.termUnit,
          lang: pricing.lang
        }))
      };

      await axios.post(`${API_URL}/api/services`, serviceData);
      alert('Service created successfully!');
      router.back();
    } catch (err) {
      console.error('Failed to create service:', err);
      setError('Failed to create service');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl rounded-lg bg-white p-8 shadow-md">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Add New Service</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
          <select
            id="category"
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-200 focus:border-gray-400 focus:shadow-md focus:outline-none sm:text-sm"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Base Price</label>
            <input
              type="number"
              id="price"
              min="0"
              value={price}
              onChange={(e) => setPrice(parseInt(e.target.value) || 0)}
              className="mt-1 block w-full rounded-md border border-gray-200 focus:border-gray-400 focus:shadow-md focus:outline-none sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="term" className="block text-sm font-medium text-gray-700">Term</label>
            <input
              type="text"
              id="term"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="e.g., 1, 2-3"
              className="mt-1 block w-full rounded-md border border-gray-200 focus:border-gray-400 focus:shadow-md focus:outline-none sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="termUnit" className="block text-sm font-medium text-gray-700">Term Unit</label>
            <select
              id="termUnit"
              value={termUnit}
              onChange={(e) => setTermUnit(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-200 focus:border-gray-400 focus:shadow-md focus:outline-none sm:text-sm"
            >
              <option value="">Select Unit</option>
              <option value="hour">Hour</option>
              <option value="day">Day</option>
              <option value="week">Week</option>
              <option value="month">Month</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Service Image</label>
            <div className="mt-1">
              <CloudinaryUploadWidget
                cloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!}
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!}
                onUploadSuccess={handleUploadSuccess}
              >
                {({ open, isLoading }) => (
                  <button
                    type="button"
                    onClick={open}
                    disabled={isLoading}
                    className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                  >
                    {isLoading ? 'Loading...' : 'Upload Service Image'}
                  </button>
                )}
              </CloudinaryUploadWidget>
            </div>
            {imageUrl && <img src={imageUrl} alt="Service preview" className="mt-4 h-32 w-auto rounded-md" />}
          </div>
          <div>
            <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700">Video URL (Optional)</label>
            <input
              type="url"
              id="videoUrl"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://..."
              className="mt-1 block w-full rounded-md border border-gray-200 focus:border-gray-400 focus:shadow-md focus:outline-none sm:text-sm"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Service Details</h3>
            <button
              type="button"
              onClick={addServiceDetail}
              className="rounded-md bg-cyan-600 px-3 py-2 text-sm font-medium text-white hover:bg-cyan-700"
            >
              Add Detail
            </button>
          </div>
          
          <div className="space-y-4">
            {serviceDetails.map((detail, index) => (
              <div key={detail.id} className="rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-gray-700">Detail {index + 1}</h4>
                  {serviceDetails.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeServiceDetail(detail.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      value={detail.name}
                      onChange={(e) => updateServiceDetail(detail.id, 'name', e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-200 focus:border-gray-400 focus:shadow-md focus:outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700">Language</label>
                    <select
                      value={detail.lang}
                      onChange={(e) => updateServiceDetail(detail.id, 'lang', e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-200 focus:border-gray-400 focus:shadow-md focus:outline-none text-sm"
                    >
                      <option value="en">English</option>
                      <option value="ar">Arabic</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700">Description</label>
                    <textarea
                      rows={2}
                      value={detail.description}
                      onChange={(e) => updateServiceDetail(detail.id, 'description', e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-200 focus:border-gray-400 focus:shadow-md focus:outline-none text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Additional Pricing</h3>
            <button
              type="button"
              onClick={addServicePricing}
              className="rounded-md bg-cyan-600 px-3 py-2 text-sm font-medium text-white hover:bg-cyan-700"
            >
              Add Pricing
            </button>
          </div>
          
          <div className="space-y-4">
            {servicePricing.map((pricing, index) => (
              <div key={pricing.id} className="rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-gray-700">Pricing {index + 1}</h4>
                  {servicePricing.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeServicePricing(pricing.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700">Price</label>
                    <input
                      type="number"
                      min="0"
                      value={pricing.price}
                      onChange={(e) => updateServicePricing(pricing.id, 'price', parseInt(e.target.value) || 0)}
                      className="mt-1 block w-full rounded-md border border-gray-200 focus:border-gray-400 focus:shadow-md focus:outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700">Term</label>
                    <input
                      type="text"
                      value={pricing.term}
                      onChange={(e) => updateServicePricing(pricing.id, 'term', e.target.value)}
                      placeholder="e.g., 1, 2-3"
                      className="mt-1 block w-full rounded-md border border-gray-200 focus:border-gray-400 focus:shadow-md focus:outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700">Term Unit</label>
                    <select
                      value={pricing.termUnit}
                      onChange={(e) => updateServicePricing(pricing.id, 'termUnit', e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-200 focus:border-gray-400 focus:shadow-md focus:outline-none text-sm"
                    >
                      <option value="">Select Unit</option>
                      <option value="hour">Hour</option>
                      <option value="day">Day</option>
                      <option value="week">Week</option>
                      <option value="month">Month</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700">Language</label>
                    <select
                      value={pricing.lang}
                      onChange={(e) => updateServicePricing(pricing.id, 'lang', e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-200 focus:border-gray-400 focus:shadow-md focus:outline-none text-sm"
                    >
                      <option value="en">English</option>
                      <option value="ar">Arabic</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center">
          <input
            id="isActive"
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
          />
          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
            Service is active
          </label>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex items-center justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md border border-transparent bg-cyan-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Service'}
          </button>
        </div>
      </form>
    </div>
  );
}