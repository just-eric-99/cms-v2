import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import UploadVideoComponent from './components/upload-video'
import FrameSelector from './components/frame-selector'
import PoseLandmarkPreview from './components/poselandmark-preview'
import { useAtom, useSetAtom } from 'jotai'
import {
  croppedImageAtom,
  openDialogAtom,
  readyPoseLandmarksAtom,
  startPoseLandmarksAtom,
  uploadFileAtom,
} from './atom'
import { useFormContext } from 'react-hook-form'
import { createExerciseSchema } from '../_data/schema'
import { z } from 'zod'

type SelectPoseDialogProps = {
  landmarkName: 'readyLandmark' | 'startLandmark'
}

export default function SelectPoseDialog(props: SelectPoseDialogProps) {
  const form = useFormContext<z.infer<typeof createExerciseSchema>>()
  const [uploadFile, setUploadFile] = useAtom(uploadFileAtom)
  const setCroppedImage = useSetAtom(croppedImageAtom)

  const [readyPoseLandmarks] = useAtom(readyPoseLandmarksAtom)
  const [startPoseLandmarks] = useAtom(startPoseLandmarksAtom)

  const setOpenDialog = useSetAtom(openDialogAtom)

  const onDone = () => {
    console.log('inside done')
    console.log('readyPoseLandmarks:', readyPoseLandmarks)
    console.log('startPoseLandmarks:', startPoseLandmarks)

    if (props.landmarkName === 'readyLandmark') {
      console.log('setting readyLandmark')
      form.setValue('readyLandmark', {
        ...form.getValues('readyLandmark'),
        normalizedLandmarks: readyPoseLandmarks.normalizedLandmarks,
        worldLandmarks: readyPoseLandmarks.worldLandmarks,
      })
    } else {
      console.log('setting startLandmark')
      form.setValue('startLandmark', {
        ...form.getValues('startLandmark'),
        normalizedLandmarks: startPoseLandmarks.normalizedLandmarks,
        worldLandmarks: startPoseLandmarks.worldLandmarks,
      })
    }
    setOpenDialog(false)
    setCroppedImage(null)
  }

  return (
    <div className='container flex flex-col gap-4'>
      <div className='flex flex-row justify-end gap-4'>
        <Link to={'/exercises'}>
          <Button
            variant={'secondary'}
            onClick={() => {
              setUploadFile(null)
              setCroppedImage(null)
            }}
          >
            Back
          </Button>
        </Link>
        <Button onClick={onDone}>Done</Button>
      </div>
      <div className='grid grid-cols-5 gap-4'>
        <div className='col-span-3'>
          {!uploadFile && <UploadVideoComponent />}
          {uploadFile && <FrameSelector />}
        </div>
        <div className='col-span-2'>
          <PoseLandmarkPreview landmarkName={props.landmarkName} />
        </div>
      </div>
    </div>
  )
}
