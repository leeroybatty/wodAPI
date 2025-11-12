import React from "react";
import Thumbnail from "./Thumbnail";
import "./Gallery.css";
import { Badge, Button } from "../Button";

console.log(Badge);

type GalleryProps = {
  thumbnails: { id: number; imageUrl: string; title?: string; altText?: string  }[];
 };

const Gallery: React.FC<GalleryProps> = ({
  thumbnails,
 }) => {


  return (
    <div className="gallery">
      {thumbnails?.map((thumbnail) => (
          <Thumbnail
            key={thumbnail.id}
            src={thumbnail.imageUrl}
            title={thumbnail.title}
            altText={thumbnail.altText}
            id={thumbnail.id}
            link={thumbnail.link}
          />
      ))}
    </div>
  );
};

export default Gallery;
