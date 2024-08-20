import { useQuery } from '@tanstack/react-query'
import { getRecordById } from '@/network/records/api.ts'
import { useNavigate, useParams } from 'react-router-dom'
import Loader from '@/components/loader.tsx'
import {
  Layout,
  LayoutBody,
  LayoutHeader,
} from '@/components/custom/layout.tsx'
import ThemeSwitch from '@/components/theme-switch.tsx'
import { UserNav } from '@/components/user-nav.tsx'
import { Card, CardContent, CardHeader } from '@/components/ui/card.tsx'
import { Label } from '@/components/ui/label.tsx'
import { Input } from '@/components/ui/input.tsx'
import { format } from 'date-fns'
import { getUserById } from '@/network/users/api.ts'
import { Button } from '@/components/ui/button.tsx'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog.tsx'
import VideoPlayerWithLandmarks from '@/components/video-player-with-landmarks.tsx'
import { DownloadIcon } from 'lucide-react'
import { API_ENDPOINT } from '@/constants/network.ts'

export default function RecordDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const query = useQuery({
    queryKey: ['record'],
    queryFn: () => getRecordById(id as string),
  })

  const userQuery = useQuery({
    queryKey: ['user', query.data?.userId ?? ''],
    queryFn: () => getUserById(query.data?.userId ?? ''),
  })

  const handleBack = () => navigate(-1)

  if (query.isLoading || userQuery.isLoading) return <Loader />

  return (
    <Layout>
      <LayoutHeader>
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <UserNav />
        </div>
      </LayoutHeader>
      <LayoutBody>
        <div className={'flex flex-col gap-8'}>
          <Card>
            <CardHeader className='flex flex-col justify-between gap-6'>
              <div className='flex flex-row'>
                <Button variant={'outline'} onClick={handleBack}>
                  Back
                </Button>
              </div>
              <div className='text-xl font-bold'>Record Details</div>
            </CardHeader>
            <CardContent>
              <div className='flex flex-1 flex-col justify-start gap-5'>
                <div className={'flex-1 space-y-2'}>
                  <Label>User's name</Label>
                  <Input disabled value={userQuery.data?.name} />
                </div>

                <div className={'flex-1 space-y-2'}>
                  <Label>Start At</Label>
                  <Input
                    disabled
                    value={format(
                      query.data?.startAt ?? '',
                      'yyyy-MM-dd HH:mm:ss'
                    )}
                  />
                </div>

                <div className={'flex-1 space-y-2'}>
                  <Label>Finish At</Label>
                  <Input
                    disabled
                    value={format(
                      query.data?.finishAt ?? '',
                      'yyyy-MM-dd HH:mm:ss'
                    )}
                  />
                </div>

                <div className={'flex-1 space-y-2'}>
                  <Label>Score</Label>
                  <Input disabled value={query.data?.score} />
                </div>

                <div className={'flex-1 space-y-2'}>
                  <Label>Created At</Label>
                  <Input
                    disabled
                    value={format(
                      query.data?.createdAt ?? '',
                      'yyyy-MM-dd HH:mm:ss'
                    )}
                  />
                </div>

                <div className={'flex-1 space-y-2'}>
                  <Label>Updated At</Label>
                  <Input
                    disabled
                    value={format(
                      query.data?.updatedAt ?? '',
                      'yyyy-MM-dd HH:mm:ss'
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-col justify-between gap-6 text-xl font-bold'>
              User Exercises Videos
            </CardHeader>
            <CardContent>
              <div className={'flex flex-col gap-4'}>
                {query.data?.userExerciseRecord.map(
                  (userExerciseRecord, index) => {
                    const recordName =
                      userExerciseRecord.exercise.name +
                      ' - ' +
                      userQuery.data?.name
                    return (
                      <div
                        className={'flex justify-between rounded-lg border p-2'}
                        key={index}
                      >
                        <Dialog key={index}>
                          <DialogTrigger asChild>
                            <Button variant={'link'}>{recordName}</Button>
                          </DialogTrigger>
                          <DialogContent className={'flex'}>
                            <VideoPlayerWithLandmarks
                              userExerciseId={userExerciseRecord.id}
                            />
                          </DialogContent>
                        </Dialog>
                        <Button
                          size={'icon'}
                          onClick={() => {
                            const a = document.createElement('a')
                            a.href = `${API_ENDPOINT}/user-exercise/record/${userExerciseRecord.id}/download`
                            a.download = 'video.mp4'
                            a.click()
                          }}
                        >
                          <DownloadIcon />
                        </Button>
                      </div>
                    )
                  }
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </LayoutBody>
    </Layout>
  )
}
