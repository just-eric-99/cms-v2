import React, { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { getExerciseVoiceByExerciseIdAndFilename } from '@/network/exercises/api.ts'

type AudioPlayerProps = {
  exerciseId?: string
  filename?: string
}

export default function AudioPlayer(props: AudioPlayerProps) {
  const audioRef = React.useRef<HTMLAudioElement>(null!)

  const getVoiceByExerciseIdQuery = useQuery({
    enabled: props.exerciseId !== undefined,
    queryKey: ['voice', "" + props.exerciseId + props.filename],
    queryFn: async () =>
      getExerciseVoiceByExerciseIdAndFilename(
        props.exerciseId ?? '',
        props.filename ?? ''
      ),
  })

  useEffect(() => {
    if (audioRef.current) {
      if (props.exerciseId) {
        audioRef.current.src = getVoiceByExerciseIdQuery.data ?? ''
      } else if (props.filename) {
        audioRef.current.src = getVoiceByExerciseIdQuery.data ?? ''
      }
      audioRef.current.load()
    }
  }, [
    getVoiceByExerciseIdQuery.data,
    props.exerciseId,
    props.filename,
  ])

  if (getVoiceByExerciseIdQuery.isLoading) {
    return <Loader2 size={32} className='animate-spin' />
  }

  if (props.exerciseId !== undefined) {
    return (
      <audio ref={audioRef} controls src={getVoiceByExerciseIdQuery.data} />
    )
  }

  return null
}
