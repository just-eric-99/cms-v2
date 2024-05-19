import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { updateUserSchema } from '../_data/schema'
import { toast } from 'sonner'
import { deleteUser, getUserById, updateUser } from '@/network/users/api'
import UserDetailsForm from '@/pages/Users/Details/form.tsx'
import Loader from '@/components/loader.tsx'

type UserDetailPageProps = {
  editable: boolean
}

export default function UserDetailsPage(props: UserDetailPageProps) {
  const [loading, setLoading] = useState(false)

  const [deleteLoading, setDeleteLoading] = useState(false)
  const [canEdit, setCanEdit] = useState(props.editable)
  const navigate = useNavigate()
  const { id } = useParams()
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const user = await getUserById(id ?? '')
      form.setValue('name', user.name)
      form.setValue('displayName', user.displayName)
      form.setValue('email', user.email)
      form.setValue('phone', user.phone)
      form.setValue('avatar', user.avatar)
      form.setValue('centerId', user.centerId)
      form.setValue('userGroupId', user.userGroupId)
      return user
    },
  })

  const updateUserMutation = useMutation({
    mutationFn: async (data: z.infer<typeof updateUserSchema>) => {
      return updateUser(data, id ?? '')
    },
    onMutate: (data) => {
      console.log(data)
      setLoading(true)
    },
    onError: (error) => {
      console.log(error)
      setLoading(false)
      // setOpen(false)
      toast('Error updating user', {
        description: error.message ?? 'An error occurred while updating user.',
      })
    },
    onSuccess: () => {
      console.log('success')
      setLoading(false)
      toast('User updated successfully', {
        description: 'User has been updated successfully.',
      })
      queryClient.invalidateQueries({ queryKey: ['users'] })
      setCanEdit(false)
      navigate('/users')
    },
  })

  const deleteUserMutation = useMutation({
    mutationFn: async () => {
      return deleteUser(id ?? '')
    },
    onMutate: (data) => {
      console.log(data)
      setDeleteLoading(true)
    },
    onError: (error) => {
      console.log(error)
      setDeleteLoading(false)
      // setOpen(false)
      toast('Error deleting user', {
        description: error.message ?? 'An error occurred while deleting user.',
      })
    },
    onSuccess: () => {
      console.log('success')
      setDeleteLoading(false)
      toast('Center deleted successfully', {
        description: 'Center has been deleted successfully.',
      })
      queryClient.invalidateQueries({ queryKey: ['users'] })
      setCanEdit(false)
      navigate(-1)
    },
  })

  const form = useForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
    mode: `onChange`,
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

  // useEffect(() => {
  //   if (!query.data) return
  //   form.setValue('name', query.data.name)
  //   form.setValue('displayName', query.data.displayName)
  //   form.setValue('email', query.data.email)
  //   form.setValue('phone', query.data.phone)
  //   form.setValue('avatar', query.data.avatar)
  //   form.setValue('centerId', query.data.centerId)
  //   form.setValue('userGroupId', query.data.userGroupId)
  // }, [form, query.data])

  const handleCancel = () => {
    query.refetch().then(() => {
      form.setValue('name', query.data?.name ?? '')
      form.setValue('displayName', query.data?.displayName ?? '')
      form.setValue('email', query.data?.email ?? '')
      form.setValue('phone', query.data?.phone ?? '')
      form.setValue('avatar', query.data?.avatar ?? -1)
      form.setValue('centerId', query.data?.centerId ?? '')
      form.setValue('userGroupId', query.data?.userGroupId ?? '')
    })
    setCanEdit(false)
  }

  const handleSave = () => {
    updateUserMutation.mutate(form.getValues())
  }

  const handleDelete = () => {
    deleteUserMutation.mutate()
  }

  const handleBack = () => {
    form.reset()
    navigate(-1)
  }

  if (query.isLoading) {
    return <Loader />
  }
  return (
    <Layout>
      <LayoutHeader>
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <UserNav />
        </div>
      </LayoutHeader>
      <LayoutBody>
        <Card>
          <CardHeader className='flex flex-col justify-between gap-6'>
            <div className='flex flex-row'>
              <Button variant={'outline'} onClick={handleBack}>
                Back
              </Button>
              <div className='flex flex-1 justify-end gap-4'>
                <Button
                  variant={'destructive'}
                  onClick={handleDelete}
                  loading={deleteLoading}
                >
                  Delete
                </Button>
                {canEdit && (
                  <>
                    <Button loading={loading} onClick={handleSave}>
                      Save
                    </Button>
                    <Button variant={'outline'} onClick={handleCancel}>
                      Cancel
                    </Button>
                  </>
                )}

                {!canEdit && (
                  <Button onClick={() => setCanEdit(true)}>Edit</Button>
                )}
              </div>
            </div>
            <div className='text-xl'>User Details</div>
          </CardHeader>
          <CardContent>
            <FormProvider {...form}>
              <UserDetailsForm canEdit={canEdit} />
            </FormProvider>
          </CardContent>
        </Card>
      </LayoutBody>
    </Layout>
  )
}
