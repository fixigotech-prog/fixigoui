'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface ServiceDetail {
  id: number;
  name: string;
  description: string;
  serviceId: number;
  lang: string;
  createdAt: string;
  updatedAt: string;
}

interface ServicePricing {
  id: number;
  price: number;
  term: string;
  termUnit: string;
  serviceId: number;
  lang: string;
  createdAt: string;
  updatedAt: string;
}

interface Service {
  id: number;
  categoryId: number;
  imageUrl: string;
  videoUrl: string;
  price: number;
  term: string;
  termUnit: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  details: ServiceDetail[];
  pricing: ServicePricing[];
}

interface Category {
  id: number;
  name: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function ServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get<Service[]>(`${API_URL}/api/services`);
      setServices(response.data);
    } catch (err) {
      console.error('Failed to fetch services:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get<Category[]>(`${API_URL}/api/categories`);
      setCategories(response.data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const getCategoryName = (categoryId: number) => {
    return categories.find(cat => cat.id === categoryId)?.name || 'Unknown';
  };

  const getServiceName = (service: Service) => {
    const detail = service.details.find(d => d.lang === 'en') || service.details[0];
    return detail?.name || 'Unnamed Service';
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      await axios.delete(`${API_URL}/api/services/${id}`);
      fetchServices();
      alert('Service deleted successfully!');
    } catch (err) {
      console.error('Failed to delete service:', err);
      alert('Failed to delete service');
    }
  };

  return (
    <div className="container mx-auto max-w-7xl p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Services</h1>
        <button
          onClick={() => router.push('/superadmin/addservices')}
          className="rounded-md bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700"
        >
          Add Service
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p>Loading services...</p>
        </div>
      ) : (
        <div className="rounded-lg bg-white shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Image</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Service Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Base Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Term</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Pricing</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {services.map((service) => (
                  <tr key={service.id}>
                    <td className="whitespace-nowrap px-6 py-4">
                      {service.imageUrl ? (
                        <img src={service.imageUrl} alt={getServiceName(service)} className="h-12 w-12 rounded object-cover" />
                      ) : (
                        <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                          No Image
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {getServiceName(service)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {getCategoryName(service.categoryId)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      ₹{service.price}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {service.term} {service.termUnit}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        service.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {service.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="space-y-1">
                        {service.details.map((detail, index) => (
                          <div key={detail.id} className="text-xs">
                            <span className="font-medium">{detail.lang.toUpperCase()}:</span> {detail.name}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="space-y-1">
                        {service.pricing.map((pricing, index) => (
                          <div key={pricing.id} className="text-xs">
                            <span className="font-medium">{pricing.lang.toUpperCase()}:</span> ₹{pricing.price} / {pricing.term} {pricing.termUnit}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                      <button
                        onClick={() => handleDelete(service.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {services.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-6 py-4 text-center text-sm text-gray-500">
                      No services found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}