import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
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
import { Input } from '@/components/ui/input'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { updateCenterSchema } from '../_data/schema'
import {
  deleteCenterByCenterId,
  fetchCenterById,
  updateCenterById,
} from '../_data/data'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from '@/components/ui/select'
import { getOrganizationSummary } from '@/pages/Organization/_data/data'

type CenterDetailsPageProps = {
  editable: boolean
}

export default function CenterDetailsPage(props: CenterDetailsPageProps) {
  const [loading, setLoading] = useState(false)
  const [canEdit, setCanEdit] = useState(props.editable)
  const navigate = useNavigate()
  const { id } = useParams()
  const queryClient = useQueryClient()

  const organizationQuery = useQuery({
    queryKey: ['organizations'],
    queryFn: async () => getOrganizationSummary(),
  })

  const query = useQuery({
    queryKey: ['center'],
    queryFn: async () => fetchCenterById(id ?? ''),
  })

  const updatecenterMutation = useMutation({
    mutationFn: async (data: z.infer<typeof updateCenterSchema>) => {
      return updateCenterById(id ?? '', data)
    },
    onMutate: (data) => {
      console.log(data)
      setLoading(true)
    },
    onError: (error) => {
      console.log(error)
      setLoading(false)
      // setOpen(false)
      toast('Error updating center', {
        description:
          error.message ?? 'An error occurred while updating center.',
      })
    },
    onSuccess: () => {
      console.log('success')
      setLoading(false)
      toast('Center updated successfully', {
        description: 'Center has been updated successfully.',
      })
      queryClient.invalidateQueries({ queryKey: ['center'] })
      setCanEdit(false)
      navigate('/centers')
    },
  })

  const deleteCenterMutation = useMutation({
    mutationFn: async () => {
      return deleteCenterByCenterId(id ?? '')
    },
    onMutate: (data) => {
      console.log(data)
      setLoading(true)
    },
    onError: (error) => {
      console.log(error)
      setLoading(false)
      // setOpen(false)
      toast('Error deleting center', {
        description:
          error.message ?? 'An error occurred while deleting center.',
      })
    },
    onSuccess: () => {
      console.log('success')
      setLoading(false)
      toast('Center deleted successfully', {
        description: 'Center has been deleted successfully.',
      })
      queryClient.invalidateQueries({ queryKey: ['centers'] })
      setCanEdit(false)
      navigate('/centers')
    },
  })

  const form = useForm<z.infer<typeof updateCenterSchema>>({
    resolver: zodResolver(updateCenterSchema),
    mode: `onChange`,
    defaultValues: {
      name: '',
      nameEn: '',
      address: '',
      addressEn: '',
      organizationId: '',
    },
  })

  useEffect(() => {
    if (!query.data) return
    form.setValue('name', query.data.name)
    form.setValue('nameEn', query.data.nameEn)
    form.setValue('address', query.data.address)
    form.setValue('addressEn', query.data.addressEn)
    form.setValue('organizationId', query.data.organizationId)
  }, [form, query.data])

  const cancelEdit = () => {
    query.refetch().then(() => {
      form.setValue('name', query.data?.name ?? '')
      form.setValue('nameEn', query.data?.nameEn ?? '')
      form.setValue('address', query.data?.address ?? '')
      form.setValue('addressEn', query.data?.addressEn ?? '')
      form.setValue('organizationId', query.data?.organizationId ?? '')
    })
    setCanEdit(false)
  }

  const save = () => {
    updatecenterMutation.mutate(form.getValues())
  }

  const back = () => {
    form.reset()
    navigate(-1)
  }

  const deleteOrg = () => {
    deleteCenterMutation.mutate()
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
              <CardTitle>center Details</CardTitle>
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
                          <FormLabel className='col-span-2'>
                            Chinese Name
                          </FormLabel>
                          <FormControl className='col-span-5'>
                            <Input
                              {...field}
                              placeholder='chinese name'
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
                    name='nameEn'
                    render={({ field }) => (
                      <FormItem className='flex-1'>
                        <div className='grid grid-cols-7 items-center gap-4 text-end'>
                          <FormLabel className='col-span-2'>
                            English Name
                          </FormLabel>
                          <FormControl className='col-span-5'>
                            <Input
                              {...field}
                              placeholder='english name'
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
                    name='address'
                    render={({ field }) => (
                      <FormItem className='flex-1'>
                        <div className='grid grid-cols-7 items-center gap-4 text-end'>
                          <FormLabel className='col-span-2'>
                            Address (Chinese)
                          </FormLabel>
                          <FormControl className='col-span-5'>
                            <Textarea
                              {...field}
                              placeholder='address (chinese)'
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
                    name='addressEn'
                    render={({ field }) => (
                      <FormItem className='flex-1'>
                        <div className='grid grid-cols-7 items-center gap-4 text-end'>
                          <FormLabel className='col-span-2'>
                            Address (English)
                          </FormLabel>

                          <FormControl className='col-span-5'>
                            <Textarea
                              {...field}
                              placeholder='address (english)'
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
                    name='organizationId'
                    render={({ field }) => {
                      console.log(query.data?.organizationId)

                      return (
                        <FormItem className='flex-1'>
                          <div className='grid grid-cols-7 items-center gap-4 text-end'>
                            <FormLabel className='col-span-2'>
                              Organization
                            </FormLabel>
                            <div className='col-span-5'>
                              <FormControl className='col-span-5'>
                                <Select
                                  {...field}
                                  onValueChange={(value) => {
                                    field.onChange(value)
                                  }}
                                  disabled={!canEdit}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder='Select Organization' />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectGroup>
                                      {organizationQuery.data?.map(
                                        (organization) => (
                                          <SelectItem
                                            value={organization.id}
                                            key={organization.id}
                                          >
                                            {organization.name}
                                          </SelectItem>
                                        )
                                      )}
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
                      )
                    }}
                  />
                </div>
              </Form>
            </CardContent>
            <CardFooter>
              <Button
                variant={'destructive'}
                onClick={deleteOrg}
                loading={loading}
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
