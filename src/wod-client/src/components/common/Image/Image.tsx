import React from 'react'
import classNames from 'classnames'
import './Image.css'

export interface ImageProps {
  id?: string;
  alt?: string;
  src?: string;
  width?: number | "100%";
  height?: number | "100%";
  flexible?: boolean;
  }

const Image = ({
  id = "",
  src = "",
  alt = "",
  width,
  height,
  flexible = false,
}: ImageProps) => {

  return (
    <div id={id} className={classNames({
      "image" : true,
      "Flexible": flexible
    })}>
      <img 
        src={src} 
        alt={alt}
        width={width}
        height={height}
        className="image_image" />
    </div>
  )
}

export default Image;