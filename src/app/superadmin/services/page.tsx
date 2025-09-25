'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useTranslations, useLocale } from 'next-intl';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? ''; // keep as empty string fallback

// Status style keys are limited to Active | Inactive
const statusStyles: Record<'Active' | 'Inactive', string> = {
  Active: 'bg-green-100 text-green-800',
  Inactive: 'bg-gray-100 text-gray-800',
};

const termUnits = [
  { value: 'N', text: 'NoTerm' },
  { value: 'H', text: 'Hour' },
  { value: 'D', text: 'Day' },
] as const;

// ---------- Types ----------
type ServiceDetailFromApi = {
  id?: number;
  name: string;
  description: string;
  lang: string;
};

type ServiceFromApi = {
  id: number;
  subCategoryId: number;
  price: number;
  term: string;
  termUnit: string;
  isActive: boolean;
  details: ServiceDetailFromApi[];
  // Derived for rendering
  name?: string;
  categoryName?: string;
};

type SubCategory = {
  id: number;
  name: string;
};

type CategoryFromApi = {
  id: number;
  name: string;
  subCategories: SubCategory[];
};

type NewServiceDetail = {
  name: string;
  description: string;
  lang: string;
};

type NewServiceData = {
  imageUrl?: string;
  videoUrl?: string;
  price: string;
  term: string;
  termUnit: string;
  category: string;
  subcategory: string;
  isActive: boolean;
  details: NewServiceDetail[];
};

// ---------- Component ----------
export default function ServicesPage() {
  const t = useTranslations('SuperAdminServicesPage');
  const locale = useLocale();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [services, setServices] = useState<ServiceFromApi[]>([]);
  const [categories, setCategories] = useState<CategoryFromApi[]>([]);
  const [selectedService, setSelectedService] = useState<ServiceFromApi | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const [newServiceData, setNewServiceData] = useState<NewServiceData>({
    price: '',
    term: '',
    termUnit: '',
    category: '',
    subcategory: '',
    isActive: true,
    details: [{ name: '', description: '', lang: 'en' }],
    imageUrl: '',
    videoUrl: '',
  });

  // ---------- API helpers ----------
  const fetchCategories = useCallback(async (): Promise<CategoryFromApi[]> => {
    try {
      const resp = await axios.get(`${API_URL}/api/categories`);
      setCategories(resp.data as CategoryFromApi[] ?? []);
      return resp.data as CategoryFromApi[] ?? [];
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch categories:', error);
      setCategories([]);
      return [];
    }
  }, []);

  const fetchAndProcessServices = useCallback(
    async (categoriesData: CategoryFromApi[]) => {
      try {
        const resp = await axios.get(`${API_URL}/api/services`);
        const fetchedServices = resp.data as ServiceFromApi?? [];
        setServices(fetchedServices as ServiceFromApi[] || []) 
        // build subCategoryId => categoryName map
        const subCategoryToCategoryMap = new Map<number, string>();
        categoriesData.forEach((category) => {
          category.subCategories.forEach((subCategory) => {
            subCategoryToCategoryMap.set(subCategory.id, category.name);
          });
        });

        const processed = services.map((service) => {
          const detail = service.details.find((d) => d.lang === locale) || service.details.find((d) => d.lang === 'en');
          return {
            ...service,
            name: detail?.name ?? 'N/A',
            categoryName: subCategoryToCategoryMap.get(service.subCategoryId) ?? 'N/A',
          } as ServiceFromApi;
        });

        setServices(processed);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch services:', error);
        setServices([]);
      }
    },
    [locale]
  );

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!mounted) return;
      setLoading(true);
      const cats = await fetchCategories();
      await fetchAndProcessServices(cats);
      if (mounted) setLoading(false);
    };
    load();
    return () => {
      mounted = false;
    };
  }, [fetchCategories, fetchAndProcessServices, locale]);

  // ---------- Modal / form helpers ----------
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setNewServiceData({
      price: '',
      term: '',
      termUnit: '',
      category: '',
      subcategory: '',
      isActive: true,
      details: [{ name: '', description: '', lang: 'en' }],
      imageUrl: '',
      videoUrl: '',
    });
    setImageFile(null);
    setVideoFile(null);
    setIsEditing(false);
    setSelectedService(null);
  }, []);

  const uploadFile = useCallback(async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const resp = await axios.post(`${API_URL}/api/upload`, formData, {
        headers: {
          // let browser set boundary automatically; specifying it manually can cause issues
          'Content-Type': 'multipart/form-data',
        },
      });
      // assume { url: string } response
      return (resp.data && (resp.data.url as string)) ?? null;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to upload file:', error);
      return null;
    }
  }, []);

  const handleSaveService = useCallback(async () => {
    setIsSaving(true);
    try {
      let imageUrl: string | null = newServiceData.imageUrl ?? null;
      let videoUrl: string | null = newServiceData.videoUrl ?? null;

      if (imageFile) {
        const uploaded = await uploadFile(imageFile);
        if (uploaded) imageUrl = uploaded;
      }

      if (videoFile) {
        const uploaded = await uploadFile(videoFile);
        if (uploaded) videoUrl = uploaded;
      }

      const subcategory = categories
        .find((c) => c.name === newServiceData.category)
        ?.subCategories.find((s) => s.name === newServiceData.subcategory);

      if (!subcategory) {
        // eslint-disable-next-line no-console
        console.error('Subcategory not found or selected');
        return;
      }

      const priceNumber = parseFloat(newServiceData.price);
      const serviceToSave = {
        price: Number.isNaN(priceNumber) ? 0 : priceNumber,
        term: newServiceData.term,
        termUnit: newServiceData.termUnit,
        subCategoryId: subcategory.id,
        isActive: newServiceData.isActive,
        details: newServiceData.details,
        imageUrl,
        videoUrl,
      };

      await axios.post(`${API_URL}/api/services`, serviceToSave);

      // refresh
      handleCloseModal();
      const cats = await fetchCategories();
      await fetchAndProcessServices(cats);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to save service:', error);
    } finally {
      setIsSaving(false);
    }
  }, [categories, fetchCategories, fetchAndProcessServices, handleCloseModal, imageFile, newServiceData, uploadFile, videoFile]);

  // ---------- Form helpers ----------
  const allLangs = useMemo(
    () => [
      { code: 'en', name: 'English' },
      { code: 'hi', name: 'Hindi' },
      { code: 'kn', name: 'Kannada' },
      { code: 'te', name: 'Telugu' },
    ],
    []
  );

  const handleInputChange = useCallback(
    (field: keyof NewServiceData | (keyof NewServiceDetail), value: unknown, detailIndex?: number) => {
      setNewServiceData((prev) => {
        if (!prev) return prev;
        if (field === 'category') {
          return { ...prev, category: String(value ?? ''), subcategory: '' };
        }

        if (detailIndex !== undefined) {
          const newDetails = [...prev.details];
          newDetails[detailIndex] = {
            ...newDetails[detailIndex],
            [field as keyof NewServiceDetail]: String(value ?? ''),
          };
          return { ...prev, details: newDetails };
        }

        return { ...prev, [field as keyof NewServiceData]: (value as any) } as NewServiceData;
      });
    },
    []
  );

  const handleAddLanguage = useCallback(() => {
    setNewServiceData((prev) => {
      if (!prev) return prev;
      const currentLangs = new Set(prev.details.map((d) => d.lang));
      const available = allLangs.find((l) => !currentLangs.has(l.code));
      if (!available) return prev;
      return { ...prev, details: [...prev.details, { name: '', description: '', lang: available.code }] };
    });
  }, [allLangs]);

  const handleRemoveLanguage = useCallback((indexToRemove: number) => {
    setNewServiceData((prev) => {
      if (!prev) return prev;
      return { ...prev, details: prev.details.filter((_, i) => i !== indexToRemove) };
    });
  }, []);

  const canAddLanguage = (newServiceData.details.length ?? 0) < allLangs.length;

  const selectedCategoryObject = categories.find((c) => c.name === newServiceData.category);

  // ---------- Rendering ----------
  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold leading-6 text-gray-900">{t('title')}</h1>
          <p className="mt-2 text-sm text-gray-700">{t('description')}</p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="block rounded-md bg-cyan-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
          >
            {t('addService')}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="mt-8 text-center">
          <p>{t('loadingServices')}</p>
        </div>
      ) : (
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">{t('serviceName')}</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">{t('category')}</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">{t('price')}</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">{t('status')}</th>
                      <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">{t('edit')}</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {services.map((service) => (
                      <tr key={service.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{service.name}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{service.categoryName}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{`₹${service.price}`}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              statusStyles[service.isActive ? 'Active' : 'Inactive']
                            }`}
                          >
                            {t(service.isActive ? 'active' : 'inactive')}
                          </span>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedService(service);
                              setIsEditing(true);
                              // we'd set newServiceData from service if edit flow implemented
                              setIsModalOpen(true);
                            }}
                            className="text-cyan-600 hover:text-cyan-900"
                          >
                            {t('edit')}
                            <span className="sr-only">, {service.name}</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {services.length === 0 && (
                      <tr>
                        <td colSpan={5} className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">
                          {t('noServices')}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && newServiceData && (
        <div className="fixed inset-0 w-7xl z-10 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" />

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      {t('addServiceModalTitle')}
                    </h3>

                    <div className="mt-4">
                      <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                        {t('image')}
                      </label>
                      <input
                        type="file"
                        name="image"
                        id="image"
                        accept="image/*"
                        onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
                      />
                    </div>

                    <div className="mt-4">
                      <label htmlFor="video" className="block text-sm font-medium text-gray-700">
                        {t('video')}
                      </label>
                      <input
                        type="file"
                        name="video"
                        id="video"
                        accept="video/*"
                        onChange={(e) => setVideoFile(e.target.files ? e.target.files[0] : null)}
                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
                      />
                    </div>

                    <div className="mt-2">
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                        {t('price')}
                      </label>
                      <input
                        type="number"
                        name="price"
                        id="price"
                        value={newServiceData.price}
                        onChange={(e) => handleInputChange('price', e.target.value)}
                        className="mt-1 block w-full rounded-md border border-black px-3 py-2 focus:outline-none sm:text-sm"
                        placeholder="100"
                      />
                    </div>

                    <div className="mt-2">
                      <label htmlFor="term" className="block text-sm font-medium text-gray-700">
                        {t('term')}
                      </label>
                      <input
                        type="text"
                        name="term"
                        id="term"
                        value={newServiceData.term}
                        onChange={(e) => handleInputChange('term', e.target.value)}
                        className="mt-1 block w-full rounded-md border border-black px-3 py-2 focus:outline-none sm:text-sm"
                        placeholder="e.g., 30"
                      />
                    </div>

                    <div className="mt-2">
                      <label htmlFor="termUnit" className="block text-sm font-medium text-gray-700">
                        {t('termUnit')}
                      </label>
                      <select
                        id="termUnit"
                        name="termUnit"
                        value={newServiceData.termUnit}
                        onChange={(e) => handleInputChange('termUnit', e.target.value)}
                        className="mt-1 block w-full rounded-md border border-black px-3 py-2 focus:outline-none sm:text-sm"
                      >
                        {termUnits.map((tu) => (
                          <option key={tu.value} value={tu.value}>
                            {tu.text}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mt-4">
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                        {t('category')}
                      </label>
                      <select
                        id="category"
                        name="category"
                        value={newServiceData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        className="mt-1 block w-full rounded-md border border-black px-3 py-2 focus:outline-none sm:text-sm"
                      >
                        <option value="">{t('selectCategory')}</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.name}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mt-4">
                      <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700">
                        {t('subcategory')}
                      </label>
                      <select
                        id="subcategory"
                        name="subcategory"
                        value={newServiceData.subcategory}
                        onChange={(e) => handleInputChange('subcategory', e.target.value)}
                        className="mt-1 block w-full rounded-md border border-black px-3 py-2 focus:outline-none sm:text-sm"
                        disabled={!newServiceData.category}
                      >
                        <option value="">{t('selectSubcategory')}</option>
                        {selectedCategoryObject?.subCategories.map((sub) => (
                          <option key={sub.id} value={sub.name}>
                            {sub.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mt-4">
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                        {t('status')}
                      </label>
                      <select
                        id="status"
                        name="status"
                        value={newServiceData.isActive ? 'Active' : 'Inactive'}
                        onChange={(e) => handleInputChange('isActive', e.target.value === 'Active')}
                        className="mt-1 block w-full rounded-md border border-black px-3 py-2 focus:outline-none sm:text-sm"
                      >
                        <option value="Active">{t('active')}</option>
                        <option value="Inactive">{t('inactive')}</option>
                      </select>
                    </div>

                    {newServiceData.details.map((detail, index) => (
                      <div key={index} className="mt-4 border-t pt-4 first:mt-2 first:border-t-0">
                        <div className="flex justify-between items-center">
                          <h4 className="text-md font-medium text-gray-900">
                            {t('serviceDetails')} ({detail.lang.toUpperCase()})
                          </h4>
                          {newServiceData.details.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveLanguage(index)}
                              className="text-red-600 hover:text-red-800"
                              aria-label={t('delete')}
                            >
                              <XMarkIcon className="h-5 w-5" />
                            </button>
                          )}
                        </div>

                        <div className="mt-2">
                          <label htmlFor={`name-${index}`} className="block text-sm font-medium text-gray-700">
                            {t('serviceName')} ({detail.lang.toUpperCase()})
                          </label>
                          <input
                            type="text"
                            name={`name-${index}`}
                            id={`name-${index}`}
                            value={detail.name}
                            onChange={(e) => handleInputChange('name', e.target.value, index)}
                            className="mt-1 block w-full rounded-md border border-black px-3 py-2 focus:outline-none sm:text-sm"
                            placeholder={String(t('serviceNamePlaceholder'))}
                          />
                        </div>

                        <div className="mt-2">
                          <label htmlFor={`description-${index}`} className="block text-sm font-medium text-gray-700">
                            {t('serviceDescription')} ({detail.lang.toUpperCase()})
                          </label>
                          <textarea
                            id={`description-${index}`}
                            name={`description-${index}`}
                            rows={3}
                            value={detail.description}
                            onChange={(e) => handleInputChange('description', e.target.value, index)}
                            className="mt-1 block w-full rounded-md border border-black px-3 py-2 focus:outline-none sm:text-sm"
                            placeholder={String(t('serviceDescriptionPlaceholder'))}
                          />
                        </div>

                        <div className="mt-2">
                          <label htmlFor={`lang-${index}`} className="block text-sm font-medium text-gray-700">
                            {t('language')}
                          </label>
                          <select
                            name={`lang-${index}`}
                            id={`lang-${index}`}
                            value={detail.lang}
                            onChange={(e) => handleInputChange('lang', e.target.value, index)}
                            className="mt-1 block w-full rounded-md border border-black px-3 py-2 focus:outline-none sm:text-sm"
                          >
                            {allLangs.map((langInfo) => (
                              <option
                                key={langInfo.code}
                                value={langInfo.code}
                                disabled={newServiceData.details.some((d, i) => i !== index && d.lang === langInfo.code)}
                              >
                                {langInfo.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={handleAddLanguage}
                      title={t('addLanguage')}
                      disabled={!canAddLanguage}
                      className="mt-4 inline-flex justify-center rounded-full border border-gray-300 shadow-sm p-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">{t('addLanguage')}</span>
                      <PlusIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleSaveService}
                  disabled={isSaving}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-cyan-600 text-base font-medium text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  {t('save')}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {t('cancel')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
