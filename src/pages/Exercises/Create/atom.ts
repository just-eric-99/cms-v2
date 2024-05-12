import { store } from '@/state/global'
import { atom } from 'jotai'

export const croppedImageAtom = atom<string | null>(null)
export const uploadFileAtom = atom<File | null>(null)

store.sub(croppedImageAtom, () => {
  console.log('croppedImageAtom changed')
  console.log(store.get(croppedImageAtom))
})
