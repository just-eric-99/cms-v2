import { useState } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog.tsx'
import { Button } from '@/components/ui/button.tsx'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { createAdminSchema } from '@/pages/Admin/_data/schema.ts'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAdmin } from '@/network/admin/api.ts'
import { toast } from 'sonner'
import AdminCreateForm from '@/pages/Admin/Create/form.tsx'

type AdminCreatePageProps = {
  preDefinedRoleId?: string
  preDefinedCenterId?: string
}

export default function AdminCreatePage(props: AdminCreatePageProps) {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const form = useForm<z.infer<typeof createAdminSchema>>({
    resolver: zodResolver(createAdminSchema),
    defaultValues: {
      name: '',
      nameEn: '',
      displayName: '',
      email: '',
      phone: '',
      centerId: props.preDefinedCenterId ?? '',
      roleId: props.preDefinedRoleId ?? '',
    },
  })
  const queryClient = useQueryClient()
  const createAdminMutation = useMutation({
    mutationFn: async (data: z.infer<typeof createAdminSchema>) => {
      return createAdmin(data)
    },
    onMutate: (data) => {
      console.log(data)
      setLoading(true)
    },
    onError: (error) => {
      console.log(error)
      setLoading(false)
      setOpen(false)
      toast.error(error.message ?? 'An error occurred while creating the user.')
    },
    onSuccess: async () => {
      console.log('success')
      setLoading(false)
      setOpen(false)
      toast.success('Admin created successfully', {
        description: 'Admin has been created successfully.',
      })
      await queryClient.invalidateQueries({ queryKey: ['admins'] })
      form.reset()
    },
    onSettled: () => {
      setLoading(false)
      setOpen(false)
    },
  })
  const onSubmit = form.handleSubmit((data) => {
    createAdminMutation.mutate(data)
  })
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <div className='text-xl font-bold'>Create Admin</div>
        </DialogHeader>
        <FormProvider {...form}>
          <AdminCreateForm preDefinedRoleId={props.preDefinedRoleId} preDefinedCenterId={props.preDefinedCenterId}/>
        </FormProvider>
        <DialogFooter className='gap-2 pt-2'>
          <DialogClose asChild>
            <Button loading={loading} type='submit' onClick={onSubmit}>
              Done
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
