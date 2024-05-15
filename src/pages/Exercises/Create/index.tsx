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
import { useState } from 'react'
import CreateExerciseForm from './form'
import StartPose from './StartPose/StartPose'
import ReadyPose from './ReadyPose/ReadyPose'
export default function CreateExercisePage() {
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

  return (
    <FormProvider {...form}>
      <Dialog>
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
              defaultValue='form'
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
              <Button>Done</Button>
            </DialogClose>
            <Button
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
            </Button>
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
