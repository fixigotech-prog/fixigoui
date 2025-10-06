'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { TrashIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

type Subcategory = {
  id: number;
  name: string;
  categoryId: number;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

type Category = {
  id: number;
  name: string;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  subCategories: Subcategory[];
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function CategoriesPage() {
  const t = useTranslations('SuperAdminCategoriesPage');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState('');

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
      await axios.post(`${API_URL}/api/categories`, { name: newCategoryName.trim() });
      setNewCategoryName('');
      await fetchCategories(); // Refetch to get the new category with its ID from the server
    } catch (error) {
      console.error("Failed to add category:", error);
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

      <div className="mt-8 bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-6">
        <h2 className="text-lg font-medium leading-6 text-gray-900">{t('addCategory')}</h2>
        <div className="mt-4 flex gap-x-3">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6"
            placeholder={t('newCategoryPlaceholder')}
          />
          <button
            type="button"
            onClick={handleAddCategory}
            className="rounded-md bg-cyan-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
          >
            {t('add')}
          </button>
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
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{category.subCategories?.length || 0}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{new Date(category.createdAt).toLocaleDateString()}</td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button
                            type="button"
                            onClick={() => handleRemoveCategory(category.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <span className="sr-only">{t('delete')}</span>
                            <TrashIcon className="h-5 w-5" />
                          </button>
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
    </div>
  );
}