import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { updateUserSchema } from '../_data/schema'
import { getUserByUserId, updateUserById } from '../_data/data'
import { toast } from 'sonner'
import { deleteUser } from '@/network/users/api'
import { Input } from '@/components/ui/input'
import { getAllCenters } from '@/network/centers/api'

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
    queryFn: async () => getUserByUserId(id ?? ''),
  })

  const centerQuery = useQuery({
    queryKey: ['centers'],
    queryFn: getAllCenters,
  })

  const updateUserMutation = useMutation({
    mutationFn: async (data: z.infer<typeof updateUserSchema>) => {
      return updateUserById(data, id ?? '')
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
      navigate('/users')
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

  useEffect(() => {
    if (!query.data) return
    form.setValue('name', query.data.name)
    form.setValue('displayName', query.data.displayName)
    form.setValue('email', query.data.email)
    form.setValue('phone', query.data.phone)
    form.setValue('avatar', query.data.avatar)
    form.setValue('centerId', query.data.centerId)
    form.setValue('userGroupId', query.data.userGroupId)
  }, [form, query.data])

  const cancelEdit = () => {
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

  const save = () => {
    updateUserMutation.mutate(form.getValues())
  }

  const onDelete = () => {
    deleteUserMutation.mutate()
  }

  const back = () => {
    form.reset()
    navigate(-1)
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
        <div className='container flex justify-center align-middle'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between'>
              <CardTitle>User Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <div className='flex flex-1 flex-col justify-start gap-8'>
                  <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                      <FormItem className='flex-1'>
                        <div className='grid grid-cols-7 items-center gap-4 text-end'>
                          <FormLabel className='col-span-2'>Name</FormLabel>
                          <FormControl className='col-span-5'>
                            <Input
                              {...field}
                              placeholder='name'
                              disabled={!canEdit}
                            />
                          </FormControl>
                        </div>
                        <div className='grid grid-cols-7 gap-4'>
                          <FormMessage className='col-span-5 col-start-3' />
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='displayName'
                    render={({ field }) => (
                      <FormItem className='flex-1'>
                        <div className='grid grid-cols-7 items-center gap-4 text-end'>
                          <FormLabel className='col-span-2'>
                            Display Name
                          </FormLabel>
                          <FormControl className='col-span-5'>
                            <Input
                              {...field}
                              placeholder='display name'
                              disabled={!canEdit}
                            />
                          </FormControl>
                        </div>
                        <div className='grid grid-cols-7 gap-4'>
                          <FormMessage className='col-span-5 col-start-3' />
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem className='flex-1'>
                        <div className='grid grid-cols-7 items-center gap-4 text-end'>
                          <FormLabel className='col-span-2'>Email</FormLabel>
                          <FormControl className='col-span-5'>
                            <Input
                              {...field}
                              placeholder='email'
                              disabled={!canEdit}
                            />
                          </FormControl>
                        </div>
                        <div className='grid grid-cols-7 gap-4'>
                          <FormMessage className='col-span-5 col-start-3' />
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='phone'
                    render={({ field }) => (
                      <FormItem className='flex-1'>
                        <div className='grid grid-cols-7 items-center gap-4 text-end'>
                          <FormLabel className='col-span-2'>Phone</FormLabel>
                          <FormControl className='col-span-5'>
                            <Input
                              {...field}
                              required
                              placeholder='phone'
                              disabled={!canEdit}
                            />
                          </FormControl>
                        </div>
                        <div className='grid grid-cols-7 gap-4'>
                          <FormMessage className='col-span-5 col-start-3' />
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='avatar'
                    render={({ field }) => (
                      <FormItem className='flex-1'>
                        <div className='grid grid-cols-7 items-center gap-4 text-end'>
                          <FormLabel className='col-span-2'>Avatar</FormLabel>
                          <div className='col-span-5'>
                            <FormControl className='col-span-5'>
                              <Select
                                disabled={!canEdit}
                                value={field.value.toString()}
                                onValueChange={(value) =>
                                  field.onChange(parseInt(value))
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder='Select Avatar' />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectItem value={'0'}>Male</SelectItem>
                                    <SelectItem value={'1'}>Female</SelectItem>
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </FormControl>
                          </div>
                        </div>
                        <div className='grid grid-cols-7 gap-4'>
                          <FormMessage className='col-span-5 col-start-3' />
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='centerId'
                    render={({ field }) => (
                      <FormItem className='flex-1'>
                        <div className='grid grid-cols-7 items-center gap-4 text-end'>
                          <FormLabel className='col-span-2'>Center</FormLabel>
                          <div className='col-span-5'>
                            <FormControl>
                              <Select
                                disabled={!canEdit}
                                {...field}
                                onValueChange={(value) => field.onChange(value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder='Select Center' />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    {centerQuery.data?.map((center) => (
                                      <SelectItem
                                        value={center.id}
                                        key={center.id}
                                      >
                                        {center.name}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </FormControl>
                          </div>
                        </div>
                        <div className='grid grid-cols-7 gap-4'>
                          <FormMessage className='col-span-5 col-start-3' />
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='userGroupId'
                    render={({ field }) => (
                      <FormItem className='flex-1'>
                        <div className='grid grid-cols-7 items-center gap-4 text-end'>
                          <FormLabel className='col-span-2'>
                            User Group
                          </FormLabel>
                          <div className='col-span-5'>
                            <FormControl>
                              <Select
                                disabled={!canEdit}
                                onValueChange={(value) => field.onChange(value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder='Select a user group' />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectItem
                                      value={
                                        '62f84b5e-05d0-47a9-aaae-95c100c94099'
                                      }
                                    >
                                      User Group 1
                                    </SelectItem>
                                    <SelectItem
                                      value={
                                        '088a93fa-be3f-44b3-8ec1-cb11d70356d2'
                                      }
                                    >
                                      User Group 2
                                    </SelectItem>
                                    <SelectItem
                                      value={
                                        '6e2a01d8-37d1-4d63-afbd-ffc93c4135d0'
                                      }
                                    >
                                      User Group 3
                                    </SelectItem>
                                    <SelectItem
                                      value={
                                        '0b827cb1-ec30-44b1-ae9a-ae23ffc31a5f'
                                      }
                                    >
                                      User Group 4
                                    </SelectItem>
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </FormControl>
                          </div>
                        </div>
                        <div className='grid grid-cols-7 gap-4'>
                          <FormMessage className='col-span-5 col-start-3' />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </Form>
            </CardContent>
            <CardFooter>
              <Button
                variant={'destructive'}
                onClick={onDelete}
                loading={deleteLoading}
              >
                Delete
              </Button>

              {!canEdit && (
                <div className='flex flex-1 justify-end gap-4'>
                  <Button variant={'outline'} onClick={back}>
                    Back
                  </Button>

                  <Button onClick={() => setCanEdit(true)}>Edit</Button>
                </div>
              )}
              {canEdit && (
                <div className='flex flex-1 justify-end gap-4'>
                  <Button variant={'outline'} onClick={cancelEdit}>
                    Cancel
                  </Button>
                  <Button loading={loading} onClick={save}>
                    Save
                  </Button>
                </div>
              )}
            </CardFooter>
          </Card>
        </div>
      </LayoutBody>
    </Layout>
  )
}
