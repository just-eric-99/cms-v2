import { useEffect, useState } from 'react'
import {
  FilesetResolver,
  PoseLandmarker,
  PoseLandmarkerResult,
} from '@mediapipe/tasks-vision'

export default function useStartPoseLandMarker(): [
  PoseLandmarkerResult | undefined,
  (imageSrc: string) => void,
] {
  const [poseLandmarker, setPoseLandmarker] = useState<PoseLandmarker>()
  const [imageSrc, setImageSrc] = useState<string>()
  const [poseLandmarkerResult, setPoseLandmarkerResult] =
    useState<PoseLandmarkerResult>()

  useEffect(() => {
    FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
    )
      .then((vision) =>
        PoseLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              '/src/assets/pose-landmarker/pose_landmarker_heavy.task',
            delegate: 'GPU',
          },
        })
      )
      .then(setPoseLandmarker)
  }, [])

  useEffect(() => {
    if (!poseLandmarker || !imageSrc) return
    const image = new Image()
    image.src = imageSrc
    image.onload = () => {
      poseLandmarker.detect(image, (result) => setPoseLandmarkerResult(result))
    }
  }, [imageSrc, poseLandmarker])

  return [poseLandmarkerResult, setImageSrc]
}
