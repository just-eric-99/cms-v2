import { useMutation, useQuery } from '@tanstack/react-query'
import { getAllExercises } from '@/network/exercises/api.ts'
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from 'react-hook-form'
import { z } from 'zod'
import { createExerciseAssignmentSchema } from '@/pages/ExerciseAssignment/_data/schema.ts'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  assignExerciseToUser,
  assignExerciseToUserGroup,
} from '@/network/exercise-assignment/api.ts'
import {
  AssignExerciseToUser,
  AssignExerciseToUserGroup,
  ExerciseAssignment,
} from '@/network/exercise-assignment/types.ts'
import { toast } from 'sonner'
import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Plus } from 'lucide-react'
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import SortableColumn from '@/pages/ExerciseAssignment/sortable/columns.tsx'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog.tsx'
import { getAllUsers } from '@/network/users/api.ts'
import { FormControl, FormItem, FormMessage } from '@/components/ui/form.tsx'
import { Label } from '@/components/ui/label.tsx'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx'
import { getAllUserGroup } from '@/network/user-groups/api.ts'
import { queryClient } from '@/main.tsx'

type ExerciseAssignmentPageProps = {
  type: 'user' | 'userGroup'
  userId?: string
  userGroupId?: string
  assignedExercises: ExerciseAssignment[]
}

export default function ExerciseAssignmentPage(
  props: ExerciseAssignmentPageProps
) {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const exercisesQuery = useQuery({
    queryKey: ['exercises'],
    queryFn: () => getAllExercises(),
  })

  const form = useForm<z.infer<typeof createExerciseAssignmentSchema>>({
    resolver: zodResolver(createExerciseAssignmentSchema),
    mode: `all`,
    defaultValues: {
      userId: props.userId ?? '',
      userGroupId: props.userGroupId ?? '',
      exercises: props.assignedExercises,
    },
  })

  const exercisesFieldArray = useFieldArray({
    name: 'exercises',
    control: form.control,
  })

  const assignExercisesToUserMutation = useMutation({
    mutationFn: async (
      data: z.infer<typeof createExerciseAssignmentSchema>
    ) => {
      const assignment: AssignExerciseToUser = {
        userId: data.userId,
        exercises: data.exercises.map((exercise) => ({
          id: exercise.id,
          name: exercise.name,
          recurrence: exercise.recurrence,
          duration: exercise.duration,
        })),
      }
      await assignExerciseToUser(assignment)
    },
    onMutate: (data) => {
      console.log(data)
      setLoading(true)
    },
    onError: (error) => {
      console.log(error)
      setLoading(false)
      // setOpen(false)
      toast.error(error.message ?? 'Error assigning exercise')
    },
    onSuccess: () => {
      console.log('success')
      setLoading(false)
      toast.success(`Exercise assigned successfully`)
      setOpen(false)
      queryClient.invalidateQueries({ queryKey: ['assigned-exercises'] })
    },
  })

  const assignExercisesToUserGroupMutation = useMutation({
    mutationFn: async (
      data: z.infer<typeof createExerciseAssignmentSchema>
    ) => {
      const assignment: AssignExerciseToUserGroup = {
        userGroupId: data.userGroupId,
        exercises: data.exercises.map((exercise) => ({
          id: exercise.id,
          name: exercise.name,
          recurrence: exercise.recurrence,
          duration: exercise.duration,
        })),
      }
      await assignExerciseToUserGroup(assignment)
    },
    onMutate: (data) => {
      console.log(data)
      setLoading(true)
    },
    onError: (error) => {
      console.log(error)
      setLoading(false)
      // setOpen(false)
      toast.error(error.message ?? 'Error assigning exercise')
    },
    onSuccess: () => {
      console.log('success')
      setLoading(false)
      toast.success(`Exercise assigned successfully`)
    },
  })

  const userQuery = useQuery({
    queryKey: ['users'],
    queryFn: getAllUsers,
  })

  const userGroupQuery = useQuery({
    queryKey: ['user-groups'],
    queryFn: getAllUserGroup,
  })

  const handleSubmitUser = form.handleSubmit((data) => {
    if (data.userId === '') {
      form.setError('userId', {
        type: 'manual',
        message: 'User is required',
      })
      return
    }
    assignExercisesToUserMutation.mutate(data)
  })

  const handleSubmitUserGroup = form.handleSubmit((data) => {
    if (data.userGroupId === '') {
      form.setError('userGroupId', {
        type: 'manual',
        message: 'User group is required',
      })
      return
    }
    assignExercisesToUserGroupMutation.mutate(data)
  })

  const getExercisePos = (id: string) =>
    form.watch('exercises').findIndex((field) => field.id === id)
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) return
    if (active.id === over.id) return

    const activeIndex = getExercisePos(active.id as string)
    const overIndex = getExercisePos(over.id as string)
    exercisesFieldArray.move(activeIndex, overIndex)
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Assign Exercises</Button>
      </DialogTrigger>
      <DialogContent className={'min-w-[80%]'}>
        <DialogHeader>
          <DialogTitle>Assign Exercises ({props.type})</DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <div className={'flex flex-col gap-4'}>
            <Controller
              control={form.control}
              name={props.type === 'user' ? 'userId' : 'userGroupId'}
              render={({ field, fieldState }) => (
                <FormControl>
                  <FormItem>
                    <Label className={fieldState.error && 'text-destructive'}>
                      {props.type === 'user' ? 'User' : 'User Group'}
                    </Label>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={
                        props.type === 'user'
                          ? props.userId !== undefined
                          : props.userGroupId !== undefined
                      }
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={`Select ${props.type === 'user' ? 'User' : 'User Group'}`}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {props.type === 'user' &&
                            userQuery.data?.map((user) => (
                              <SelectItem value={user.id} key={user.id}>
                                {user.name}
                              </SelectItem>
                            ))}
                          {props.type === 'userGroup' &&
                            userGroupQuery.data?.map((userGroup) => (
                              <SelectItem
                                value={userGroup.id}
                                key={userGroup.id}
                              >
                                {userGroup.name}
                              </SelectItem>
                            ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage {...field} />

                    {fieldState.error && (
                      <p className={'text-sm font-medium text-destructive'}>
                        {fieldState.error?.message}
                      </p>
                    )}
                  </FormItem>
                </FormControl>
              )}
            />

            <div className={'flex max-h-96 flex-row gap-2'}>
              <Card className={'flex flex-1 flex-col overflow-y-scroll'}>
                <CardHeader>
                  <div className={'text-xl font-bold'}>Available Exercises</div>
                </CardHeader>
                <CardContent className={'flex flex-col gap-5'}>
                  {exercisesQuery.data
                    ?.filter((exercise) => {
                      if (!form.watch('exercises')) return true
                      return !form
                        .watch('exercises')
                        .find((field) => field.id === exercise.id)
                    })
                    // .filter((user) => user.centerId === props.centerId)
                    .map((exercise) => (
                      <div
                        key={exercise.id}
                        className='flex flex-row items-center justify-between rounded-lg border p-5'
                      >
                        <div>{exercise.name}</div>
                        <Button
                          size={'icon'}
                          onClick={() =>
                            exercisesFieldArray.append({
                              id: exercise.id,
                              name: exercise.name,
                              recurrence: 1,
                              duration: 1,
                            })
                          }
                        >
                          <Plus />
                        </Button>
                      </div>
                    ))}
                </CardContent>
              </Card>

              <Card className={'flex flex-1 flex-col overflow-y-scroll'}>
                <CardHeader>
                  <div className={'text-xl font-bold'}>Selected Exercises</div>
                </CardHeader>
                <CardContent className={'flex flex-col gap-5 '}>
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableColumn data={form.watch('exercises')} />
                  </DndContext>
                </CardContent>
              </Card>
            </div>
          </div>
        </FormProvider>
        <DialogFooter>
          <Button
            onClick={() => {
              if (props.type === 'user') {
                handleSubmitUser()
              } else {
                handleSubmitUserGroup()
              }
            }}
            loading={loading}
          >
            Assign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
