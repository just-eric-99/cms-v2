import { Form } from '@/components/ui/form.tsx'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs.tsx'
import UpdateExerciseForm from '@/pages/Exercises/Create/form.tsx'
import ReadyPose from '@/pages/Exercises/Create/ReadyPose/ReadyPose.tsx'
import StartPose from '@/pages/Exercises/Create/StartPose/StartPose.tsx'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { createExerciseSchema } from '@/pages/Exercises/_data/schema.ts'
import { zodResolver } from '@hookform/resolvers/zod'
import { ExercisePermission } from '@/enum/exercisePermission.ts'
import { useLayoutEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  copyExercise,
  deleteExercise,
  getExerciseById,
  updateExercise,
} from '@/network/exercises/api.ts'
import Loader from '@/components/loader.tsx'
import { useNavigate, useParams } from 'react-router-dom'
import { useAtom } from 'jotai/index'
import {
  readyPoseLandmarksAtom,
  startPoseLandmarksAtom,
} from '@/pages/Exercises/Create/atom.ts'
import {
  Layout,
  LayoutBody,
  LayoutHeader,
} from '@/components/custom/layout.tsx'
import { Card, CardContent, CardHeader } from '@/components/ui/card.tsx'
import { Button } from '@/components/ui/button.tsx'

import { toast } from 'sonner'
import AnimationEditor from '@/components/animation-editor.tsx'

type ExerciseDetailsPageProps = {
  editable: boolean
}

export default function ExerciseDetailsPage(props: ExerciseDetailsPageProps) {
  const [errMsg, setErrMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [copyLoading, setCopyLoading] = useState(false)
  const [canEdit, setCanEdit] = useState(props.editable)
  const [currentTab, setCurrentTab] = useState('form')
  const { id } = useParams()
  const navigate = useNavigate()
  const [, setReadyPoseLandmarks] = useAtom(readyPoseLandmarksAtom)
  const [, setStartPoseLandmarks] = useAtom(startPoseLandmarksAtom)
  const queryClient = useQueryClient()
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
        organizationId: exercise.center.organizationId,
        centerId: exercise.centerId,
        name: exercise.name,
        description: exercise.description,
        difficulty: exercise.difficulty,
        permission: exercise.permission,
        readyLandmark: exercise.readyPose,
        startLandmark: exercise.startPose,
        voiceFilename: exercise.voiceFilename
      })
      return exercise
    },
  })

  const updateExerciseMutation = useMutation({
    mutationFn: async (data: z.infer<typeof createExerciseSchema>) => {
      return updateExercise(data, id ?? '')
    },
    onMutate: () => {
      // console.log(data)
      setLoading(true)
    },
    onError: (error) => {
      console.log(error)
      setLoading(false)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['exercise', id] })
      setLoading(false)
      toast.success(`Exercise updated successfully`)
      setCanEdit(false)
    },
  })

  const deleteExerciseMutation = useMutation({
    mutationFn: async () => {
      return deleteExercise(id ?? '')
    },
    onMutate: () => {
      setDeleteLoading(true)
    },
    onError: (error) => {
      setDeleteLoading(false)
      toast.error(error.message ?? 'Error deleting exercise')
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['exercise', id] })
      setDeleteLoading(false)
      toast.success(`Exercise deleted successfully`)
      navigate(-1)
    },
  })

  const copyExerciseMutation = useMutation({
    mutationFn: async () => {
      return copyExercise(id ?? '')
    },
    onMutate: () => {
      setCopyLoading(true)
    },
    onError: (error) => {
      setCopyLoading(false)
      toast.error(error.message ?? 'Error copying exercise')
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ['exercise', id] })
      setCopyLoading(false)
      toast.success(`Exercise copied successfully`)
      navigate(`/exercises/${data.id}`, {
        replace: true,
      })
      window.location.reload()
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
      form.setValue('centerId', query.data.centerId)
    }
  }, [form, query.data, setReadyPoseLandmarks, setStartPoseLandmarks])

  const handleSave = form.handleSubmit(
    (data) => {
      console.log('edit details', data)
      updateExerciseMutation.mutate(data)
      setErrMsg('')
    },
    (errors) => {
      console.log('edit details error', errors)
      let errorMessages = ''
      if (
        errors.name ||
        errors.description ||
        errors.difficulty ||
        errors.permission ||
        errors.centerId
      ) {
        errorMessages += 'Please fill all required fields'
      }

      if (
        errors.readyLandmark?.jointDirectionsWeights ||
        errors.startLandmark?.jointDirectionsWeights
      ) {
        if (errorMessages == '') {
          errorMessages += 'Set at least one joint weight as 1'
        } else {
          errorMessages += ', Sum of weights cannot be 0'
        }
      }
      setErrMsg(errorMessages)
    }
  )

  const handleDelete = () => {
    deleteExerciseMutation.mutate()
  }

  const handleCopy = () => {
    copyExerciseMutation.mutate()
  }

  const handleCancel = () => {
    form.reset()
    setCanEdit(false)
  }

  const handleBack = () => {
    form.reset()
    setErrMsg('')
    navigate(-1)
  }

  // state of voice filename

  if (query.isLoading) return <Loader />

  return (
    <Layout>
      <LayoutHeader></LayoutHeader>
      <LayoutBody className='flex flex-col gap-8'>
        <Card>
          <CardHeader className='flex flex-col justify-between gap-6'>
            <div className='flex flex-row'>
              <Button variant={'outline'} onClick={handleBack}>
                Back
              </Button>
              <div className='flex flex-1 justify-end gap-4'>
                <Button
                  variant={'secondary'}
                  onClick={handleCopy}
                  loading={copyLoading}
                >
                  Copy
                </Button>
                <Button
                  variant={'destructive'}
                  onClick={handleDelete}
                  loading={deleteLoading}
                >
                  Delete
                </Button>
                {canEdit && (
                  <>
                    <Button loading={loading} onClick={handleSave}>
                      Save
                    </Button>
                    <Button variant={'outline'} onClick={handleCancel}>
                      Cancel
                    </Button>
                  </>
                )}

                {!canEdit && (
                  <Button onClick={() => setCanEdit(true)}>Edit</Button>
                )}
              </div>
            </div>
            <div className='text-xl font-bold'>Exercise Details</div>
          </CardHeader>
          <CardContent>
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
                    <TabsTrigger className='min-w-32' value='animationEditor'>
                      Animation Editor
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
                    <UpdateExerciseForm canEdit={canEdit} />
                  </TabsContent>

                  <TabsContent
                    forceMount
                    value='readyPose'
                    className={`${currentTab === 'readyPose' ? 'block' : 'hidden'}`}
                  >
                    <ReadyPose canEdit={canEdit} />
                  </TabsContent>
                  <TabsContent
                    forceMount
                    value='startPose'
                    className={`${currentTab === 'startPose' ? 'block' : 'hidden'}`}
                  >
                    <StartPose canEdit={canEdit} />
                  </TabsContent>

                  <TabsContent
                    forceMount
                    value='animationEditor'
                    className={`${currentTab === 'animationEditor' ? 'block' : 'hidden'}`}
                  >
                    {/*<AnimationEditor*/}
                    {/*  exerciseId={id ?? ''}*/}
                    {/*  callback={() => {*/}
                    {/*    console.log('callback')*/}
                    {/*  }}*/}
                    {/*/>*/}

                    {/*<Unity*/}
                    {/*  style={{ width: '100%', height: '100%' }}*/}
                    {/*  unityProvider={unityProvider}*/}
                    {/*/>*/}

                    {/*<Unity*/}
                    {/*  style={{ width: '100%', height: '100%' }}*/}
                    {/*  unityProvider={unityProvider}*/}
                    {/*/>*/}

                    <AnimationEditor
                      json={JSON.stringify(query.data)}
                      callback={(json: string) => {
                        console.log(json)
                      }}
                      canEdit={canEdit}
                    />
                  </TabsContent>
                </div>
              </Tabs>
            </Form>
          </CardContent>
        </Card>
      </LayoutBody>
    </Layout>
  )
}
