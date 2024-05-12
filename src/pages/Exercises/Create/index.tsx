import { useAtom, useSetAtom } from 'jotai'
import { croppedImageAtom, uploadFileAtom } from './atom'
import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout'
import UploadVideoComponent from './components/upload-video'
import FrameSelector from './components/frame-selector'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import PoseLandmarkPreview from './components/poselandmark-preview'

export default function CreateExercisePage() {
  const [uploadFile, setUploadFile] = useAtom(uploadFileAtom)
  const setCroppedImage = useSetAtom(croppedImageAtom)
  return (
    <Layout>
      <LayoutHeader>
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <UserNav />
        </div>
      </LayoutHeader>
      <LayoutBody>
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
            <Button>Done</Button>
          </div>
          <div className='grid grid-cols-3 gap-4'>
            <div className='col-span-2'>
              {!uploadFile && <UploadVideoComponent />}
              {uploadFile && <FrameSelector />}
            </div>
            <PoseLandmarkPreview />
          </div>
        </div>
      </LayoutBody>
    </Layout>
  )
}
