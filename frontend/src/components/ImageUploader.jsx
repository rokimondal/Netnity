import React, { useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { CloudUpload } from 'lucide-react';
import { getSecret, updateUploadImage } from '../lib/api';
import toast from 'react-hot-toast';
import useUploadImage from '../hooks/useUploadImage';

const ImageUploader = ({ onClose, uploadprofile }) => {

  const { uploadingImage, uploading } = useUploadImage({
    onSuccess: async (data) => {
      try {
        await updateUploadImage({ publicId: data.public_id, url: data.secure_url });
        uploadprofile(data.secure_url);
        onClose(); // only if everything succeeds
      } catch (err) {
        console.error(err);
        toast.error("Please try again.");
      }
    },
    onError: (error) => {
      console.log(error);
      toast.error("Failed to upload");
    }
  })

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;
    try {
      const secret = await getSecret();
      uploadingImage({ file, secret });
    } catch (error) {
      toast.error("Failed to upload");
      console.error(error);
    }
  }, [onClose]);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
  } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/jpg': [],
      'image/webp': [],
    },
    maxFiles: 1,
  });

  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
      onClick={handleBackgroundClick}
    >
      <div className="bg-white dark:bg-base-100 p-6 rounded-xl shadow-xl w-full max-w-72 md:max-w-3xl  lg:max-w-5xl ">
        <h2 className="text-sm md:text-base font-semibold text-center text-gray-800 dark:text-gray-100 mb-4 ">
          Upload Profile Picture
        </h2>

        <div
          {...getRootProps()}
          className="border-2 border-dashed border-primary rounded-lg p-8 text-center cursor-pointer transition hover:bg-primary/5 h-64 md:h-96"
        >
          <input {...getInputProps()} />
          {uploading ? (
            <div className='w-full h-full flex items-center justify-center'>
              <span className="loading loading-dots loading-xl" />
            </div>
          ) : isDragActive ? (
            <p className="text-blue-600 font-medium">Drop the image here...</p>
          ) : (
            <div className='flex flex-col items-center justify-center h-full'>
              <CloudUpload className="mx-auto mb-2 size-6 text-gray-400" />
              <p className="text-gray-700 dark:text-gray-300 font-normal md:font-medium ">
                Drag & drop an image
              </p>
              <p className="text-sm text-gray-400 mt-1">or click to browse</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
