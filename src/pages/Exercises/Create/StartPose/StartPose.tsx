import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { useFormContext } from 'react-hook-form'
import { createExerciseSchema } from '../../_data/schema'
import { z } from 'zod'
import { FormField } from '@/components/ui/form'
import { Slider } from '@/components/ui/slider'
import { useCallback, useEffect, useRef } from 'react'
import { useAtom } from 'jotai'
import { openStartDialogAtom, startPoseLandmarksAtom } from '../atom'
import {
  DrawingUtils,
  Landmark,
  NormalizedLandmark,
  PoseLandmarker,
} from '@mediapipe/tasks-vision'
import StartSelectPoseDialog from './StartDialog'
import { Button } from '@/components/ui/button.tsx'

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

type StartPoseProps = {
  canEdit?: boolean
}

export default function StartPose(props: StartPoseProps) {
  const poseLandmarkRef = useRef<HTMLCanvasElement>(null)
  const form = useFormContext<z.infer<typeof createExerciseSchema>>()
  const [openDialog, setOpenDialog] = useAtom(openStartDialogAtom)
  const [startPoseLandmarks, setStartPoseLandmarks] = useAtom(
    startPoseLandmarksAtom
  )

  useEffect(() => {
    const drawLandmarks = () => {
      const canvas = poseLandmarkRef.current
      console.log()
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      // console.log(
      //   'canvas.clientHeight, canvas.clientWidth: ',
      //   canvas.clientHeight,
      //   canvas.clientWidth
      // )
      // console.log('canvas.height, canvas.width: ', canvas.height, canvas.width)
      // canvas.height = canvas.clientHeight
      // canvas.width = canvas.clientWidth
      canvas.height = 400
      canvas.width = (400 * 11) / 16

      if (!ctx) return
      const drawingUtils = new DrawingUtils(ctx)
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)
      const normalizedLandmarks = startPoseLandmarks.normalizedLandmarks
      console.log('its startlandmark')
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
  }, [startPoseLandmarks.normalizedLandmarks])

  useEffect(() => {
    if (form.watch(`startLandmark`).normalizedLandmarks.length === 0) {
      const canvas = poseLandmarkRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      console.log(canvas.clientHeight, canvas.clientWidth)
      canvas.height = canvas.clientHeight
      canvas.width = canvas.clientWidth
      if (!ctx) return
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)
    }
  }, [form])

  const onMirror = useCallback(() => {
    // const normalizedLandmarks = startPoseLandmarks.normalizedLandmarks.map((normalizedLandmark) => {
    //   normalizedLandmark.x = 1 - normalizedLandmark.x
    //   return normalizedLandmark
    // })
    // const worldLandmarks = startPoseLandmarks.worldLandmarks.map((worldLandmarks) => {
    //   worldLandmarks.x = 1 - worldLandmarks.x
    //   return worldLandmarks
    // })

    // const normalizedLandmarks = { ...startPoseLandmarks.normalizedLandmarks }
    // for (let i = 10; i < normalizedLandmarks.length; i = i + 2) {
    //   const leftLandmark = normalizedLandmarks[i]
    //   normalizedLandmarks[i] = normalizedLandmarks[i + 1]
    //   normalizedLandmarks[i + 1] = leftLandmark
    // }

    // for (let i = 10; i < normalizedLandmarks.length; i++) {
    //   normalizedLandmarks[i].x = 1 - normalizedLandmarks[i].x
    // }

    // const worldLandmarks = { ...startPoseLandmarks.worldLandmarks }
    // for (let i = 10; i < worldLandmarks.length; i = i + 2) {
    //   const leftLandmark = worldLandmarks[i]
    //   worldLandmarks[i] = worldLandmarks[i + 1]
    //   worldLandmarks[i + 1] = leftLandmark
    // }

    // for (let i = 10; i < worldLandmarks.length; i++) {
    //   worldLandmarks[i].x = 1 - worldLandmarks[i].x
    // }

    const deepCopy = (obj: unknown) => {
      return JSON.parse(JSON.stringify(obj))
    }

    const normalizedLandmarks = deepCopy(
      startPoseLandmarks.normalizedLandmarks
    ) as NormalizedLandmark[]

    for (let i = 11; i < normalizedLandmarks.length; i = i + 2) {
      const leftLandmark = normalizedLandmarks[i]
      normalizedLandmarks[i] = normalizedLandmarks[i + 1]
      normalizedLandmarks[i + 1] = leftLandmark
    }

    normalizedLandmarks.forEach((landmark) => {
      landmark.x = 1 - landmark.x
    })

    const worldLandmarks = deepCopy(startPoseLandmarks.worldLandmarks) as Landmark[]
    for (let i = 11; i < worldLandmarks.length; i = i + 2) {
      const leftLandmark = worldLandmarks[i]
      worldLandmarks[i] = worldLandmarks[i + 1]
      worldLandmarks[i + 1] = leftLandmark
    }

    worldLandmarks.forEach((landmark) => {
      landmark.x = 1 - landmark.x
    })

    setStartPoseLandmarks({
      normalizedLandmarks,
      worldLandmarks,
    })
    form.setValue('startLandmark.normalizedLandmarks', normalizedLandmarks)
    form.setValue('startLandmark.worldLandmarks', worldLandmarks)
  }, [startPoseLandmarks])

  return (
    <div className='flex flex-1 flex-row py-4'>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <div>
          <DialogTrigger
            asChild
            disabled={props.canEdit != undefined && !props.canEdit}
          >
            <canvas
              ref={poseLandmarkRef}
              className='aspect-[11/16] h-[400px] rounded-lg border bg-slate-900'
            ></canvas>
          </DialogTrigger>
          <div className='my-2 flex justify-center'>
            <Button
              variant={'secondary'}
              onClick={onMirror}
              disabled={!props.canEdit}
            >
              Mirror
            </Button>
          </div>
        </div>
        <DialogContent className='align-top sm:max-w-[1200px]'>
          <StartSelectPoseDialog />
        </DialogContent>
      </Dialog>
      {props.canEdit != undefined && !props.canEdit && (
        <div className={'absolute aspect-[11/16] h-[400px]'}></div>
      )}

      <div className='flex '>
        <div className='flex min-w-full flex-row flex-wrap gap-5 px-5'>
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
                      disabled={props.canEdit != undefined && !props.canEdit}
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      value={[field.value]}
                      onValueChange={(value) => {
                        form.setValue(field.name, value[0])
                      }}
                    />
                    {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                    {/* @ts-ignore */}
                    <div>{field.value}</div>
                  </div>
                </div>
              )}
              key={bodyParts.index}
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-expect-error
              name={`startLandmark.jointDirectionsWeights[${bodyParts.index}]`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
