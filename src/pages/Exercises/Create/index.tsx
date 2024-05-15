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
import { Permission } from '@/enum/permission'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useEffect, useState } from 'react'
import CreateExerciseForm from './form'
import StartPose from './StartPose/StartPose'
import ReadyPose from './ReadyPose/ReadyPose'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createExercise } from '@/network/exercises/api'
import { CreateExerciseRequest } from '@/network/exercises/types'
import { toast } from 'sonner'

export default function CreateExercisePage() {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [currentTab, setCurrentTab] = useState('form')
  const form = useForm<z.infer<typeof createExerciseSchema>>({
    resolver: zodResolver(createExerciseSchema),
    defaultValues: {
      // centerId: '217730e7-de64-4e8c-900b-3e7df698680c',
      centerId: '',
      name: '',
      description: '',
      difficulty: 0,
      permission: Permission.PRIVATE,

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
      toast('Error creating center', {
        description:
          error.message ?? 'An error occurred while creating the user.',
      })
    },
    onSuccess: () => {
      console.log('success')
      setLoading(false)
      setOpen(false)
      toast('Center created successfully', {
        description: 'Center has been created successfully.',
      })
      queryClient.invalidateQueries({ queryKey: ['organizations'] })
    },
    onSettled: () => {
      console.log('settled')
      setLoading(false)
      setOpen(false)
      form.reset()
    },
  })

  const onSubmit = form.handleSubmit((data) => {
    createExerciseMutation.mutate(data)
  })

  useEffect(() => {
    return () => form.reset()
  }, [open])

  return (
    <FormProvider {...form}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Create</Button>
        </DialogTrigger>
        <DialogContent className=' align-top sm:max-w-[1200px]'>
          <DialogHeader>
            <DialogTitle>Create Exercise</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <Tabs
              className=''
              value={currentTab}
              onValueChange={(value) => {
                setCurrentTab(value)
              }}
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
              <div className='min-h-[400px]'>
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
              <Button loading={loading} onClick={onSubmit}>
                Done
              </Button>
            </DialogClose>
            {/* <Button
              onClick={() => {
                console.log(
                  "form.getValues('readyLandmark.normalizedLandmarks')",
                  form.getValues('readyLandmark.normalizedLandmarks')
                )
                console.log(
                  "form.getValues('startLandmark.normalizedLandmarks')",
                  form.getValues('startLandmark.normalizedLandmarks')
                )
              }}
            >
              Print
            </Button> */}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </FormProvider>
  )
}

// const [uploadFile, setUploadFile] = useAtom(uploadFileAtom)
// const setCroppedImage = useSetAtom(croppedImageAtom)
/* 
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
        Backs
      </Button>
    </Link>
    <Button>Done</Button>
  </div>
  <div className='grid grid-cols-5 gap-4'>
    <div className='col-span-3'>
      {!uploadFile && <UploadVideoComponent />}
      {uploadFile && <FrameSelector />}
    </div>
    <div className='col-span-2'>
      <PoseLandmarkPreview />
    </div>
  </div>
</div> */
