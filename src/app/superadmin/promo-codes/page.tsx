'use client';

import { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

interface PromocodeBody {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  expiryDate?: Date;
  serviceId?: number;
}

interface Promocode extends PromocodeBody {
  id: number;
  createdAt: string;
  updatedAt: string;
}

interface Service {
  id: number;
  details: {
    id: number;
    name: string;
    description: string;
    serviceId: number;
    lang: string;
  }[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function PromoCodesPage() {
  const [promocodes, setPromocodes] = useState<Promocode[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromocode, setEditingPromocode] = useState<Promocode | null>(null);
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState<PromocodeBody>({
    code: '',
    discountType: 'percentage',
    discountValue: 0,
    expiryDate: undefined,
    serviceId: undefined
  });

  useEffect(() => {
    setMounted(true);
    fetchPromocodes();
    fetchServices();
  }, []);

  const fetchPromocodes = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/promocodes`);
      setPromocodes(response.data);
    } catch (error) {
      console.error('Failed to fetch promocodes:', error);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/services`);
      setServices(response.data);
    } catch (error) {
      console.error('Failed to fetch services:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPromocode) {
        await axios.put(`${API_URL}/api/promocodes/${editingPromocode.id}`, formData);
      } else {
        await axios.post(`${API_URL}/api/promocodes`, formData);
      }
      fetchPromocodes();
      closeModal();
    } catch (error) {
      console.error('Failed to save promocode:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this promocode?')) {
      try {
        await axios.delete(`${API_URL}/api/promocodes/${id}`);
        fetchPromocodes();
      } catch (error) {
        console.error('Failed to delete promocode:', error);
      }
    }
  };

  const openModal = (promocode?: Promocode) => {
    if (promocode) {
      setEditingPromocode(promocode);
      setFormData({
        code: promocode.code,
        discountType: promocode.discountType,
        discountValue: promocode.discountValue,
        expiryDate: promocode.expiryDate ? new Date(promocode.expiryDate) : undefined,
        serviceId: promocode.serviceId
      });
    } else {
      setEditingPromocode(null);
      setFormData({
        code: '',
        discountType: 'percentage',
        discountValue: 0,
        expiryDate: undefined,
        serviceId: undefined
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPromocode(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Promo Codes</h1>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <PlusIcon className="h-5 w-5" />
          Add Promo Code
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {promocodes.map((promocode) => (
              <tr key={promocode.id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium">{promocode.code}</td>
                <td className="px-6 py-4 whitespace-nowrap">{promocode.discountType}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {promocode.discountValue}{promocode.discountType === 'percentage' ? '%' : '₹'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {promocode.expiryDate && mounted ? new Date(promocode.expiryDate).toLocaleDateString() : promocode.expiryDate ? 'Loading...' : 'No expiry'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {promocode.serviceId ? services.find(s => s.id === promocode.serviceId)?.details[0]?.name || promocode.serviceId : 'All Services'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal(promocode)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(promocode.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingPromocode ? 'Edit Promo Code' : 'Add Promo Code'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Code</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Discount Type</label>
                <select
                  value={formData.discountType}
                  onChange={(e) => setFormData({ ...formData, discountType: e.target.value as 'percentage' | 'fixed' })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Discount Value</label>
                <input
                  type="number"
                  value={formData.discountValue}
                  onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Expiry Date (Optional)</label>
                <input
                  type="date"
                  value={formData.expiryDate ? formData.expiryDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value ? new Date(e.target.value) : undefined })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Service (Optional)</label>
                <select
                  value={formData.serviceId || ''}
                  onChange={(e) => setFormData({ ...formData, serviceId: e.target.value ? Number(e.target.value) : undefined })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="">All Services</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.details[0]?.name || `Service ${service.id}`}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  {editingPromocode ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}