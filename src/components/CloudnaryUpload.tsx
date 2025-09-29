"use client"; // if using Next.js app directory

import React, { useState, useRef, useCallback } from "react";
import axios from "axios";
import ReactCrop, { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { toast } from "react-toastify";
import { useDropzone } from "react-dropzone";
import Modal from "react-modal";
import { IoClose } from "react-icons/io5";
import Image from "next/image";

interface CloudinaryUploadProps {
  message?: string;
  onUploadSuccess?: (url: string) => void;
  maxSize?: number; // in bytes, default 5MB
}

const CloudinaryUpload: React.FC<CloudinaryUploadProps> = ({
  message = "Upload file",
  onUploadSuccess,
  maxSize = 5 * 1024 * 1024,
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop | undefined>();
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [croppedBlob, setCroppedBlob] = useState<Blob | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const imgRef = useRef<HTMLImageElement | null>(null);

  const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;
  const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "logopreset";

  const uploadFile = async (file: Blob) => {
    if (!file) return;
    if (file.size > maxSize) {
      toast.error("File size exceeds the limit of 5MB.");
      return;
    }

    setUploading(true);
    setProgress(0);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const response = await axios.post(CLOUDINARY_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgress(percentCompleted);
          }
        },
      });

      const uploadedUrl = response.data.secure_url;
      setImageUrl(uploadedUrl);
      if (onUploadSuccess) onUploadSuccess(uploadedUrl);
    } catch (err: any) {
      console.error("Upload error:", err.response?.data || err.message);
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleFile = (file: File) => {
    if (file && file.size <= maxSize) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageSrc(e.target?.result as string);
        setModalIsOpen(true);
      };
      reader.readAsDataURL(file);
    } else {
      setError("File size exceeds the limit.");
    }
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        handleFile(acceptedFiles[0]);
      }
    },
    [handleFile]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".gif"],
    },
    maxSize,
  });

  const handleCropComplete = (crop: Crop) => {
    if (imgRef.current && crop.width && crop.height) {
      const canvas = document.createElement("canvas");
      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
      canvas.width = crop.width;
      canvas.height = crop.height;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.drawImage(
          imgRef.current,
          crop.x! * scaleX,
          crop.y! * scaleY,
          crop.width * scaleX,
          crop.height * scaleY,
          0,
          0,
          crop.width,
          crop.height
        );
      }

      canvas.toBlob((blob) => {
        if (blob) setCroppedBlob(blob);
      }, "image/jpeg");
    }
  };

  const handleUploadCropped = () => {
    if (croppedBlob) {
      uploadFile(croppedBlob);
      setModalIsOpen(false);
    }
  };

  // Modal accessibility fix (only once on client)
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      Modal.setAppElement("body");
    }
  }, []);

  return (
    <div className="p-4 w-full mx-auto bg-white shadow-lg rounded-lg text-center">
      <div {...getRootProps()} className="p-4 border-2 border-dashed border-gray-500 rounded-lg cursor-pointer">
        <input {...getInputProps()} />
        <p className="text-gray-500 text-md cursor-pointer font-semibold">{message}</p>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50"
      >
        <button onClick={() => setModalIsOpen(false)} className="absolute top-2 right-2 text-gray-600 hover:text-gray-900">
          <IoClose size={24} />
        </button>
        {imageSrc && (
          <div className="mt-4 text-center">
            <ReactCrop crop={crop} onChange={(c) => setCrop(c)} onComplete={handleCropComplete} aspect={1}>
              <img ref={imgRef} src={imageSrc} alt="Crop preview" className="max-w-full max-h-[70vh]" />
            </ReactCrop>
            <button className="mt-2 px-4 py-2 bg-gray-800 text-white rounded" onClick={handleUploadCropped}>
              Upload Cropped Image
            </button>
          </div>
        )}
      </Modal>

      {uploading && <p className="mt-2 text-sm text-gray-500">Uploading... {progress}%</p>}
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      {imageUrl && (
        <div className="mt-2 flex justify-center">
          <Image
            src={imageUrl}
            alt="Uploaded"
            width={64}
            height={64}
            className="rounded-lg shadow-md object-cover"
          />
        </div>
      )}
    </div>
  );
};

export default CloudinaryUpload;