import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useState } from 'react'

export default function ExerciseCreateDialog() {
  const [loading, setLoading] = useState(false)
  const onSubmit = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[1200px]'>
        <DialogHeader>
          <DialogTitle>Create Exercise</DialogTitle>
        </DialogHeader>

        <DialogFooter className='gap-2'>
          <DialogClose asChild>
            <Button loading={loading} type='submit' onClick={onSubmit}>
              Done
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
