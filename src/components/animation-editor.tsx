import { useCallback, useEffect } from 'react'
import { Unity, UnityConfig, useUnityContext } from 'react-unity-webgl'
import { Maximize } from 'lucide-react'
import { Button } from '@/components/ui/button.tsx'

type AnimationEditorProps = {
  json: string
  callback: (json: string) => void
  canEdit: boolean
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
    unload,
    // UNSAFE__unityInstance,
  } = useUnityContext(unityConfig)
  useEffect(() => {
    console.log("JSON.parse(props.json).readyPose.worldLandmarks.length", JSON.parse(props.json).readyPose.worldLandmarks.length)
    console.log("JSON.parse(props.json).startPose.worldLandmarks.length", JSON.parse(props.json).startPose.worldLandmarks.length)
    if (JSON.parse(props.json).readyPose.worldLandmarks.length != 0 && JSON.parse(props.json).startPose.worldLandmarks.length != 0) {
      console.log("inside here")
      sendMessage('MainController', 'Reset')
      setTimeout(() => {
        sendMessage('LoadController', 'SetData', props.json)
      }, 100)
    }

  }, [props.json, sendMessage, unityProvider])

  const handleSetKeyframeData = useCallback(
    (jsonResult: string) => {
      console.log('handleSetKeyframeData')
      props.callback(jsonResult)
    },
    [props]
  )

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

  useEffect(() => {
    return () => {
      unload().then((r) => console.log(r))
    }
  }, [unload])

  return (
    <div className={'relative h-full w-full'}>
      <Unity
        className={'h-full w-full'}
        unityProvider={unityProvider}
        style={{
          pointerEvents: props.canEdit ? 'auto' : 'none',
        }}
        tabIndex={8282}
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
