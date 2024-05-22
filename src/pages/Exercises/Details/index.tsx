import { Form } from '@/components/ui/form.tsx'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs.tsx'
import CreateExerciseForm from '@/pages/Exercises/Create/form.tsx'
import ReadyPose from '@/pages/Exercises/Create/ReadyPose/ReadyPose.tsx'
import StartPose from '@/pages/Exercises/Create/StartPose/StartPose.tsx'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { createExerciseSchema } from '@/pages/Exercises/_data/schema.ts'
import { zodResolver } from '@hookform/resolvers/zod'
import { ExercisePermission } from '@/enum/exercisePermission.ts'
import { useLayoutEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getExerciseById } from '@/network/exercises/api.ts'
import Loader from '@/components/loader.tsx'
import { useParams } from 'react-router-dom'
import { useAtom } from 'jotai/index'
import {
  readyPoseLandmarksAtom,
  startPoseLandmarksAtom,
} from '@/pages/Exercises/Create/atom.ts'

type ExerciseDetailsPageProps = {
  editable: boolean
}

export default function ExerciseDetailsPage(props: ExerciseDetailsPageProps) {
  const [currentTab, setCurrentTab] = useState('form')
  const { id } = useParams()
  const [, setReadyPoseLandmarks] = useAtom(readyPoseLandmarksAtom)
  const [, setStartPoseLandmarks] = useAtom(startPoseLandmarksAtom)
  console.log(props.editable)
  const form = useForm<z.infer<typeof createExerciseSchema>>({
    resolver: zodResolver(createExerciseSchema),
    mode: 'all',
    defaultValues: {
      centerId: '',
      name: '',
      description: '',
      difficulty: 0,
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

  const query = useQuery({
    queryKey: ['exercise'],
    retryOnMount: true,
    queryFn: async () => {
      const exercise = await getExerciseById(id ?? '')
      form.reset({
        centerId: exercise.centerId,
        name: exercise.name,
        description: exercise.description,
        difficulty: exercise.difficulty,
        permission: exercise.permission,
        readyLandmark: exercise.readyPose,
        startLandmark: exercise.startPose,
      })
      return exercise
    },
  })

  useLayoutEffect(() => {
    if (query.data) {
      setReadyPoseLandmarks({
        normalizedLandmarks: query.data.readyPose.normalizedLandmarks,
        worldLandmarks: query.data.readyPose.worldLandmarks,
      })
      setStartPoseLandmarks({
        normalizedLandmarks: query.data.startPose.normalizedLandmarks,
        worldLandmarks: query.data.startPose.worldLandmarks,
      })
      form.setValue('readyLandmark', query.data.readyPose)
      form.setValue('startLandmark', query.data.startPose)
    }
  }, [form, query.data, setReadyPoseLandmarks, setStartPoseLandmarks])

  // const onSubmit = async () => {
  //   console.log('submit')
  // }

  if (query.isLoading) return <Loader />

  return (
    <Form {...form}>
      <Tabs value={currentTab} onValueChange={(value) => setCurrentTab(value)}>
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
  )
}
