import { useAtomValue, useSetAtom } from 'jotai'
import { croppedImageAtom, startPoseLandmarksAtom } from '../../atom'
import { useCallback, useEffect, useRef } from 'react'
import { DrawingUtils, PoseLandmarker } from '@mediapipe/tasks-vision'
import useStartPoseLandMarker from '../StartHooks'

export default function StartPoseLandmarkPreview() {
  const croppedImage = useAtomValue(croppedImageAtom)
  const [poseLandmarkerResult, setImageSrc] = useStartPoseLandMarker()
  const poseLandmarkRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  const setStartPoseLandmarks = useSetAtom(startPoseLandmarksAtom)

  const drawLandmarks = useCallback(() => {
    const canvas = poseLandmarkRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    // console.log(canvas.clientHeight, canvas.clientWidth)
    canvas.height = canvas.clientHeight
    canvas.width = canvas.clientWidth

    if (!ctx) return
    const drawingUtils = new DrawingUtils(ctx)
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)
    if (!poseLandmarkerResult) return

    console.log('drawing startLandmark')
    setStartPoseLandmarks({
      worldLandmarks: poseLandmarkerResult.worldLandmarks[0] ?? [],
      normalizedLandmarks: poseLandmarkerResult.landmarks[0] ?? [],
    })
    for (const landmark of poseLandmarkerResult.landmarks ?? []) {
      drawingUtils.drawLandmarks(landmark, {
        radius: (data) => DrawingUtils.lerp(data.from!.z, -0.15, 0.1, 5, 1),
      })
      drawingUtils.drawConnectors(landmark, PoseLandmarker.POSE_CONNECTIONS, {})
    }
  }, [poseLandmarkerResult, setStartPoseLandmarks])

  useEffect(() => {
    const canvas = poseLandmarkRef.current
    if (!canvas) return
    poseLandmarkRef.current
      ?.getContext('2d')
      ?.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)
    if (!croppedImage) return
    setImageSrc(croppedImage)
    drawLandmarks()
  }, [croppedImage, drawLandmarks, setImageSrc])

  return (
    <div
      className={`flex flex-col gap-6 rounded-lg ${!croppedImage ? 'border' : ''}`}
    >
      <div className='flex h-[320px] items-center justify-center overflow-hidden rounded-lg md:h-[400px] lg:h-[500px]'>
        {croppedImage && (
          <>
            <img
              ref={imgRef}
              src={croppedImage}
              className='absolute flex h-[320px] self-center overflow-hidden rounded-lg border object-contain md:h-[400px] lg:h-[500px]'
            />
            <canvas
              ref={poseLandmarkRef}
              className='absolute flex aspect-[11/16] h-[320px] self-center overflow-hidden rounded-lg border object-contain md:h-[400px] lg:h-[500px]'
            />
          </>
        )}
        {!croppedImage && <div className='text-sm '>Pose Landmark Preview</div>}
      </div>
    </div>
  )
}
