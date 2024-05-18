import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { updateOrganizationSchema } from '../_data/schema'
import { zodResolver } from '@hookform/resolvers/zod'

import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import OrganizationDetailsForm from './form'
import {
  deleteOrganization,
  getOrganizationById,
  updateOrganization,
} from '@/network/organization/api.ts'
import Loader from '@/components/loader.tsx'
import { useState } from 'react'
import OrganizationDetailsCenterSummary from '@/pages/Organization/Details/centers'

type OrganizationDetailsPageProps = {
  editable: boolean
}

export default function OrganizationDetailsPage(
  props: OrganizationDetailsPageProps
) {
  const [loading, setLoading] = useState(false)
  const [errorLoading, setErrorLoading] = useState(false)
  const [canEdit, setCanEdit] = useState(props.editable)
  const navigate = useNavigate()
  const { id } = useParams()
  const queryClient = useQueryClient()
  const query = useQuery({
    queryKey: ['organization'],
    queryFn: async () => {
      const org = await getOrganizationById(id ?? '')
      form.reset({
        name: org.name,
        nameEn: org.nameEn,
      })
      return org
    },
  })
  const updateOrganizationMutation = useMutation({
    mutationFn: async (data: z.infer<typeof updateOrganizationSchema>) => {
      return updateOrganization(data, id ?? '')
    },
    onMutate: (data) => {
      console.log(data)
      setLoading(true)
    },
    onError: (error) => {
      console.log(error)
      setLoading(false)
      // setOpen(false)
      toast.error(error.message ?? 'Error updating organization')
    },
    onSuccess: () => {
      console.log('success')
      setLoading(false)
      toast.success('Organization updated successfully')
      queryClient.invalidateQueries({ queryKey: ['organization', id] })
      setCanEdit(false)
    },
  })

  const deleteOrganizationMutation = useMutation({
    mutationFn: async () => {
      return deleteOrganization(id ?? '')
    },
    onMutate: (data) => {
      console.log(data)
      setErrorLoading(true)
    },
    onError: (error) => {
      console.log(error)
      setErrorLoading(false)
      toast.error(error.message ?? 'Error deleting organization')
    },
    onSuccess: () => {
      console.log('success')
      setErrorLoading(false)
      toast.success('Organization deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['organizations'] })
      navigate('/organizations')
      setCanEdit(false)
    },
  })

  const form = useForm<z.infer<typeof updateOrganizationSchema>>({
    resolver: zodResolver(updateOrganizationSchema),
    mode: `all`,
    defaultValues: {
      name: '',
      nameEn: '',
    },
  })

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

  if (query.isLoading) return <Loader />

  return (
    <Layout>
      <LayoutHeader>
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <UserNav />
        </div>
      </LayoutHeader>
      <LayoutBody className='flex flex-col gap-8'>
        <Card>
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
            <div className='text-xl'>Organization Details</div>
          </CardHeader>
          <CardContent>
            <FormProvider {...form}>
              <OrganizationDetailsForm canEdit={canEdit} />
            </FormProvider>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>Center</CardHeader>
          <CardContent>
            <OrganizationDetailsCenterSummary
              centerSummary={query.data?.centers ?? []}
              organizationId={query.data?.id ?? ''}
            />
          </CardContent>
        </Card>
      </LayoutBody>
    </Layout>
  )
}
