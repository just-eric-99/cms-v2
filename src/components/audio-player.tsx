import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { getVoice } from '@/network/text-to-speech/api.ts'
import { LoaderCircle } from 'lucide-react'

type AudioPlayerProps = {
  src: string
}
export default function AudioPlayer(props: AudioPlayerProps) {
  const audioRef = React.useRef<HTMLAudioElement>(null)

  const getTextToSpeech = useQuery({
    queryKey: ['text-to-speech', props.src],
    queryFn: async () => getVoice(props.src),
  })

  React.useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = props.src
      audioRef.current.load()
    }
  }, [props.src])

  if (props.src === '') {
    return null
  }
  if (getTextToSpeech.isLoading) {
    return <LoaderCircle className='animate-spin' size={32} />
  }

  return (
    <audio
      ref={audioRef}
      controls
      src={getTextToSpeech.data}
      key={getTextToSpeech.data}
    />
  )
}
