import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout'
import {
  deleteOrganizationByOrgId,
  getOrganizationByOrgId,
  updateOrganizationById,
} from '../_data/data'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { updateOrganizationSchema } from '../_data/schema'
import { zodResolver } from '@hookform/resolvers/zod'

import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import OrganizationDetailsForm from './form'

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
      setErrorLoading(true)
    },
    onError: (error) => {
      console.log(error)
      setErrorLoading(false)
      // setOpen(false)
      toast('Error deleting organization', {
        description:
          error.message ?? 'An error occurred while deleting organization.',
      })
    },
    onSuccess: () => {
      console.log('success')
      setErrorLoading(false)
      toast('Organization deleted successfully', {
        description: 'Organization has been deleted successfully.',
      })
      queryClient.invalidateQueries({ queryKey: ['organizations'] })
      setCanEdit(false)
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
      </LayoutBody>
    </Layout>
  )
}
