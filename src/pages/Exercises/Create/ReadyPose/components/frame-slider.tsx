import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import * as Slider from '@radix-ui/react-slider'
import { Triangle } from 'lucide-react'
import { useState } from 'react'

type FrameSliderProps = {
  duration: number
  onPointerDown?: (event: React.PointerEvent<HTMLDivElement>) => void
  onValueChange: (value: number) => void
  onValueCommit?: (value: number) => void
}

const FrameSlider = (props: FrameSliderProps) => {
  const [value, setValue] = useState([props.duration])
  return (
    <Slider.Root
      className='relative h-1.5 flex-grow rounded-full bg-primary'
      value={value}
      min={0}
      max={props.duration}
      onValueChange={(value) => {
        setValue(value)
        props.onValueChange(value[0])
      }}
      onPointerDown={(event) => {
        props.onPointerDown && props.onPointerDown(event)
      }}
      onValueCommit={(value) => {
        props.onValueCommit && props.onValueCommit(value[0])
      }}
    >
      <Slider.Track>
        <Slider.Range />
      </Slider.Track>
      <Slider.Thumb
        className='relative top-1 hover:cursor-pointer'
        onDrag={() => {
          console.log('drag')
        }}
      >
        <HoverCard open>
          <HoverCardTrigger>
            <Triangle />
          </HoverCardTrigger>
          <HoverCardContent
            side='bottom'
            avoidCollisions={false}
            className='flex h-10 w-auto items-center justify-center rounded-lg align-middle hover:cursor-pointer'
          >
            {(() => {
              const minutes = Math.floor(value[0] / 60)
              const seconds = Math.floor(value[0] % 60)
              return `${minutes}:${seconds.toString().padStart(2, '0')}`
            })()}
          </HoverCardContent>
        </HoverCard>
      </Slider.Thumb>
    </Slider.Root>
  )
}

export default FrameSlider
