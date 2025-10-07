'use client';

import { useEffect, useRef } from 'react';

interface GoogleMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  height?: string;
  onLocationSelect?: (location: { lat: number; lng: number; address: string }) => void;
  markers?: Array<{ lat: number; lng: number; title?: string }>;
}

declare global {
  interface Window {
    google: any;
  }
}

export default function GoogleMap({ 
  center = { lat: 28.6139, lng: 77.2090 }, 
  zoom = 10, 
  height = '400px',
  onLocationSelect,
  markers = []
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    loadGoogleMaps();
  }, []);

  useEffect(() => {
    if (mapInstance.current && markers.length > 0) {
      // Clear existing markers
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];

      // Add new markers
      markers.forEach(markerData => {
        const marker = new window.google.maps.Marker({
          position: { lat: markerData.lat, lng: markerData.lng },
          map: mapInstance.current,
          title: markerData.title || '',
        });
        markersRef.current.push(marker);
      });
    }
  }, [markers]);

  const loadGoogleMaps = () => {
    if (window.google) {
      initializeMap();
      return;
    }
    
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.onload = initializeMap;
    document.head.appendChild(script);
  };

  const initializeMap = () => {
    if (!mapRef.current || !window.google) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center,
      zoom,
    });

    mapInstance.current = map;

    if (onLocationSelect) {
      map.addListener('click', (event: any) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results: any, status: any) => {
          if (status === 'OK' && results[0]) {
            onLocationSelect({ lat, lng, address: results[0].formatted_address });
          }
        });
      });
    }
  };

  return <div ref={mapRef} style={{ width: '100%', height }} className="rounded-lg" />;
}