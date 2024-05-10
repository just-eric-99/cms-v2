import React from 'react'
import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { DataTable } from './_table/data-table'
import { columns } from './_table/columns'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { addNewUser, getUserSummary } from './_data/client/data'
import { FormProvider, useForm } from 'react-hook-form'
import { createUserSchema } from './_data/client/schema'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { Button } from '@/components/ui/button'
import UserCreateForm from './Create/form'
import { toast } from 'sonner'

export default function Users() {
  const [loading, setLoading] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const form = useForm<z.infer<typeof createUserSchema>>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: '',
      displayName: '',
      email: '',
      phone: '',
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
  const query = useQuery({
    queryKey: ['users'],
    queryFn: () => getUserSummary(),
  })

  const onSubmit = form.handleSubmit((data) => {
    console.log('inside onsubmit', data)
    createUserMutation.mutate(data)
  })

  return (
    <Layout>
      <LayoutHeader>
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <UserNav />
        </div>
      </LayoutHeader>
      <LayoutBody>
        <DataTable
          columns={columns}
          data={query.data ?? []}
          createComponent={
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant='outline'>Create</Button>
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
          }
        />
      </LayoutBody>
    </Layout>
  )
}
