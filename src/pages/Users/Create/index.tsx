import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout'
import ThemeSwitch from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import { UserNav } from '@/components/user-nav'
import { FormProvider, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { createUserSchema } from '../_data/client/schema'
import UserCreateForm from './components/form'
import { useMutation } from '@tanstack/react-query'
import { addNewUser } from '../_data/client/data'
import React from 'react'

export default function UserCreatePage() {
  const [loading, setLoading] = React.useState(false)
  const navigate = useNavigate()
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

  const createUserMutation = useMutation({
    mutationFn: async (data: z.infer<typeof createUserSchema>) => {
      console.log(data)

      return addNewUser(data)
    },

    onMutate: (data) => {
      console.log(data)
      setLoading(true)
    },
    onError: (error) => {
      console.log(error)
      setLoading(false)
    },
    onSuccess: () => {
      console.log('success')
      setLoading(false)
    },
    onSettled: () => {
      console.log('settled')
      navigate('/users')
    },
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
        <div className='container'>
          <div className='flex items-center justify-between'>
            <h1 className='text-2xl font-semibold'>Create User</h1>
            <div className='flex items-center justify-end gap-4 py-4'>
              <Link to='/users'>
                <Button variant={'secondary'}>Back</Button>
              </Link>

              <Button onClick={onSubmit} loading={loading}>
                Done
              </Button>
            </div>
          </div>
          <FormProvider {...form}>
            <UserCreateForm />
          </FormProvider>
        </div>
      </LayoutBody>
    </Layout>
  )
}
