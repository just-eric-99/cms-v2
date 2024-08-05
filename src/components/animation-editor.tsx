import { useCallback, useEffect } from 'react'
import { Unity, UnityConfig, useUnityContext } from 'react-unity-webgl'
import { Maximize } from 'lucide-react'
import { Button } from '@/components/ui/button.tsx'

type AnimationEditorProps = {
  json: string
  callback: (json: string) => void
}

const unityConfig: UnityConfig = {
  loaderUrl: './../animation-editor/Web.loader.js',
  dataUrl: './../animation-editor/Web.data',
  frameworkUrl: './../animation-editor/Web.framework.js',
  codeUrl: './../animation-editor/Web.wasm',
}

export default function AnimationEditor(props: AnimationEditorProps) {
  const {
    unityProvider,
    sendMessage,
    requestFullscreen,
    addEventListener,
    removeEventListener,
  } = useUnityContext(unityConfig)

  useEffect(() => {
    sendMessage('LoadController', 'SetExerciseData', props.json)
  }, [sendMessage, unityProvider])

  const handleSetKeyframeData = useCallback((jsonResult: string) => {
    console.log('handleSetKeyframeData')
    // console.log(json)
    // json = jsonResult;
    props.callback(jsonResult)
  }, [])

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    addEventListener('SetKeyframeData', handleSetKeyframeData)
    return () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      removeEventListener('SetKeyframeData', handleSetKeyframeData)
    }
  }, [addEventListener, removeEventListener, handleSetKeyframeData])

  return (
    <div className={'relative aspect-video h-[500px]'}>
      <Unity
        className={'absolute inset-0'}
        style={{ width: '100%', height: '100%' }}
        unityProvider={unityProvider}
      />
      <Button
        className={'absolute right-2 top-2'}
        size={'icon'}
        onClick={() => {
          requestFullscreen(true)
        }}
      >
        <Maximize />
      </Button>
    </div>
  )
}
