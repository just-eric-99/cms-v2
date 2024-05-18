import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createUserGroupSchema } from '@/pages/UserGroup/_data/schema.ts'
import { zodResolver } from '@hookform/resolvers/zod'
import { createUserGroup } from '@/network/user-groups/api.ts'
import { toast } from 'sonner'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog.tsx'
import { Button } from '@/components/ui/button.tsx'
import UserGroupsCreateForm from '@/pages/UserGroup/Create/form.tsx'
import { CreateUserGroupRequest } from '@/network/user-groups/types.ts'

export default function CreateUserGroupPage() {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const form = useForm<z.infer<typeof createUserGroupSchema>>({
    resolver: zodResolver(createUserGroupSchema),
    defaultValues: {
      name: '',
      centerId: '',
      userIds: [
        {
          userId: '',
        },
      ],
    },
  })

  const queryClient = useQueryClient()
  const createUserGroupMutation = useMutation({
    mutationFn: async (data: z.infer<typeof createUserGroupSchema>) => {
      const request: CreateUserGroupRequest = {
        name: data.name,
        centerId: data.centerId,
        userIds: data.userIds.map((user) => user.userId),
      }
      return createUserGroup(request)
    },
    onMutate: (data) => {
      console.log(data)
      setLoading(true)
    },
    onError: (error) => {
      console.log(error)
      setLoading(false)
      setOpen(false)
      toast.error(error.message ?? 'Error creating user group')
    },
    onSuccess: () => {
      console.log('success')
      setLoading(false)
      toast.success(`User group created successfully`)
      queryClient.invalidateQueries({ queryKey: ['user-groups'] })
      setOpen(false)
    },
    onSettled: () => {
      console.log('settled')
      setLoading(false)
      setOpen(false)
      form.reset()
    },
  })

  const onSubmit = form.handleSubmit((data) => {
    createUserGroupMutation.mutate(data)
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Create Organization</DialogTitle>
        </DialogHeader>
        <div className='py-5'>
          <FormProvider {...form}>
            <UserGroupsCreateForm />
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
