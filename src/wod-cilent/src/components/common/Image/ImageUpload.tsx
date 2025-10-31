import React from 'react'
import useImageUploader from './useImageUploader';
import classNames from 'classnames'
import './Image.css'
import '../Form/Form.css'

export interface ImageUploadProps {
  id?: string;
  alt?: string;
  src?: string;
  maxSize?: number;
  editable?: boolean;
  helperText?: string;
  errorText?: string;
  labelText?: string;
  required?: boolean;
  flexible?: boolean;
  name?: string;
  onChange?: (files: FileList | null) => void;
}

const ImageUpload = ({
  id = "",
  src = "",
  alt = "",
  labelText = "Upload a new image",
  maxSize = 600,
  editable = false,
  errorText = '',
  helperText = '',
  required = false,
  flexible = false,
  name = '',
  onChange = () => {},
}: ImageUploadProps) => {
  const { 
    previewUrl, 
    fileError, 
    handleFileChange 
  } = useImageUploader({
    maxSize,
    allowedFileTypes: ['image/jpeg', 'image/gif', 'image/png', 'image/tiff'],
    initialSrc: src,
    onChange,
  });

  // Use previewUrl if available, otherwise fall back to src prop
  // Ensure we're only using string URLs
  const displayImage = previewUrl || (typeof src === 'string' ? src : '');

  return (
    <>
      <div id={id} className={classNames({
        "image": true,
        "Editable": editable,
        "Flexible": flexible,
        "Error": !!fileError
      })}>
        <div className="image_overlay">
          <input
            id={`${id}-image-upload`}
            className="image_uploader"
            type="file"
            name={name}
            onChange={handleFileChange}
            accept="image/png, image/gif, image/jpg, image/jpeg, image/tiff"
            required={required}
          />
          <label htmlFor={`${id}-image-upload`} className='image_upload-label Editing'>
            <span>{labelText}</span>
          </label>
        </div>

        {displayImage && (
          <img 
            src={displayImage} 
            alt={alt} 
            className="image_image"
          />
        )}
      </div>
      <span className={`form-field_helpertext ${fileError ? 'Error' : ''}`.trim()}>
        {fileError || errorText || helperText}
      </span>
    </>
  )
}

export default ImageUpload