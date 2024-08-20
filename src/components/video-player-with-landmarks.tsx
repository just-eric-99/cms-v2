import React, { useEffect, useRef } from 'react'
import { Pose, POSE_CONNECTIONS } from '@mediapipe/pose'
import {
  NormalizedLandmarkList,
  drawConnectors,
  drawLandmarks,
} from '@mediapipe/drawing_utils'
import { Button } from '@/components/ui/button.tsx'
import {
  DownloadIcon,
  Expand,
  Eye,
  EyeOff,
  PauseCircle,
  PlayCircle,
} from 'lucide-react'
import * as Slider from '@radix-ui/react-slider'
import { API_ENDPOINT } from '@/constants/network.ts'

function formatTime(time: number): string {
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

type VideoPlayerWithLandmarkProps = {
  userExerciseId: string
}

export default function VideoPlayerWithLandmark({
  userExerciseId,
}: VideoPlayerWithLandmarkProps) {
  // delay for the video to load

  const pose = new Pose({
    locateFile: (file: string) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
    },
  })

  pose.setOptions({
    modelComplexity: 2,
    smoothLandmarks: true,
    enableSegmentation: true,
    smoothSegmentation: true,
  })

  const url = `${API_ENDPOINT}/user-exercise/record/${userExerciseId}/download`
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [showLandmark, setShowLandmark] = React.useState(false)
  const [playing, setPlaying] = React.useState(false)
  const [duration, setDuration] = React.useState(0)
  const [currentTime, setCurrentTime] = React.useState(0)

  useEffect(() => {
    const videoElement = videoRef.current
    const canvasElement = canvasRef.current
    const canvasCtx = canvasElement?.getContext('2d')

    if (!videoElement || !canvasElement || !canvasCtx) return

    // add no-cors mode
    fetch(url).then((response) => {
      response.blob().then((blob) => {
        videoElement.src = URL.createObjectURL(blob)

        videoElement.addEventListener('loadeddata', () => {
          setDuration(videoElement.duration)
          startEstimation(videoElement)
        })
      })
    })

    pose.onResults(onResults)

    function startEstimation(video: HTMLVideoElement): void {
      const width = video.clientWidth
      const height = video.clientHeight

      if (canvasElement === null) return
      canvasElement.width = width
      canvasElement.height = height

      // video.play()

      async function detectionFrame(): Promise<void> {
        // video.playbackRate = 2;
        // videoElement.pause();
        if (videoElement === null) return
        await pose.send({ image: videoElement })
        video.requestVideoFrameCallback(detectionFrame)
      }

      video.requestVideoFrameCallback(detectionFrame)
    }

    function onResults(results: {
      image: CanvasImageSource
      poseLandmarks: NormalizedLandmarkList | undefined
    }): void {
      if (
        canvasCtx === null ||
        canvasCtx === undefined ||
        canvasElement === null ||
        results.poseLandmarks === undefined ||
        results.poseLandmarks === null ||
        videoElement === null ||
        videoRef.current === null
      )
        return
      canvasCtx.save()
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height)

      canvasCtx.drawImage(
        results.image,
        0,
        0,
        canvasElement.width,
        canvasElement.height
      )

      canvasCtx.globalCompositeOperation = 'destination-atop'
      canvasCtx.drawImage(
        results.image,
        0,
        0,
        canvasElement.width,
        canvasElement.height
      )
      canvasCtx.globalCompositeOperation = 'source-over'

      drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS)
      drawLandmarks(canvasCtx, results.poseLandmarks)

      // videoElement.play()
      canvasCtx.restore()
    }

    return () => {
      videoElement.pause()
      videoElement.src = ''
      pose.close()
    }
  }, [url, videoRef])

  useEffect(() => {
    if (videoRef.current === null) return
    videoRef.current?.addEventListener('timeupdate', () => {
      if (videoRef.current === null) return
      setCurrentTime(videoRef.current.currentTime)
    })

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      videoRef.current?.removeEventListener('timeupdate', () => {})
    }
  }, [])

  return (
    <div className={'flex h-[500px] w-[500px] flex-col'}>
      <div className={'relative m-auto h-full bg-black'}>
        <video
          controls={false}
          muted={false}
          ref={videoRef}
          autoPlay={false}
          crossOrigin='anonymous'
          className={'max-h-[460px]'}
          onPause={() => {
            setPlaying(false)
          }}
          onPlaying={() => {
            setPlaying(true)
          }}
        />
        <canvas
          ref={canvasRef}
          className={'absolute top-0'}
          hidden={!showLandmark}
        />
      </div>
      <div className={'z-10 flex h-[40px] items-center gap-0.5 bg-primary'}>
        {!playing ? (
          <Button
            size={'icon'}
            onClick={() => {
              videoRef.current?.play()
            }}
          >
            <PlayCircle />
          </Button>
        ) : (
          <Button
            size={'icon'}
            onClick={() => {
              videoRef.current?.pause()
            }}
          >
            <PauseCircle />
          </Button>
        )}

        <Slider.Root
          className='relative flex h-1.5 flex-grow items-center rounded-full bg-primary'
          value={[currentTime]}
          step={0.01}
          min={0}
          max={duration}
          onValueChange={(value) => {
            videoRef.current?.pause()
            setCurrentTime(value[0])
            // videoRef.current.currentTime = value[0];
          }}
          onValueCommit={(value) => {
            setCurrentTime(value[0])
            if (videoRef.current === null) return
            videoRef.current.pause()
            videoRef.current.currentTime = value[0]
            videoRef.current.pause()
          }}
        >
          <Slider.Track
            className={'relative h-1 flex-grow rounded-full bg-slate-400'}
          >
            <Slider.Range
              className={'absolute h-full rounded-full bg-secondary'}
            />
          </Slider.Track>
          <Slider.Thumb
            className={'block h-5 w-5 rounded-full bg-white shadow'}
          />
        </Slider.Root>

        <div className={'min-w-24 p-2 text-right text-primary-foreground'}>
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
        <Button
          size={'icon'}
          onClick={() => {
            setShowLandmark(!showLandmark)
          }}
        >
          {!showLandmark ? <EyeOff /> : <Eye />}
        </Button>
        <Button
          size={'icon'}
          onClick={() => {
            const a = document.createElement('a')
            a.href = url
            a.download = 'video.mp4'
            a.click()
          }}
        >
          <DownloadIcon />
        </Button>
        <Button
          size={'icon'}
          onClick={() => {
            document.documentElement.requestFullscreen().catch((e) => {
              console.error(e)
            })
          }}
        >
          <Expand />
        </Button>
      </div>
    </div>
  )
}
