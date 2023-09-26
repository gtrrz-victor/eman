import { ChangeEvent, useEffect, useState } from 'react'
import { Gallery, Image as GalleryImage } from 'react-grid-gallery'
import Lightbox from "react-18-image-lightbox";
import "react-18-image-lightbox/style.css";
import './App.css'
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

function App() {
  const [uploading, setUploading] = useState(false)
  const [photos, setPhotos] = useState<GalleryImage[]>([])
  const [images, setImages] = useState<File[]>([])
  const [index, setIndex] = useState(-1);
  const [currentImage, setCurrentImage] = useState<GalleryImage>()

  const nextIndex = (index + 1) % photos.length;
  const nextImage = photos[nextIndex] || currentImage;
  const prevIndex = (index + photos.length - 1) % photos.length;
  const prevImage = photos[prevIndex] || currentImage;
  const handleClick = (index: number, _: GalleryImage) => setIndex(index);
  const handleClose = () => setIndex(-1);
  const handleMovePrev = () => setIndex(prevIndex);
  const handleMoveNext = () => setIndex(nextIndex);

  const uploadPhotos = () => {
    setUploading(true)
  }

  useEffect(() => {
    const upload = async () => {
      const newphotos = await Promise.all<GalleryImage>(images.map(file => {
        return new Promise((resolve, reject) => {
          const image = new Image()
          image.src = URL.createObjectURL(file)
          image.onload = () => {
            resolve({
              src: image.src,
              height: image.height,
              width: image.width
            })
          }
          image.onerror = (err) => {
            reject(err);
          }
        })
      }))
      setPhotos([...photos, ...newphotos])
    }
    if (images.length < 1) return
    upload()
  }, [images])

  useEffect(() => {
    setCurrentImage(photos[index])
  }, [index])

  function onImageChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files === null) {
      setImages([])
    } else {
      setImages([...e.target.files])
    }
  }

  return (
    <>
      <div>
        <img
          style={{
            width: "100%",
            height: "auto",
          }}
          src="/cover.png"
          alt="We are ready!"
          loading="lazy" />
      </div>
      <p style={{ padding: '5px' }}>
        Elige las fotos del evento que quieras compartir con todos!!
      </p>
      <div>
        <Button variant='outlined' component="label" disabled={uploading}>Agregar fotos
          <VisuallyHiddenInput type="file" onChange={onImageChange} multiple accept='image/*' />
        </Button>
      </div>
      {
        photos.length > 0 && (
          <div style={{ marginTop: '10px' }}>
            <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />} onClick={uploadPhotos}>
              Subir a la galeria
            </Button>
          </div>
        )
      }
      <div style={{ paddingTop: '10px' }}>
        <Gallery images={photos}
          onClick={handleClick}
          enableImageSelection={false} />
      </div>
      {!!currentImage && (
        <Lightbox
          mainSrc={currentImage.src}
          mainSrcThumbnail={currentImage.src}
          nextSrc={nextImage.src}
          nextSrcThumbnail={nextImage.src}
          prevSrc={prevImage.src}
          prevSrcThumbnail={prevImage.src}
          onCloseRequest={handleClose}
          onMovePrevRequest={handleMovePrev}
          onMoveNextRequest={handleMoveNext}
        />
      )}
    </>
  )
}

export default App
