import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { deleteAdmin, getAdminById, updateAdmin } from '@/network/admin/api.ts'
import { FormProvider, useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { updateAdminSchema } from '@/pages/Admin/_data/schema.ts'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import {
  Layout,
  LayoutBody,
  LayoutHeader,
} from '@/components/custom/layout.tsx'
import { Card, CardContent, CardHeader } from '@/components/ui/card.tsx'
import { Button } from '@/components/ui/button.tsx'
import Loader from '@/components/loader.tsx'
import AdminDetailsForm from '@/pages/Admin/Details/form.tsx'

type AdminDetailsPageProps = {
  editable: boolean
}

export default function AdminDetailsPage(props: AdminDetailsPageProps) {
  const [loading, setLoading] = useState(false)
  const [errorLoading, setErrorLoading] = useState(false)
  const [canEdit, setCanEdit] = useState(props.editable)
  const navigate = useNavigate()
  const { id } = useParams()
  const queryClient = useQueryClient()

  const form = useForm<z.infer<typeof updateAdminSchema>>({
    resolver: zodResolver(updateAdminSchema),
    mode: `all`,
    defaultValues: {
      name: '',
      nameEn: '',
      displayName: '',
      email: '',
      phone: '',
      centerId: '',
      roleId: '',
    },
  })

  const updateAdminMutation = useMutation({
    mutationFn: async (data: z.infer<typeof updateAdminSchema>) => {
      return updateAdmin(data, id ?? '')
    },
    onMutate: (data) => {
      console.log(data)
      setLoading(true)
    },
    onError: (error) => {
      console.log(error)
      setLoading(false)
      toast.error(`Error updating admin`)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin', id] })
      setLoading(false)
      toast.success(`Admin updated successfully`)
      setCanEdit(false)
    },
    onSettled: () => {},
  })

  const deleteAdminMutation = useMutation({
    mutationFn: async () => {
      return deleteAdmin(id ?? '')
    },
    onMutate: () => {
      setErrorLoading(true)
    },
    onError: (error) => {
      setErrorLoading(false)
      toast.error(error.message ?? 'Error deleting admin')
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin', id] })
      setErrorLoading(false)
      toast.success(`Admin deleted successfully`)
      navigate('/admins')
    },
    onSettled: () => {},
  })

  const query = useQuery({
    queryKey: ['admin', id],
    queryFn: async () => {
      const admin = await getAdminById(id ?? '')
      form.reset({
        name: admin.name,
        nameEn: admin.nameEn,
        displayName: admin.displayName,
        email: admin.email,
        phone: admin.phone,
        centerId: admin.centerId,
        roleId: admin.roleId,
      })
      return admin
    },
  })

  const handleBack = () => {
    form.reset()
    navigate(-1)
  }

  const handleDelete = () => {
    deleteAdminMutation.mutate()
  }

  const handleSave = () => {
    updateAdminMutation.mutate(form.getValues())
  }

  const handleCancel = () => {
    form.reset()
    setCanEdit(false)
  }

  if (query.isLoading) return <Loader />

  return (
    <Layout>
      <LayoutHeader></LayoutHeader>
      <LayoutBody className='flex flex-col gap-8'>
        <Card className=''>
          <CardHeader className='flex flex-col justify-between gap-6'>
            <div className='flex flex-row'>
              <Button variant={'outline'} onClick={handleBack}>
                Back
              </Button>
              <div className='flex flex-1 justify-end gap-4'>
                <Button
                  variant={'destructive'}
                  onClick={handleDelete}
                  loading={errorLoading}
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
            <div className='text-xl font-bold'>Admin Details</div>
          </CardHeader>
          <CardContent>
            <FormProvider {...form}>
              <AdminDetailsForm canEdit={canEdit} />
            </FormProvider>
          </CardContent>
        </Card>
      </LayoutBody>
    </Layout>
  )
}
