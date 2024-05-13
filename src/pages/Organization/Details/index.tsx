import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout'
import {
  deleteOrganizationByOrgId,
  getOrganizationByOrgId,
  updateOrganizationById,
} from '../_data/data'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { updateOrganizationSchema } from '../_data/schema'
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

type OrganizationDetailsPageProps = {
  editable: boolean
}

export default function OrganizationDetailsPage(
  props: OrganizationDetailsPageProps
) {
  const [loading, setLoading] = useState(false)
  const [canEdit, setCanEdit] = useState(props.editable)
  const navigate = useNavigate()
  const { id } = useParams()
  const queryClient = useQueryClient()
  const query = useQuery({
    queryKey: ['organization'],
    queryFn: async () => getOrganizationByOrgId(id ?? ''),
  })
  const updateOrganizationMutation = useMutation({
    mutationFn: async (data: z.infer<typeof updateOrganizationSchema>) => {
      return updateOrganizationById(data, id ?? '')
    },
    onMutate: (data) => {
      console.log(data)
      setLoading(true)
    },
    onError: (error) => {
      console.log(error)
      setLoading(false)
      // setOpen(false)
      toast('Error updating organization', {
        description:
          error.message ?? 'An error occurred while updating organization.',
      })
    },
    onSuccess: () => {
      console.log('success')
      setLoading(false)
      toast('Organization updated successfully', {
        description: 'Organization has been updated successfully.',
      })
      queryClient.invalidateQueries({ queryKey: ['organization'] })
      setCanEdit(false)
      navigate('/organizations')
    },
  })

  const deleteOrganizationMutation = useMutation({
    mutationFn: async () => {
      return deleteOrganizationByOrgId(id ?? '')
    },
    onMutate: (data) => {
      console.log(data)
      setLoading(true)
    },
    onError: (error) => {
      console.log(error)
      setLoading(false)
      // setOpen(false)
      toast('Error deleting organization', {
        description:
          error.message ?? 'An error occurred while deleting organization.',
      })
    },
    onSuccess: () => {
      console.log('success')
      setLoading(false)
      toast('Organization deleted successfully', {
        description: 'Organization has been deleted successfully.',
      })
      queryClient.invalidateQueries({ queryKey: ['organizations'] })
      setCanEdit(false)
      navigate('/organizations')
    },
  })

  const form = useForm<z.infer<typeof updateOrganizationSchema>>({
    resolver: zodResolver(updateOrganizationSchema),
    defaultValues: {
      name: '',
      nameEn: '',
    },
  })

  useEffect(() => {
    if (!query.data) return
    form.setValue('name', query.data.name)
    form.setValue('nameEn', query.data.nameEn)
  }, [form, query.data])

  const cancelEdit = () => {
    query.refetch().then(() => {
      form.setValue('name', query.data?.name ?? '')
      form.setValue('nameEn', query.data?.nameEn ?? '')
    })
    setCanEdit(false)
  }

  const save = () => {
    updateOrganizationMutation.mutate(form.getValues())
  }

  const back = () => {
    form.reset()
    navigate(-1)
  }

  const deleteOrg = () => {
    deleteOrganizationMutation.mutate()
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
              <CardTitle>Organization Details</CardTitle>
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
