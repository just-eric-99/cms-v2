import { Button } from '@/components/ui/button'
import UploadVideoComponent from './components/upload-video'
import FrameSelector from './components/frame-selector'
import { useAtom, useSetAtom } from 'jotai'
import {
  croppedImageAtom,
  openReadyDialogAtom,
  readyPoseLandmarksAtom,
  uploadFileAtom,
} from '../atom'
import { useFormContext } from 'react-hook-form'
import { createExerciseSchema } from '../../_data/schema'
import { z } from 'zod'
import ReadyPoseLandmarkPreview from './components/poselandmark-preview'

export default function ReadySelectPoseDialog() {
  const form = useFormContext<z.infer<typeof createExerciseSchema>>()
  const [uploadFile] = useAtom(uploadFileAtom)
  const setCroppedImage = useSetAtom(croppedImageAtom)

  const [readyPoseLandmarks] = useAtom(readyPoseLandmarksAtom)

  const setOpenDialog = useSetAtom(openReadyDialogAtom)

  const onDone = () => {
    console.log('inside done')
    console.log('readyPoseLandmarks:', readyPoseLandmarks)

    form.setValue('readyLandmark', {
      ...form.getValues('readyLandmark'),
      normalizedLandmarks: readyPoseLandmarks.normalizedLandmarks,
      worldLandmarks: readyPoseLandmarks.worldLandmarks,
    })

    setOpenDialog(false)
    setCroppedImage(null)
  }

  return (
    <div className='container flex flex-col gap-4'>
      <div className='flex flex-row justify-end gap-4'>
        <Button
          variant={'secondary'}
          onClick={() => {
            setCroppedImage(null)
            setOpenDialog(false)
          }}
        >
          Back
        </Button>
        <Button onClick={onDone}>Done</Button>
      </div>
      <div className='grid grid-cols-5 gap-4'>
        <div className='col-span-3'>
          {!uploadFile && <UploadVideoComponent />}
          {uploadFile && <FrameSelector />}
        </div>
        <div className='col-span-2'>
          <ReadyPoseLandmarkPreview />
        </div>
      </div>
    </div>
  )
}
