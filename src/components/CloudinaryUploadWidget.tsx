import React, { useState, useEffect, useCallback } from 'react';

// Define the global cloudinary object that the script will attach to the window
declare global {
  interface Window {
    cloudinary: any;
  }
}

interface CloudinaryUploadWidgetProps {
  cloudName: string;
  uploadPreset: string;
  onUploadSuccess: (result: CloudinaryUploadResult) => void;
  children: (args: { open: () => void; isLoading: boolean }) => React.ReactNode;
}

export interface CloudinaryUploadResult {
  public_id: string;
  version: number;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  original_filename: string;
}

const CloudinaryUploadWidget: React.FC<CloudinaryUploadWidgetProps> = ({
  cloudName,
  uploadPreset,
  onUploadSuccess,
  children,
}) => {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [widgetInstance, setWidgetInstance] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  // Effect to load the Cloudinary script
  useEffect(() => {
    if (window.cloudinary) {
      setIsScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://upload-widget.cloudinary.com/global/all.js';
    script.async = true;
    script.onload = () => setIsScriptLoaded(true);
    script.onerror = () => setError('Failed to load Cloudinary Upload Widget.');

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Effect to create the widget instance once the script is loaded
  useEffect(() => {
    if (isScriptLoaded && !widgetInstance) {
      const widget = window.cloudinary.createUploadWidget(
        {
          cloudName: cloudName,
          uploadPreset: uploadPreset,
          // Add more options here to customize the widget
          // e.g., cropping: true, sources: ['local', 'url', 'camera'], multiple: false
          cropping: true,
          showAdvancedOptions: true,
          styles: {
            palette: {
              window: '#FFFFFF',
              windowBorder: '#90A0B3',
              tabIcon: '#0078FF',
              menuIcons: '#5A616A',
              textDark: '#000000',
              textLight: '#FFFFFF',
              link: '#0078FF',
              action: '#FF620C',
              inactiveTabIcon: '#0E2F5A',
              error: '#F44235',
              inProgress: '#0078FF',
              complete: '#20B832',
              sourceBg: '#E4EBF1',
            },
          },
        },
        (err: any, result: any) => {
          if (err) {
            console.error('Upload Widget error:', err);
            setError('An error occurred during upload.');
            setIsLoading(false);
            return;
          }

          if (result.event === 'show') {
            setIsLoading(true);
          }

          if (result.event === 'close') {
            setIsLoading(false);
          }

          if (result.event === 'success') {
            setIsLoading(false);
            setError(null);
            setUploadedImageUrl(result.info.secure_url);
            onUploadSuccess(result.info as CloudinaryUploadResult);
          }
        }
      );
      setWidgetInstance(widget);
    }
  }, [isScriptLoaded, widgetInstance, cloudName, uploadPreset, onUploadSuccess]);

  const openWidget = useCallback(() => {
    if (widgetInstance) {
      widgetInstance.open();
    }
  }, [widgetInstance]);

  return (
    <div style={{ fontFamily: 'sans-serif', textAlign: 'center', marginTop: '2rem' }}>
      <h3>Cloudinary Image Upload</h3>
      {children({ open: openWidget, isLoading: isLoading || !isScriptLoaded })}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {uploadedImageUrl && (
        <div style={{ marginTop: '2rem' }}>
          <h4>Upload Successful!</h4>
          <img
            src={uploadedImageUrl}
            alt="Uploaded"
            style={{ maxWidth: '400px', height: 'auto', border: '1px solid #ccc', padding: '5px' }}
          />
          <p>
            <a href={uploadedImageUrl} target="_blank" rel="noopener noreferrer">
              View full size image
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default CloudinaryUploadWidget;