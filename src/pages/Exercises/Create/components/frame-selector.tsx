import getCroppedImg from '@/utils/crop-image'
import { useAtom, useSetAtom } from 'jotai'
import { createRef, useEffect, useMemo, useState } from 'react'
import Cropper, { Area, Point } from 'react-easy-crop'
import { croppedImageAtom, uploadFileAtom } from '../atom'
import { Button } from '@/components/ui/button'
import FrameSlider from './frame-slider'
import { Trash2 } from 'lucide-react'

export default function FrameSelector() {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const setCroppedImage = useSetAtom(croppedImageAtom)
  const [duration, setDuration] = useState(0)
  const cropperRef = useMemo(() => createRef<Cropper>(), [])
  const [uploadFile, setUploadFile] = useAtom(uploadFileAtom)
  const [selectedVideo, setSelectedVideo] = useState<string>('')

  useEffect(() => {
    const video = cropperRef.current?.videoRef.current
    if (!video) return
    video.onloadedmetadata = () => {
      setDuration(video.duration)
    }
  }, [cropperRef, selectedVideo])

  useEffect(() => {
    if (!uploadFile) return
    setSelectedVideo(URL.createObjectURL(uploadFile))
  }, [uploadFile])

  const onCropComplete = async (
    croppedPoints: Area,
    croppedAreaPixels: Area
  ) => {
    console.log(croppedPoints, croppedAreaPixels)
    setCroppedAreaPixels(croppedAreaPixels)
  }

  const cropImage = async () => {
    const video = cropperRef.current?.videoRef.current
    if (!video || !croppedAreaPixels) return
    const temp = await getCroppedImg(video, croppedAreaPixels, 0)
    setCroppedImage(temp)
  }

  return (
    <div className='flex flex-col justify-center gap-6 '>
      <div className='relative h-[320px] overflow-hidden rounded-lg border md:h-[400px] lg:h-[500px]'>
        {uploadFile && (
          <Cropper
            ref={cropperRef}
            onCropAreaChange={(area) => {
              console.log(area)
            }}
            style={{
              containerStyle: {
                minWidth: '100%',
                minHeight: '100%',
              },
              mediaStyle: {
                objectFit: 'contain',
              },
              cropAreaStyle: {
                borderColor: 'white',
                borderWidth: 2,
              },
            }}
            showGrid={false}
            video={selectedVideo}
            crop={crop}
            zoom={zoom}
            aspect={11 / 16}
            onCropChange={setCrop}
            onCropComplete={(area, croppedAreaPixels) =>
              onCropComplete(area, croppedAreaPixels)
            }
            onZoomChange={setZoom}
            mediaProps={{
              crossOrigin: 'anonymous',
              autoPlay: false,
              playsInline: true,
              loop: false,
              controls: true,
              muted: true,
            }}
          />
        )}
        <Button
          size={'icon'}
          variant='destructive'
          className='absolute right-2 top-2'
          onClick={() => {
            setUploadFile(null)
            setCroppedImage(null)
          }}
        >
          <Trash2 />
        </Button>
      </div>
      <div className='relative flex w-full items-center gap-8 pb-14'>
        <FrameSlider
          duration={duration}
          onPointerDown={() => {}}
          onValueChange={() => {}}
          onValueCommit={(value) => {
            cropperRef.current!.videoRef.current!.currentTime = value
          }}
        />
        <Button onClick={cropImage}>Select</Button>
      </div>
    </div>
  )
}
