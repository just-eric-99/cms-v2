import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { createExerciseSchema } from '../_data/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { ExercisePermission } from '@/enum/exercisePermission.ts'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useEffect, useState } from 'react'
import UpdateExerciseForm from './form'
import StartPose from './StartPose/StartPose'
import ReadyPose from './ReadyPose/ReadyPose'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createExercise } from '@/network/exercises/api'
import { CreateExerciseRequest } from '@/network/exercises/types'
import { toast } from 'sonner'
import { useAtom } from 'jotai'
import { uploadFileAtom } from './atom'
import AnimationEditor from '@/components/animation-editor.tsx'

export default function CreateExercisePage() {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [currentTab, setCurrentTab] = useState('form')
  const [, setUploadFile] = useAtom(uploadFileAtom)
  const form = useForm<z.infer<typeof createExerciseSchema>>({
    resolver: zodResolver(createExerciseSchema),
    defaultValues: {
      centerId: '',
      name: '',
      readyPoseDescription: '',
      startPoseDescription: '',
      readyPoseVoiceName: '',
      startPoseVoiceName: '',
      difficulty: 1,
      permission: ExercisePermission.PRIVATE,

      readyLandmark: {
        normalizedLandmarks: [],
        worldLandmarks: [],
        jointDirectionsWeights: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },

      startLandmark: {
        normalizedLandmarks: [],
        worldLandmarks: [],
        jointDirectionsWeights: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
    },
  })
  const queryClient = useQueryClient()
  const [errMsg, setErrMsg] = useState('')

  const createExerciseMutation = useMutation({
    mutationFn: async (data: z.infer<typeof createExerciseSchema>) => {
      const createExerciseRequest: CreateExerciseRequest = {
        centerId: data.centerId,
        name: data.name,
        readyPoseDescription: data.readyPoseDescription,
        startPoseDescription: data.startPoseDescription,
        readyPoseVoiceName: data.readyPoseVoiceName,
        startPoseVoiceName: data.startPoseVoiceName,
        difficulty: data.difficulty,
        permission: data.permission,
        readyLandmark: {
          normalizedLandmarks: data.readyLandmark.normalizedLandmarks,
          worldLandmarks: data.readyLandmark.worldLandmarks,
          jointDirectionsWeights: data.readyLandmark.jointDirectionsWeights,
        },
        startLandmark: {
          normalizedLandmarks: data.startLandmark.normalizedLandmarks,
          worldLandmarks: data.startLandmark.worldLandmarks,
          jointDirectionsWeights: data.startLandmark.jointDirectionsWeights,
        },
        keyframes: data.keyframes,
      }
      return createExercise(createExerciseRequest)
    },
    onMutate: () => {
      // console.log(data)
      setLoading(true)
    },
    onError: (error) => {
      console.log(error)
      setLoading(false)
      setOpen(false)
      toast.error(error.message ?? 'Error creating exercise')
    },
    onSuccess: () => {
      console.log('success')
      setLoading(false)
      setOpen(false)
      toast.success('Exercise created successfully')
      queryClient.invalidateQueries({ queryKey: ['exercises'] })
    },
    onSettled: () => {
      console.log('settled')
      setLoading(false)
      setOpen(false)
      setUploadFile(null)
      form.reset()
    },
  })

  const onSubmit = form.handleSubmit(
    (data) => {
      console.log(
        'data.readyLandmark.jointDirectionsWeights',
        data.readyLandmark.jointDirectionsWeights
      )
      console.log(
        'data.startLandmark.jointDirectionsWeights',
        data.startLandmark.jointDirectionsWeights
      )
      console.log('data', data)
      createExerciseMutation.mutate(data)
    },
    (errors) => {
      console.log('inside invalid')
      console.log(errors)
      console.log("data", form.getValues())
      let errorMessages = ''
      if (
        errors.name ||
        errors.readyPoseDescription ||
        errors.startPoseDescription ||
        errors.readyPoseVoiceName ||
        errors.startPoseVoiceName ||
        errors.difficulty ||
        errors.permission ||
        errors.centerId
      ) {
        errorMessages += 'Please fill all required fields'
      }

      console.log(errors.readyLandmark)
      console.log(errors.startLandmark)
      if (
        errors.readyLandmark?.jointDirectionsWeights ||
        errors.startLandmark?.jointDirectionsWeights
      ) {
        console.log('inside error')
        if (errorMessages == '') {
          errorMessages += 'Set at least one joint weight as 1'
        } else {
          errorMessages += ', Sum of weights cannot be 0'
        }
      }
      setErrMsg(errorMessages)
    }
  )

  useEffect(() => {
    form.reset()
    setErrMsg('')
  }, [open])

  return (
    <FormProvider {...form}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Create</Button>
        </DialogTrigger>
        <DialogContent
          className=' align-top sm:max-w-[1200px]'
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Create Exercise</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <Tabs
              value={currentTab}
              onValueChange={(value) => setCurrentTab(value)}
            >
              <div className={'flex flex-row items-center justify-between'}>
                <TabsList>
                  <TabsTrigger className='min-w-32' value='form'>
                    Details
                  </TabsTrigger>
                  <TabsTrigger className='min-w-32' value='readyPose'>
                    Ready Pose
                  </TabsTrigger>
                  <TabsTrigger className='min-w-32' value='startPose'>
                    Start Pose
                  </TabsTrigger>
                </TabsList>
                <div className={'text-destructive'}>{errMsg}</div>
              </div>
              <div className='min-h-[500px]'>
                <TabsContent
                  forceMount
                  value='form'
                  className={`${currentTab === 'form' ? 'block' : 'hidden'}`}
                >
                  <UpdateExerciseForm />
                </TabsContent>

                <TabsContent
                  forceMount
                  value='readyPose'
                  className={`${currentTab === 'readyPose' ? 'block' : 'hidden'}`}
                >
                  <ReadyPose />
                </TabsContent>
                <TabsContent
                  forceMount
                  value='startPose'
                  className={`${currentTab === 'startPose' ? 'block' : 'hidden'}`}
                >
                  <StartPose />
                </TabsContent>
              </div>
            </Tabs>
          </Form>
          <DialogFooter className='gap-2'>
            <DialogClose asChild>
              <Button
                onClick={() => {
                  setUploadFile(null)
                }}
                variant='secondary'
              >
                Cancel
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button loading={loading} onClick={onSubmit}>
                Done
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className={'hidden'}>
        {form.watch('readyLandmark') != null &&
          form.watch('startLandmark') != null && (
            <>
              <div>Animation Editor</div>
              <AnimationEditor
                json={JSON.stringify({
                  readyPose: form.watch('readyLandmark'),
                  startPose: form.watch('startLandmark'),
                })}
                callback={(json) => {
                  console.log('json when readyPose or startPose updated', json)
                  // serialisa into Keyframe[]
                  form.setValue('keyframes', JSON.parse(json))
                }}
                canEdit={false}
              />
            </>
          )}
      </div>
    </FormProvider>
  )
}
