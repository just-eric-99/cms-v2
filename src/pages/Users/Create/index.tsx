import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import UserCreateForm from './form'
import React from 'react'
import { createUserSchema } from '../_data/schema'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addNewUser } from '../_data/data'
import { toast } from 'sonner'

export default function CreateUserPage() {
  const [loading, setLoading] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const form = useForm<z.infer<typeof createUserSchema>>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: '',
      displayName: '',
      email: '',
      phone: undefined,
      avatar: -1,
      centerId: '',
      userGroupId: '',
    },
  })
  const queryClient = useQueryClient()
  const createUserMutation = useMutation({
    mutationFn: async (data: z.infer<typeof createUserSchema>) => {
      return addNewUser(data)
    },
    onMutate: (data) => {
      console.log(data)
      setLoading(true)
    },
    onError: (error) => {
      console.log(error)
      setLoading(false)
      setOpen(false)
      toast('Error creating user', {
        description:
          error.message ?? 'An error occurred while creating the user.',
      })
    },
    onSuccess: () => {
      console.log('success')
      setLoading(false)
      setOpen(false)
      toast('User created successfully', {
        description: 'The user has been created successfully.',
      })
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onSettled: () => {
      console.log('settled')
      setLoading(false)
      setOpen(false)
      form.reset()
    },
  })
  const onSubmit = form.handleSubmit((data) => {
    console.log('inside onsubmit', data)
    createUserMutation.mutate(data)
  })
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Create User</DialogTitle>
          <DialogDescription>
            Create a user here. Click done when you're finished.
          </DialogDescription>
        </DialogHeader>
        <div className='py-8'>
          <FormProvider {...form}>
            <UserCreateForm />
          </FormProvider>
        </div>
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
