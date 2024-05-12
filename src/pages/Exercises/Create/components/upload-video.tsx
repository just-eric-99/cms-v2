import { useSetAtom } from 'jotai'
import { uploadFileAtom } from '../atom'
import { Card } from '@/components/ui/card'
import { useDropzone } from 'react-dropzone'

export default function UploadVideoComponent() {
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    noKeyboard: true,
    noDrag: false,
    preventDropOnDocument: false,
    accept: {
      'video/*': ['.mp4', '.mov'],
    },
    useFsAccessApi: false,
  })

  const setUploadFile = useSetAtom(uploadFileAtom)

  return (
    <div className='flex flex-col justify-center gap-10 '>
      <div className='relative h-[350px] overflow-hidden rounded-lg md:h-[400px] lg:h-[500px]'>
        <Card
          {...getRootProps({ className: 'dropzone' })}
          className='flex h-[320px] flex-1 grow items-center justify-center overflow-hidden rounded-lg border-4 border-dashed p-5 md:h-[400px] lg:h-[500px]'
        >
          <input
            {...getInputProps()}
            onChange={(e) => {
              const file = (e.target as HTMLInputElement).files
              if (file) {
                setUploadFile(file[0])
              }
            }}
          />
          <div className='text-sm'>Click to upload a video</div>
        </Card>
      </div>
    </div>
  )
}
