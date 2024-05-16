import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { updateRoleSchema } from '@/pages/Roles/_data/schema.ts'
import { z } from 'zod'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { deleteRole, getRoleById, updateRole } from '@/network/roles/api.ts'
import { toast } from 'sonner'
import Loader from '@/components/loader.tsx'
import {
  Layout,
  LayoutBody,
  LayoutHeader,
} from '@/components/custom/layout.tsx'
import { Card, CardContent, CardHeader } from '@/components/ui/card.tsx'
import { Button } from '@/components/ui/button.tsx'
import RoleDetailsForm from '@/pages/Roles/Details/form.tsx'

type RoleDetailsPageProps = {
  editable: boolean
}

export default function RoleDetailsPage(props: RoleDetailsPageProps) {
  const [loading, setLoading] = useState(false)
  const [errorLoading, setErrorLoading] = useState(false)
  const [canEdit, setCanEdit] = useState(props.editable)
  const navigate = useNavigate()
  const { id } = useParams()
  const queryClient = useQueryClient()

  const form = useForm<z.infer<typeof updateRoleSchema>>({
    resolver: zodResolver(updateRoleSchema),
    mode: `all`,
    defaultValues: {
      title: '',
      titleEn: '',
      permissions: [],
    },
  })

  const updateRoleMutation = useMutation({
    mutationFn: async (data: z.infer<typeof updateRoleSchema>) => {
      return updateRole(data, id ?? '')
    },
    onMutate: (data) => {
      console.log(data)
      setLoading(true)
    },
    onError: (error) => {
      console.log(error)
      setLoading(false)
    },
  })

  const deleteRoleMutation = useMutation({
    mutationFn: async () => {
      return deleteRole(id ?? '')
    },
    onMutate: () => {
      setErrorLoading(true)
    },
    onError: (error) => {
      setErrorLoading(false)
      toast.error(error.message ?? 'Error deleting role')
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['role', id] })
      setErrorLoading(false)
      toast.success(`Role deleted successfully`)
      navigate('/roles')
    },
    onSettled: () => {},
  })

  const query = useQuery({
    queryKey: ['role', id],
    queryFn: async () => {
      const role = await getRoleById(id ?? '')
      form.reset({
        title: role.title,
        titleEn: role.titleEn,
        permissions: role.rolePermissions,
      })
      return role
    },
  })

  const handleBack = () => {
    form.reset()
    navigate(-1)
  }

  const handleDelete = () => {
    deleteRoleMutation.mutate()
  }

  const handleSave = () => {
    updateRoleMutation.mutate(form.getValues())
  }

  const handleCancel = () => {
    form.reset()
    setCanEdit(false)
  }

  if (query.isLoading) return <Loader />

  return (
    <FormProvider {...form}>
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
              <div className='text-xl font-bold'>Role Details</div>
            </CardHeader>
            <CardContent>
              <RoleDetailsForm canEdit={canEdit} />
            </CardContent>
          </Card>
          <div className={'grid grid-cols-7 gap-8'}>
            <Card className={'col-span-2'}>
              {query.data?.rolePermissions.map((permission, index) => (
                <div key={index}>
                  <div>{permission.permission}</div>
                  <div>{permission.scope}</div>
                </div>
              ))}
            </Card>
            <Card className={'col-span-5'}></Card>
          </div>
        </LayoutBody>
      </Layout>
    </FormProvider>
  )
}
