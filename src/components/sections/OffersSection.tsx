'use client';

import Image from 'next/image';
import Slider from 'react-slick';

const staticOffers = [
  { id: 1, imageUrl: "/images/offers/vip-22.png" },
  { id: 2, imageUrl: "/images/offers/Painting.png" },
  { id: 3, imageUrl: "/images/offers/Exterior-Cleanig.png" },
  { id: 4, imageUrl: "/images/offers/Cleaning-discount.png" },
];

export default function OffersSection() {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 1 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <section className="bg-gray-100 py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mt-16">
          <Slider {...sliderSettings}>
            {staticOffers.map((offer) => (
              <div key={offer.id} className="px-2">
                <div className="relative">
                  <Image
                    src={offer.imageUrl}
                    alt=""
                    width={480}
                    height={220}
                    className="rounded-lg object-cover"
                  />
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
}