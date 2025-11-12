import React from 'react'
import classNames from 'classnames'
import './Image.css'

export interface CoverThumbnailProps {
  id?: string;
  alt?: string;
  src?: string;
  width?: number;
  height?: number;
  flexible?: boolean;
  size: 'small' | 'medium' | 'large'
  title: string;
  rating: string;
  }

const CoverThumbnail: React.FC<CoverThumbnailProps> = ({
  id = "",
  src = "",
  alt = "",
  width,
  height,
  size = 'small',
  title = "",
  flexible = false,
  rating = ""
}) => {

  return (
    <div id={id} className='gallery_tile'>
      <div className={classNames({
        "image" : true,
        "CoverImage": true,
        "Small": size === "small",
        "Large": size === "large",
        "Medium": size === "medium"
      })}>
        <img 
          src={src} 
          alt={alt}
          width={width}
          height={height}
          className="image_image" />
      </div>
      <div>
        <span>{title}</span>
        <span>{rating}</span>
      </div>
    </div>
  )
}

export default CoverThumbnail;