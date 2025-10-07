'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { TrashIcon, PencilIcon, EyeIcon } from '@heroicons/react/24/outline';
import CloudinaryUploadWidget, { CloudinaryUploadResult } from '@/components/CloudinaryUploadWidget';

interface Category {
  id: number;
  name: string;
  parentCategoryId?: number;
  imageUrl?: string;
  parentCategory?: Category;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function SubCategoriesPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [parentCategories, setParentCategories] = useState<Category[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    parentCategoryId: '',
    imageUrl: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get<Category[]>(`${API_URL}/api/categories`);
      setAllCategories(response.data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };



  const handleUploadSuccess = (result: CloudinaryUploadResult) => {
    setFormData(prev => ({ ...prev, imageUrl: result.secure_url }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!formData.name) {
      setError('Name is required');
      setIsSubmitting(false);
      return;
    }

    try {
      const data = {
        name: formData.name,
        parentCategoryId: formData.parentCategoryId ? parseInt(formData.parentCategoryId) : undefined,
        imageUrl: formData.imageUrl || undefined
      };

      if (editingId) {
        await axios.put(`${API_URL}/api/categories/${editingId}`, data);
      } else {
        await axios.post(`${API_URL}/api/categories`, data);
      }

      resetForm();
      fetchCategories();
      alert(editingId ? 'Category updated successfully!' : 'Category created successfully!');
    } catch (err) {
      console.error('Failed to save category:', err);
      setError('Failed to save category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      parentCategoryId: category.parentCategoryId?.toString() || '',
      imageUrl: category.imageUrl || ''
    });
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleView = (category: Category) => {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      parentCategoryId: category.parentCategoryId?.toString() || '',
      imageUrl: category.imageUrl || ''
    });
    setModalMode('view');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ name: '', parentCategoryId: '', imageUrl: '' });
    setModalMode('add');
    setError(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      await axios.delete(`${API_URL}/api/categories/${id}`);
      fetchCategories();
      alert('Category deleted successfully!');
    } catch (err) {
      console.error('Failed to delete category:', err);
      alert('Failed to delete category');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', parentCategoryId: '', imageUrl: '' });
    setEditingId(null);
    setShowForm(false);
    setError(null);
  };

  return (
    <div className="container mx-auto max-w-6xl p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Categories</h1>
        <button
          onClick={() => { setModalMode('add'); setIsModalOpen(true); }}
          className="rounded-md bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700"
        >
          Add Category
        </button>
      </div>



      <div className="rounded-lg bg-white shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Parent Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {allCategories.map((category) => (
                <tr key={category.id}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {category.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {category.parentCategoryId 
                      ? allCategories.find(c => c.id === category.parentCategoryId)?.name || 'N/A'
                      : 'Top Level'
                    }
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {category.imageUrl ? (
                      <img src={category.imageUrl} alt={category.name} className="h-10 w-10 rounded object-cover" />
                    ) : (
                      'No image'
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleView(category)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleEdit(category)}
                        className="text-green-600 hover:text-green-900"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
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
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center px-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={closeModal}></div>
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold mb-4">
                {modalMode === 'add' ? 'Add New Category' : modalMode === 'edit' ? 'Edit Category' : 'View Category'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    disabled={modalMode === 'view'}
                    className="mt-1 block w-full rounded-md border border-gray-200 focus:border-gray-400 focus:shadow-md focus:outline-none sm:text-sm disabled:bg-gray-100"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Parent Category (Optional)</label>
                  <select
                    value={formData.parentCategoryId}
                    onChange={(e) => setFormData(prev => ({ ...prev, parentCategoryId: e.target.value }))}
                    disabled={modalMode === 'view'}
                    className="mt-1 block w-full rounded-md border border-gray-200 focus:border-gray-400 focus:shadow-md focus:outline-none sm:text-sm disabled:bg-gray-100"
                  >
                    <option value="">None (Top Level)</option>
                    {allCategories.filter(cat => cat.id !== editingId).map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                {modalMode !== 'view' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Image (Optional)</label>
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
                            {isLoading ? 'Loading...' : 'Upload Image'}
                          </button>
                        )}
                      </CloudinaryUploadWidget>
                    </div>
                  </div>
                )}
                {formData.imageUrl && <img src={formData.imageUrl} alt="Preview" className="mt-2 h-20 w-auto rounded" />}

                {error && <p className="text-sm text-red-600">{error}</p>}

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  {modalMode !== 'view' && (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 text-sm font-medium text-white bg-cyan-600 rounded-md hover:bg-cyan-700 disabled:opacity-50"
                    >
                      {isSubmitting ? 'Saving...' : editingId ? 'Update' : 'Create'}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}