import { ExerciseAssignment } from '@/network/exercise-assignment/types.ts'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useFormContext } from 'react-hook-form'
import { z } from 'zod'
import { createExerciseAssignmentSchema } from '@/pages/ExerciseAssignment/_data/schema.ts'
import { Button } from '@/components/ui/button.tsx'
import { Input } from '@/components/ui/input.tsx'
import { GripVertical, Trash2 } from 'lucide-react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form.tsx'

type SortableExerciseCardProps = {
  sortableExerciseAssignment: ExerciseAssignment
}

export default function SortableExerciseCard(props: SortableExerciseCardProps) {
  const form = useFormContext<z.infer<typeof createExerciseAssignmentSchema>>()
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: props.sortableExerciseAssignment.id,
    })

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  }
  // const idx =
  // form
  //   .watch('exercises')
  //   .findIndex(
  //     (exercise) => exercise.id === props.sortableExerciseAssignment.id
  //   )
  //
  // console.log('idx', idx)

  return (
    <div
      style={style}
      className='flex touch-none flex-row items-center justify-between gap-5 rounded-lg border p-4 align-middle shadow-md'
    >
      <Button
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        size={'icon'}
        variant={'ghost'}
      >
        <GripVertical />
      </Button>
      <div className={' flex flex-col'}>
        <div className={' flex flex-row justify-between text-lg font-bold'}>
          <div>{props.sortableExerciseAssignment.name}</div>
          <Button
            size={'icon'}
            variant={'destructive'}
            onClick={() => {
              const idx = form
                .watch('exercises')
                .findIndex(
                  (exercise) =>
                    exercise.id === props.sortableExerciseAssignment.id
                )

              form.setValue(
                'exercises',
                form.watch('exercises').filter((_, i) => i !== idx)
              )
            }}
          >
            <Trash2 />
          </Button>
        </div>

        <div className={'flex gap-5'}>
          <Form {...form}>
            <FormField
              control={form.control}
              name={`exercises.${form.watch('exercises').findIndex((exercise) => exercise.id === props.sortableExerciseAssignment.id)}.duration`}
              render={({ field }) => (
                <FormItem className=' flex-1'>
                  <FormLabel className=' col-span-2'>Duration</FormLabel>
                  <FormControl className=' col-span-5'>
                    <Input
                      {...field}
                      placeholder=' duration'
                      value={field.value as number}
                      onChange={(e) => {
                        field.onChange(parseFloat(e.target.value))
                      }}
                      type={'number'}
                    />
                  </FormControl>
                  <FormMessage className=' col-span-5 col-start-3' />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`exercises.${form.watch('exercises').findIndex((exercise) => exercise.id === props.sortableExerciseAssignment.id)}.recurrence`}
              render={({ field }) => (
                <FormItem className=' flex-1'>
                  <FormLabel className=' col-span-2'>Recurrence</FormLabel>
                  <FormControl className=' col-span-5'>
                    <Input
                      {...field}
                      placeholder='recurrence'
                      type={'number'}
                      value={field.value as number}
                      onChange={(e) => {
                        field.onChange(parseFloat(e.target.value))
                      }}
                    />
                  </FormControl>
                  <FormMessage className=' col-span-5 col-start-3' />
                </FormItem>
              )}
            />
          </Form>
        </div>
      </div>
    </div>
  )
}
