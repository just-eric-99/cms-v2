import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { updateCenterSchema } from '../_data/schema'
import CenterDetailsForm from './form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import CenterDetailsUserSummary from './users'
import CenterDetailsAdminSummary from './admins'
import {
  deleteCenter,
  getCenterById,
  updateCenter,
} from '@/network/centers/api.ts'
import Loader from '@/components/loader.tsx'

type CenterDetailsPageProps = {
  editable: boolean
}

export default function CenterDetailsPage(props: CenterDetailsPageProps) {
  const [loading, setLoading] = useState(false)
  const [errorLoading, setErrorLoading] = useState(false)
  const [canEdit, setCanEdit] = useState(props.editable)
  const navigate = useNavigate()
  const { id } = useParams()
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['center', id],
    queryFn: async () => {
      const center = await getCenterById(id ?? '')
      form.reset({
        name: center.name,
        nameEn: center.nameEn,
        address: center.address,
        addressEn: center.addressEn,
        organizationId: center.organizationId,
      })
      return center
    },
  })

  const updateCenterMutation = useMutation({
    mutationFn: async (data: z.infer<typeof updateCenterSchema>) => {
      return updateCenter(data, id ?? '')
    },
    onMutate: (data) => {
      console.log(data)
      setLoading(true)
    },
    onError: (error) => {
      console.log(error)
      setLoading(false)
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
    },
  })

  const deleteCenterMutation = useMutation({
    mutationFn: async () => deleteCenter(id ?? ''),
    onMutate: (data) => {
      console.log(data)
      setErrorLoading(true)
    },
    onError: (error) => {
      console.log(error)
      setErrorLoading(false)
      // setOpen(false)
      toast('Error deleting center', {
        description:
          error.message ?? 'An error occurred while deleting center.',
      })
    },
    onSuccess: () => {
      console.log('success')
      setErrorLoading(false)
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
    mode: `all`,
    defaultValues: {
      name: query.data?.name ?? '',
      nameEn: query.data?.nameEn ?? '',
      address: query.data?.address ?? '',
      addressEn: query.data?.addressEn ?? '',
      organizationId: query.data?.organizationId ?? '',
    },
  })

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
    updateCenterMutation.mutate(form.getValues())
  }

  const back = () => {
    form.reset()
    navigate(-1)
  }

  const deleteOrg = () => {
    deleteCenterMutation.mutate()
  }

  if (query.isLoading) return <Loader />

  return (
    <Layout>
      <LayoutHeader></LayoutHeader>
      <LayoutBody className='flex flex-col gap-8'>
        <Card className=''>
          <CardHeader className='flex flex-col justify-between gap-6'>
            <div className='flex flex-row'>
              <Button variant={'outline'} onClick={back}>
                Back
              </Button>
              <div className='flex flex-1 justify-end gap-4'>
                <Button
                  variant={'destructive'}
                  onClick={deleteOrg}
                  loading={errorLoading}
                >
                  Delete
                </Button>
                {canEdit && (
                  <>
                    <Button loading={loading} onClick={save}>
                      Save
                    </Button>
                    <Button variant={'outline'} onClick={cancelEdit}>
                      Cancel
                    </Button>
                  </>
                )}

                {!canEdit && (
                  <Button onClick={() => setCanEdit(true)}>Edit</Button>
                )}
              </div>
            </div>
            <div className='text-xl font-bold'>Center Details</div>
          </CardHeader>
          <CardContent>
            <FormProvider {...form}>
              <CenterDetailsForm canEdit={canEdit} />
            </FormProvider>
          </CardContent>
        </Card>

        <Card>
          <CardHeader></CardHeader>
          <CardContent>
            <Tabs defaultValue='users' className='w-full'>
              <TabsList>
                <TabsTrigger className='min-w-32' value='users'>
                  Users
                </TabsTrigger>
                <TabsTrigger className='min-w-32' value='admins'>
                  Admins
                </TabsTrigger>
              </TabsList>

              <TabsContent value='users'>
                <CenterDetailsUserSummary
                  userSummary={query.data?.users ?? []}
                  centerId={query.data?.id ?? ''}
                />
              </TabsContent>
              <TabsContent value='admins'>
                <CenterDetailsAdminSummary
                  adminSummary={query.data?.admins ?? []}
                  centerId={query.data?.id ?? ''}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </LayoutBody>
    </Layout>
  )
}
