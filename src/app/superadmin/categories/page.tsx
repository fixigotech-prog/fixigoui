'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { TrashIcon, PencilIcon, EyeIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

type Subcategory = {
  id: number;
  name: string;
  categoryId: number;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

type CategoryDetail = {
  lang: string;
  name: string;
  description: string;
};

type Category = {
  id: number;
  name: string;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  subCategories: Subcategory[];
  details: CategoryDetail[];
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function CategoriesPage() {
  const t = useTranslations('SuperAdminCategoriesPage');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [newCategoryImage, setNewCategoryImage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
  const [currentLang, setCurrentLang] = useState('en');

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/categories`);
      setCategories(response.data as Category[] || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    if (newCategoryName.trim() === '') return;
    try {
      if (editingCategory) {
        await axios.put(`${API_URL}/api/categories/${editingCategory.id}`, {
          name: newCategoryName.trim(), // Assuming default name is still needed at top level
          imageUrl: newCategoryImage || null,
          details: {
            [currentLang]: {
              name: newCategoryName.trim(),
              description: newCategoryDescription.trim()
            }
          }
        });
      } else {
        await axios.post(`${API_URL}/api/categories`, { 
          name: newCategoryName.trim(),
          imageUrl: newCategoryImage || null,
          details: {
            [currentLang]: {
              name: newCategoryName.trim(),
              description: newCategoryDescription.trim()
            }
          }
        });
      }
      setNewCategoryName('');
      setNewCategoryDescription('');
      setNewCategoryImage('');
      setEditingCategory(null);
      setIsModalOpen(false);
      await fetchCategories();
    } catch (error) {
      console.error("Failed to save category:", error);
    }
  };

  useEffect(() => {
    if (editingCategory && modalMode !== 'add') {
      const detail = editingCategory.details.find(d => d.lang === currentLang);
      setNewCategoryName(detail?.name || '');
      setNewCategoryDescription(detail?.description || '');
    } else {
      setNewCategoryName('');
      setNewCategoryDescription('');
    }
  }, [currentLang, editingCategory, modalMode]);

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setCurrentLang('en'); // Reset to default language on edit
    const detail = category.details.find(d => d.lang === 'en') || { name: category.name, description: '' };
    setNewCategoryName(detail.name);
    setNewCategoryDescription(detail.description);
    setNewCategoryImage(category.imageUrl || '');
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleView = (category: Category) => {
    setEditingCategory(category);
    setCurrentLang('en'); // Reset to default language on view
    const detail = category.details.find(d => d.lang === 'en') || { name: category.name, description: '' };
    setNewCategoryName(detail.name);
    setNewCategoryDescription(detail.description);
    setNewCategoryImage(category.imageUrl || '');
    setModalMode('view');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setNewCategoryName('');
    setNewCategoryDescription('');
    setNewCategoryImage('');
    setModalMode('add');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'your_upload_preset');

    try {
      const response = await axios.post<{ secure_url: string }>(
        'https://api.cloudinary.com/v1_1/your_cloud_name/image/upload',
        formData
      );
      setNewCategoryImage(response.data.secure_url);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveCategory = async (categoryId: number) => {
    try {
      await axios.delete(`${API_URL}/api/categories/${categoryId}`);
      await fetchCategories();
    } catch (error) {
      console.error("Failed to remove category:", error);
    }
  };

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold leading-6 text-gray-900">{t('title')}</h1>
          <p className="mt-2 text-sm text-gray-700">{t('description')}</p>
        </div>
      </div>

      {loading ? (
        <div className="mt-8 text-center"><p>Loading categories...</p></div>
      ) : (
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">{t('categoryName')}</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Image</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">{t('subcategories')}</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">{t('dateCreated')}</th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">{t('actions')}</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {categories.map((category) => (
                      <tr key={category.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{category.name}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {category.imageUrl ? (
                            <img src={category.imageUrl} alt={category.name} className="h-10 w-10 rounded object-cover" />
                          ) : (
                            <span className="text-gray-400">No image</span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{category.subCategories?.length || 0}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{new Date(category.createdAt).toLocaleDateString()}</td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <div className="flex justify-end space-x-2">
                            <button
                              type="button"
                              onClick={() => handleView(category)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <EyeIcon className="h-5 w-5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleEdit(category)}
                              className="text-green-600 hover:text-green-900"
                            >
                              <PencilIcon className="h-5 w-5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveCategory(category.id)}
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
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center px-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={closeModal}></div>
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold mb-4">
                {modalMode === 'add' ? t('addCategory') : modalMode === 'edit' ? 'Edit Category' : 'View Category'}
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Language</label>
                  <select
                    value={currentLang}
                    onChange={(e) => setCurrentLang(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm"
                  >
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="kn">Kannada</option>
                    <option value="te">Telugu</option>
                  </select>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-md font-medium text-gray-800 mb-4">Category Details</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        disabled={modalMode === 'view'}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm disabled:bg-gray-100"
                        placeholder={t('newCategoryPlaceholder')}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        value={newCategoryDescription}
                        onChange={(e) => setNewCategoryDescription(e.target.value)}
                        disabled={modalMode === 'view'}
                        rows={4}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm disabled:bg-gray-100"
                        placeholder="Enter category description"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-md font-medium text-gray-800 mb-4">Media</h4>
                  {modalMode !== 'view' && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
                      />
                      <input
                        type="url"
                        placeholder="Or paste image URL"
                        value={newCategoryImage}
                        onChange={(e) => setNewCategoryImage(e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6"
                      />
                      {isUploading && <p className="text-sm text-blue-600">Uploading...</p>}
                    </div>
                  )}
                  {newCategoryImage && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700">Image Preview</label>
                      <img src={newCategoryImage} alt="Preview" className="mt-2 w-24 h-24 object-cover rounded-md border" />
                    </div>
                  )}
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
                {modalMode !== 'view' && (
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    className="px-4 py-2 text-sm font-medium text-white bg-cyan-600 rounded-md hover:bg-cyan-700"
                  >
                    {editingCategory ? 'Update' : t('add')}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}