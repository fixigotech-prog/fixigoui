'use client';

import { useState } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';

export default function LocationInput() {
  const [location, setLocation] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [showPopup, setShowPopup] = useState<boolean>(false);

  const getLocation = async () => {
    setIsLoading(true);
    setError('');

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position: GeolocationPosition) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
            {
              headers: {
                'User-Agent': 'YourAppName/1.0 (your@email)',
              },
            }
          );

          if (!res.ok) throw new Error('Reverse geocoding failed');
          const data = await res.json();
          const address = data.display_name || `${latitude}, ${longitude}`;
          setLocation(address);
        } catch (err) {
          setLocation(`${latitude}, ${longitude}`);
        } finally {
          setIsLoading(false);
          setShowPopup(false);
        }
      },
      (err: GeolocationPositionError) => {
        setError('Unable to retrieve your location');
        setIsLoading(false);
        setShowPopup(false);
      }
    );
  };

  const handleInputClick = () => {
    setShowPopup(true);
    getLocation();
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 relative">
      
      <div className="relative">
        {/* Location Icon */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
          <FaMapMarkerAlt />
        </div>

        {/* Input Field */}
        <input
          type="text"
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Tap to detect location"
          value={location}
          onClick={handleInputClick}
          readOnly
        />
      </div>

      {/* Popup Overlay */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-xs">
            {isLoading ? (
              <>
                <div className="animate-spin h-8 w-8 mx-auto mb-4 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                <p className="text-sm text-gray-700">Detecting your location...</p>
              </>
            ) : error ? (
              <>
                <p className="text-red-500 text-sm mb-4">{error}</p>
                <button
                  onClick={() => {
                    setShowPopup(false);
                    setError('');
                  }}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Close
                </button>
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
