import { useState, useEffect, useCallback } from 'react'

type ImageUploaderProps = {
  maxSize: number;
  allowedFileTypes: string[];
  initialSrc: string;
  onChange: (files: FileList | null) => void;
}

const useImageUploader = ({ 
  maxSize, 
  allowedFileTypes, 
  initialSrc, 
  onChange 
}: ImageUploaderProps) => {
  const [fileError, setFileError] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    // Debug log
    console.log('useImageUploader initialSrc:', initialSrc);
  }, [initialSrc]);

  // Cleanup function to revoke object URLs
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        console.log('Cleaning up blob URL:', previewUrl);
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const validateFile = useCallback((file: File): string | null => {
    const fsize = Math.round(file.size / 1024);
    
    if (fsize > maxSize) {
      return `Files cannot exceed ${maxSize} KB`;
    }
    
    if (!allowedFileTypes.includes(file.type)) {
      return `You can upload the following types: ${allowedFileTypes.join(', ')}`;
    }
    
    return null;
  }, [maxSize, allowedFileTypes]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    // Clean up previous preview URL if it exists
    if (previewUrl && previewUrl.startsWith('blob:')) {
      console.log('Cleaning up previous blob URL:', previewUrl);
      URL.revokeObjectURL(previewUrl);
    }
    console.log('File change event triggered');
    setPreviewUrl(null);
    setFileError("");
    const files = e.target.files;

    if (files && files.length > 0) {
      const file = files[0];
      console.log('Selected file:', file);
      
      const error = validateFile(file);

      if (error) {
        setFileError(error);
        setPreviewUrl(null);
        onChange(null);
        return;
      }

      try {
        const newPreviewUrl = URL.createObjectURL(file);
        console.log('Created new blob URL:', newPreviewUrl);
        setPreviewUrl(newPreviewUrl);
        setFileError("");
        onChange(files);
      }

      catch {
        setFileError('Failed to create preview for the selected file');
        onChange(null);
      }
    } else {
      setPreviewUrl(null);
      onChange(null);
    }
  }, [validateFile, onChange, previewUrl]);

  return {
    previewUrl,
    fileError,
    handleFileChange
  };
};

export default useImageUploader;