'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import CloudinaryUploadWidget, {
  CloudinaryUploadResult,
} from '@/components/CloudinaryUploadWidget';

interface Promocode {
  id: number;
  code: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function AddOfferPage() {
  const t = useTranslations('SuperAdminAddOfferPage');
  const router = useRouter();

  const [promocodes, setPromocodes] = useState<Promocode[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [link, setLink] = useState('#');
  const [promocodeId, setPromocodeId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchPromocodes = async () => {
      try {
        const response = await axios.get<Promocode[]>(
          `${API_URL}/api/promocodes/all`
        );
        setPromocodes(response.data);
      } catch (err) {
        console.error('Failed to fetch promocodes:', err);
        setError(t('errorFetchPromocodes'));
      }
    };
    fetchPromocodes();
  }, [t]);

  const handleUploadSuccess = (result: CloudinaryUploadResult) => {
    setImageUrl(result.secure_url);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!imageUrl || !promocodeId || !startDate || !endDate) {
      setError(t('errorAllFields'));
      setIsSubmitting(false);
      return;
    }

    try {
      const offerData = {
        imageUrl,
        link,
        promocodeId: parseInt(promocodeId, 10),
        isActive: true,
        startDate,
        endDate,
      };

      await axios.post(`${API_URL}/api/offers`, offerData);
      // On success, you can redirect to an offers list page
      // router.push('/superadmin/offers');
      alert('Offer created successfully!');
      router.back();
    } catch (err) {
      console.error('Failed to create offer:', err);
      setError((err as Error).message || t('errorCreateOffer'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl rounded-lg bg-white p-8 shadow-md">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">{t('title')}</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('offerImage')}
          </label>
          <div className="mt-1">
            <CloudinaryUploadWidget
              cloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!}
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!}
              onUploadSuccess={handleUploadSuccess}
            >
              {({ open, isLoading }) => (
                <button type="button" onClick={open} disabled={isLoading} className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                  {isLoading ? 'Loading...' : t('uploadOfferImage')}
                </button>
              )}
            </CloudinaryUploadWidget>
          </div>
          {imageUrl && <img src={imageUrl} alt="Offer preview" className="mt-4 h-32 w-auto" />}
        </div>

        <div>
          <label htmlFor="link" className="block text-sm font-medium text-gray-700">{t('destinationUrl')}</label>
          <input type="url" name="link" id="link" value={link} onChange={(e) => setLink(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm" />
        </div>

        <div>
          <label htmlFor="promocodeId" className="block text-sm font-medium text-gray-700">{t('promocode')}</label>
          <select id="promocodeId" value={promocodeId} onChange={(e) => setPromocodeId(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm" required>
            <option value="">{t('selectPromocode')}</option>
            {promocodes.map((p) => (
              <option key={p.id} value={p.id}>{p.code}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">{t('startDate')}</label>
            <input type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm" required />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">{t('endDate')}</label>
            <input type="date" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm" required />
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex items-center justify-end gap-4 pt-4">
          <button type="button" onClick={() => router.back()} className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
            {t('cancel')}
          </button>
          <button type="submit" disabled={isSubmitting} className="rounded-md border border-transparent bg-cyan-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50">
            {isSubmitting ? t('saving') : t('saveOffer')}
          </button>
        </div>
      </form>
    </div>
  );
}