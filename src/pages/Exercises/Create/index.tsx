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
import CreateExerciseForm from './form'
import StartPose from './StartPose/StartPose'
import ReadyPose from './ReadyPose/ReadyPose'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createExercise } from '@/network/exercises/api'
import { CreateExerciseRequest } from '@/network/exercises/types'
import { toast } from 'sonner'
import { useAtom } from 'jotai'
import { uploadFileAtom } from './atom'

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
      description: '',
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
  const createExerciseMutation = useMutation({
    mutationFn: async (data: z.infer<typeof createExerciseSchema>) => {
      const createExerciseRequest: CreateExerciseRequest = {
        centerId: data.centerId,
        name: data.name,
        description: data.description,
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
      }
      return createExercise(createExerciseRequest)
    },
    onMutate: (data) => {
      console.log(data)
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

  const onSubmit = form.handleSubmit((data) => {
    createExerciseMutation.mutate(data)
  })

  useEffect(() => {
    form.reset()
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
              <div className='min-h-[500px]'>
                <TabsContent
                  forceMount
                  value='form'
                  className={`${currentTab === 'form' ? 'block' : 'hidden'}`}
                >
                  <CreateExerciseForm />
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
    </FormProvider>
  )
}
