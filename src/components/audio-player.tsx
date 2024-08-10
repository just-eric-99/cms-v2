import React, { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { getExerciseVoiceById } from '@/network/exercises/api.ts'
import { getVoice } from '@/network/text-to-speech/api.ts'

type AudioPlayerProps = {
  exerciseId?: string
  filename?: string
}

export default function AudioPlayer(props: AudioPlayerProps) {
  const audioRef = React.useRef<HTMLAudioElement>(null!)

  const getVoiceByExerciseIdQuery = useQuery({
    enabled: props.exerciseId !== undefined,
    queryKey: ['voice', props.exerciseId],
    queryFn: async () => getExerciseVoiceById(props.exerciseId ?? ''),
  })

  const getVoiceByFilenameQuery = useQuery({
    enabled: props.filename !== undefined,
    retryDelay: 4000,
    queryKey: ['voice', props.filename],
    queryFn: async () => getVoice(props.filename ?? ''),
  })

  useEffect(() => {
    if (audioRef.current) {
      if (props.exerciseId) {
        audioRef.current.src = getVoiceByExerciseIdQuery.data ?? ''
      } else if (props.filename) {
        audioRef.current.src = getVoiceByFilenameQuery.data ?? ''
      }
      audioRef.current.load()
    }
  }, [
    getVoiceByExerciseIdQuery.data,
    getVoiceByFilenameQuery.data,
    props.exerciseId,
    props.filename,
  ])

  if (
    getVoiceByExerciseIdQuery.isLoading ||
    getVoiceByFilenameQuery.isLoading
  ) {
    return <Loader2 size={32} className='animate-spin' />
  }

  if (props.exerciseId !== undefined) {
    return (
      <audio ref={audioRef} controls src={getVoiceByExerciseIdQuery.data} />
    )
  }

  if (props.filename !== undefined) {
    return <audio ref={audioRef} controls src={getVoiceByFilenameQuery.data} />
  }

  return null
}
