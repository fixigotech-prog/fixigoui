'use client';

import {useState, useEffect, FormEvent} from 'react';
import axios from 'axios';
import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import CloudinaryUpload from '@/components/CloudnaryUpload';
interface Promocode {
  id: number;
  code: string;
}

interface AddOffers{
  imageUrl: string;
  link: string;
  promocodeId: number,
  isActive: boolean,
  startDate: Date,
  endDate: Date
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function AddOfferPage() {
  const t = useTranslations('SuperAdminAddOfferPage');
  const router = useRouter();

  const [promocodes, setPromocodes] = useState<Promocode[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [link, setLink] = useState('#');
  const [promocodeId, setPromocodeId] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState<string | null>(null);

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

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
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
        isActive,
        startDate,
        endDate,
      };

      await axios.post(`${API_URL}/api/offers`, offerData);

      // On success, redirect to another page (e.g., offers list)
      router.push('/superadmin/offers'); // Adjust this to your offers list page
    } catch (err: any) {
      console.error('Failed to create offer:', err);
      setError(err.message || t('errorCreateOffer'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl rounded-lg bg-white p-8 shadow-md">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">{t('title')}</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="file"
            className="block text-sm font-medium text-gray-700"
          >
            {t('offerImage')}
          </label>
         <CloudinaryUpload onUploadSuccess={(url) => setImageUrl(url)} message={t('uploadOfferImage')} />
        </div>
 <div>
          <label
            htmlFor="link"
            className="block text-sm font-medium text-gray-700"
          >
            {t('destinationUrl')}
          </label>
         <input type='url' name="link" id="link" value={link} onChange={(e) => setLink(e.target.value)}/>
        </div>
        <div>
          <label
            htmlFor="promocodeId"
            className="block text-sm font-medium text-gray-700"
          >
            {t('promocode')}
          </label>
          <select
            id="promocodeId"
            value={promocodeId}
            onChange={(e) => setPromocodeId(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm"
            required
          >
            <option value="">{t('selectPromocode')}</option>
            {promocodes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.code}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-gray-700"
            >
              {t('startDate')}
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-gray-700"
            >
              {t('endDate')}
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm"
              required
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            {t('cancel')}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md border border-transparent bg-cyan-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? t('saving') : t('saveOffer')}
          </button>
        </div>
      </form>
    </div>
  );
}
