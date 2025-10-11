'use client';

import GoogleMap from '@/components/GoogleMap';

export default function ServiceAreasSection() {
  return (
    <section className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Our Service Areas
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            We provide quality home services across major cities. Find us near you.
          </p>
        </div>
        <div className="mt-16">
          <GoogleMap 
            center={{ lat: 28.6139, lng: 77.2090 }}
            zoom={6}
            height="500px"
            markers={[
              { lat: 12.9716, lng: 77.5946, title: 'Bangalore' },
              { lat: 17.3850, lng: 78.4867, title: 'Hyderabad' }
            ]}
          />
        </div>
      </div>
    </section>
  );
}