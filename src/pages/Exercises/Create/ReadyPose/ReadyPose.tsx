import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { useFormContext } from 'react-hook-form'
import { createExerciseSchema } from '../../_data/schema'
import { z } from 'zod'
import { FormField } from '@/components/ui/form'
import { Slider } from '@/components/ui/slider'
import { useEffect, useRef } from 'react'
import { useAtom } from 'jotai'
import { openReadyDialogAtom, readyPoseLandmarksAtom } from '../atom'
import { DrawingUtils, PoseLandmarker } from '@mediapipe/tasks-vision'
import ReadySelectPoseDialog from './ReadyDialog'

const landmarkBodyParts = [
  { index: 0, name: 'Face' },
  { index: 1, name: 'Spine' },
  { index: 2, name: 'Left Shoulder' },
  { index: 3, name: 'Right Shoulder' },
  { index: 4, name: 'Left Elbow' },
  { index: 5, name: 'Right Elbow' },
  { index: 6, name: 'Left Hip' },
  { index: 7, name: 'Right Hip' },
  { index: 8, name: 'Left Knee' },
  { index: 9, name: 'Right Knee' },
  { index: 10, name: 'Left Foot' },
  { index: 11, name: 'Right Foot' },
]

export default function ReadyPose() {
  const poseLandmarkRef = useRef<HTMLCanvasElement>(null)
  const form = useFormContext<z.infer<typeof createExerciseSchema>>()
  const [openDialog, setOpenDialog] = useAtom(openReadyDialogAtom)
  const [readyPoseLandmarks] = useAtom(readyPoseLandmarksAtom)

  useEffect(() => {
    const drawLandmarks = () => {
      const canvas = poseLandmarkRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      console.log(canvas.clientHeight, canvas.clientWidth)
      canvas.height = canvas.clientHeight
      canvas.width = canvas.clientWidth

      if (!ctx) return
      const drawingUtils = new DrawingUtils(ctx)
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)
      const normalizedLandmarks = readyPoseLandmarks.normalizedLandmarks
      console.log('its readyLandmark')
      if (normalizedLandmarks.length === 0) return
      for (const landmark of [normalizedLandmarks]) {
        drawingUtils.drawLandmarks(landmark, {
          radius: (data) => DrawingUtils.lerp(data.from!.z, -0.15, 0.1, 5, 1),
        })
        drawingUtils.drawConnectors(
          landmark,
          PoseLandmarker.POSE_CONNECTIONS,
          {}
        )
      }
    }
    drawLandmarks()
  }, [form.watch('readyLandmark')])
  // to fix dependency warning

  useEffect(() => {
    if (form.watch(`readyLandmark`).normalizedLandmarks.length === 0) {
      const canvas = poseLandmarkRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      console.log(canvas.clientHeight, canvas.clientWidth)
      canvas.height = canvas.clientHeight
      canvas.width = canvas.clientWidth
      if (!ctx) return
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)
    }
  }, [form.watch(`readyLandmark`)])
  return (
    <div className='flex flex-1 flex-row py-4'>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>
          <canvas
            ref={poseLandmarkRef}
            className='aspect-[11/16] h-[400px] rounded-lg border bg-slate-900'
          ></canvas>
        </DialogTrigger>
        <DialogContent className='align-top sm:max-w-[1200px]'>
          <ReadySelectPoseDialog />
        </DialogContent>
      </Dialog>
      <div className='flex justify-center align-middle'>
        <div className='grid w-max grid-cols-3 justify-center gap-2 px-5'>
          {landmarkBodyParts.map((bodyParts) => (
            <FormField
              control={form.control}
              render={({ field }) => (
                <div className='flex flex-row items-center gap-3 rounded-lg border px-5 py-2'>
                  <div className=''>
                    {landmarkBodyParts.find(
                      (part) => part.index === bodyParts.index
                    )?.name ?? ''}
                  </div>
                  <div className='flex flex-row items-center gap-1'>
                    <Slider
                      min={0}
                      max={10}
                      step={1}
                      className='w-24'
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-expect-error
                      value={[field.value]}
                      onValueChange={(value) => {
                        form.setValue(field.name, value[0])
                      }}
                    />
                    {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                    {/* @ts-expect-error */}
                    <div>{field.value}</div>
                  </div>
                </div>
              )}
              key={bodyParts.index}
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-expect-error
              name={`readyLandmark.jointDirectionsWeights[${bodyParts.index}]`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
