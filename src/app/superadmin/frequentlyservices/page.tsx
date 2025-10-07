'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import CloudinaryUploadWidget, { CloudinaryUploadResult } from '@/components/CloudinaryUploadWidget';

interface FrequentlyUsedService {
  id?: number;
  serviceId: number;
  usageCount?: number;
  imageUrl: string;
  displayOrder?: number;
  isActive?: boolean;
}

interface Service {
  id: number;
  details: Array<{
    name: string;
    description: string;
  }>;
}

export default function FrequentlyUsedServicesPage() {
  const [services, setServices] = useState<FrequentlyUsedService[]>([]);
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<FrequentlyUsedService | null>(null);
  const [formData, setFormData] = useState<FrequentlyUsedService>({
    serviceId: 0,
    usageCount: 0,
    imageUrl: '',
    displayOrder: 0,
    isActive: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchServices = async () => {
    try {
      const response = await axios.get<FrequentlyUsedService[]>(`${API_URL}/api/frequent-services`);
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadSuccess = (result: CloudinaryUploadResult) => {
    setFormData(prev => ({ ...prev, imageUrl: result.secure_url }));
  };

  const fetchAllServices = async () => {
    try {
      const response = await axios.get<Service[]>('https://fixigoapi.onrender.com/api/services');
      setAllServices(response.data);
    } catch (error) {
      console.error('Error fetching all services:', error);
    }
  };

  useEffect(() => {
    fetchServices();
    fetchAllServices();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingService) {
        await axios.put(`${API_URL}/api/frequent-services/${editingService.id}`, formData);
      } else {
        await axios.post(`${API_URL}/api/frequent-services`, formData);
      }
      setIsModalOpen(false);
      setEditingService(null);
      setFormData({ serviceId: 0, usageCount: 0, imageUrl: '', displayOrder: 0, isActive: true });
      fetchServices();
    } catch (error) {
      console.error('Error saving service:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (service: FrequentlyUsedService) => {
    setEditingService(service);
    setFormData(service);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this service?')) {
      try {
        await axios.delete(`${API_URL}/api/frequent-services/${id}`);
        fetchServices();
      } catch (error) {
        console.error('Error deleting service:', error);
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
    setFormData({ serviceId: 0, usageCount: 0, imageUrl: '', displayOrder: 0, isActive: true });
  };

  const handleImageUpload = (result: CloudinaryUploadResult) => {
    setFormData(prev => ({ ...prev, imageUrl: result.secure_url }));
  };

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold leading-6 text-gray-900">Frequently Used Services</h1>
          <p className="mt-2 text-sm text-gray-700">Manage frequently used services displayed on homepage</p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="block rounded-md bg-cyan-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-cyan-500"
          >
            Add Service
          </button>
        </div>
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Service ID</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Image</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Usage Count</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Display Order</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="text-center py-4">Loading...</td>
                    </tr>
                  ) : services.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-4">No services found</td>
                    </tr>
                  ) : (
                    services.map((service) => (
                      <tr key={service.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{service.serviceId}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <img src={service.imageUrl} alt="" className="h-10 w-10 rounded-full object-cover" />
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{service.usageCount || 0}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{service.displayOrder || 0}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${service.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {service.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button onClick={() => handleEdit(service)} className="text-cyan-600 hover:text-cyan-900 mr-4">Edit</button>
                          <button onClick={() => handleDelete(service.id!)} className="text-red-600 hover:text-red-900">Delete</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center px-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={closeModal}></div>
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold mb-4">{editingService ? 'Edit Service' : 'Add Service'}</h3>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
                    <select
                      required
                      value={formData.serviceId}
                      onChange={(e) => setFormData({...formData, serviceId: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      <option value={0}>Select a service</option>
                      {allServices.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.details[0]?.name || `Service ${service.id}`} (ID: {service.id})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                    <div className="space-y-2">
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
                            {isLoading ? 'Loading...' : 'Upload Image'}
                          </button>
                        )}
                      </CloudinaryUploadWidget>
                      <input
                        type="url"
                        placeholder="Or paste image URL"
                        value={formData.imageUrl || ''}
                        onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                      {formData.imageUrl && (
                        <img src={formData.imageUrl} alt="Preview" className="w-20 h-20 object-cover rounded" />
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Usage Count</label>
                    <input
                      type="number"
                      value={formData.usageCount || 0}
                      onChange={(e) => setFormData({...formData, usageCount: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                    <input
                      type="number"
                      value={formData.displayOrder || 0}
                      onChange={(e) => setFormData({...formData, displayOrder: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">Active</span>
                    </label>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm font-medium text-white bg-cyan-600 rounded-md hover:bg-cyan-700 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Saving...' : (editingService ? 'Update' : 'Create')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}