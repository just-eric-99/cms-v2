import { store } from '@/state/global'
import { Landmark, NormalizedLandmark } from '@mediapipe/tasks-vision'
import { atom } from 'jotai'

export const croppedImageAtom = atom<string | null>(null)
export const uploadFileAtom = atom<File | null>(null)
export const currentPoseLandmarksAtom = atom<{
  normalizedLandmarks: NormalizedLandmark[][]
  worldLandmarks: Landmark[][]
}>({
  normalizedLandmarks: [],
  worldLandmarks: [],
})

store.sub(croppedImageAtom, () => {
  console.log('croppedImageAtom changed')
  console.log(store.get(croppedImageAtom))
})
