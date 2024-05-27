import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { updateUserGroupSchema } from '@/pages/UserGroup/_data/schema.ts'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  deleteUserGroup,
  getUserGroupById,
  updateUserGroup,
} from '@/network/user-groups/api.ts'
import { toast } from 'sonner'
import { UpdateUserGroupRequest } from '@/network/user-groups/types.ts'
import {
  Layout,
  LayoutBody,
  LayoutHeader,
} from '@/components/custom/layout.tsx'
import { Card, CardContent, CardHeader } from '@/components/ui/card.tsx'
import { Button } from '@/components/ui/button.tsx'
import Loader from '@/components/loader.tsx'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Label } from '@/components/ui/label.tsx'
import ExerciseAssignmentPage from '@/pages/ExerciseAssignment'
import { DataTable } from '@/components/table/data-table.tsx'
import { columns } from '@/pages/Users/_table/columns.tsx'
import CreateUserPage from '@/pages/Users/Create'
import { getAllCenters } from '@/network/centers/api.ts'
import { getAllOrganization } from '@/network/organization/api.ts'

type UserGroupDetailsPageProps = {
  editable: boolean
}
export default function UserGroupDetailsPage(props: UserGroupDetailsPageProps) {
  const [loading, setLoading] = useState(false)
  const [errorLoading, setErrorLoading] = useState(false)
  const [canEdit, setCanEdit] = useState(props.editable)
  const navigate = useNavigate()
  const { id } = useParams()
  const queryClient = useQueryClient()

  const form = useForm<z.infer<typeof updateUserGroupSchema>>({
    resolver: zodResolver(updateUserGroupSchema),
    mode: `all`,
    defaultValues: {
      name: '',
    },
  })

  const updateUserGroupMutation = useMutation({
    mutationFn: async (data: z.infer<typeof updateUserGroupSchema>) => {
      const request: UpdateUserGroupRequest = {
        name: data.name,
        userIds: data.userIds.map((user) => user.userId),
      }
      return updateUserGroup(request, id ?? '')
    },
    onMutate: (data) => {
      console.log(data)
      setLoading(true)
    },
    onSuccess: async () => {
      console.log('success')
      setLoading(false)
      toast.success('User group updated successfully')
      setCanEdit(false)
      await queryClient.invalidateQueries({ queryKey: ['user-groups'] })
      await queryClient.invalidateQueries({ queryKey: ['user-group', id] })
    },
    onError: (error) => {
      console.log(error)
      setLoading(false)
      toast.error(error.message ?? 'Error updating user group')
    },
  })

  const deleteUserGroupMutation = useMutation({
    mutationFn: async () => deleteUserGroup(id ?? ''),
    onMutate: () => {
      setErrorLoading(true)
    },
    onError: (error) => {
      setErrorLoading(false)
      toast.error(error.message ?? 'Error deleting user group')
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['user-groups'] })
      setErrorLoading(false)
      toast.success(`User group deleted successfully`)
      navigate('/user-groups')
    },
    onSettled: () => {},
  })

  const query = useQuery({
    queryKey: ['user-group', id],
    queryFn: async () => {
      const userGroup = await getUserGroupById(id ?? '')
      form.reset({
        name: userGroup.name,
        userIds: userGroup.users.map((user) => ({ userId: user.id })),
      })
      return userGroup
    },
  })

  const centerQuery = useQuery({
    queryKey: ['centers'],
    queryFn: getAllCenters,
  })

  const organizationQuery = useQuery({
    queryKey: ['organizations'],
    queryFn: getAllOrganization,
  })

  const handleBack = () => {
    form.reset()
    navigate(-1)
  }

  const handleDelete = () => {
    deleteUserGroupMutation.mutate()
  }

  const handleSave = () => {
    form.handleSubmit((data) => {
      updateUserGroupMutation.mutate(data)
    })()
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
              <div className='text-xl font-bold'>User Group Details</div>
            </CardHeader>
            <CardContent>
              <div className={'flex flex-col gap-5'}>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem className='flex-1'>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder='name'
                          disabled={!canEdit}
                        />
                      </FormControl>
                      <FormMessage className='col-span-5 col-start-3' />
                    </FormItem>
                  )}
                />
                <div className={'flex flex-col gap-2'}>
                  <Label>Organisation</Label>
                  <Input
                    value={
                      organizationQuery.data?.find(
                        (organization) =>
                          organization.id ===
                          centerQuery.data?.filter(
                            (center) => center.id === query.data?.centerId
                          )[0].organizationId
                      )?.name ?? ''
                    }
                    disabled
                  />
                </div>
                <div className={'flex flex-col gap-2'}>
                  <Label>Center</Label>
                  <Input
                    value={
                      centerQuery.data?.find(
                        (center) => center.id === query.data?.centerId
                      )?.name ?? ''
                    }
                    disabled
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/*<div className={'flex flex-row gap-5'}>*/}
          <Card>
            <CardHeader>Users</CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={query.data?.users ?? []}
                navigationPath={'/users'}
                createComponent={
                  <div className={'flex flex-row gap-4'}>
                    <ExerciseAssignmentPage
                      type={'userGroup'}
                      assignedExercises={[]}
                      userGroupId={id ?? ''}
                    />
                    <CreateUserPage userGroupId={id} />
                  </div>
                }
              />
            </CardContent>
          </Card>
          {/*<Card>*/}
          {/*  <CardHeader>Users</CardHeader>*/}
          {/*  <CardContent>*/}
          {/*    <div className={'flex flex-col gap-5'}>*/}
          {/*      <div className={'flex flex-row justify-end'}>*/}
          {/*        <ExerciseAssignmentPage*/}
          {/*          type={'userGroup'}*/}
          {/*          assignedExercises={[]}*/}
          {/*          userGroupId={id ?? ''}*/}
          {/*        />*/}
          {/*      </div>*/}
          {/*      <UserGroupDetailsUserDialog*/}
          {/*        centerId={query.data?.centerId ?? ''}*/}
          {/*        canEdit={canEdit}*/}
          {/*      />*/}
          {/*    </div>*/}
          {/*  </CardContent>*/}
          {/*</Card>*/}
          {/*</div>*/}
        </LayoutBody>
      </Layout>
    </FormProvider>
  )
}
