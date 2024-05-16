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
import {
  createRoleSchema,
  updateRoleSchema,
} from '@/pages/Roles/_data/schema.ts'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import RoleCreateForm from '@/pages/Roles/Create/form.tsx'
import { Permission, Scope } from '@/enum/exercisePermission.ts'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createRole } from '@/network/roles/api.ts'
import { toast } from 'sonner'

export default function RoleCreatePage() {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const form = useForm<z.infer<typeof createRoleSchema>>({
    resolver: zodResolver(createRoleSchema),
    defaultValues: {
      title: '',
      titleEn: '',
      permissions: [
        {
          permission: Permission.USER_READ,
          scope: Scope.CENTER,
        },
      ],
    },
  })
  const queryClient = useQueryClient()

  const createRoleMutation = useMutation({
    mutationFn: async (data: z.infer<typeof updateRoleSchema>) => {
      return createRole(data)
    },
    onMutate: () => {
      setLoading(true)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['roles'] })
      setLoading(false)
      toast.success(`Role created successfully`)
      form.reset()
    },
    onError: (error) => {
      toast.error(error.message ?? 'Error creating role')
      setLoading(false)
    },
    onSettled: () => {},
  })

  const onSubmit = form.handleSubmit(async (data) => {
    await createRoleMutation.mutateAsync(data)
    form.reset()
    setOpen(false)
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <div className='text-xl font-bold'>Create Role</div>
        </DialogHeader>
        <FormProvider {...form}>
          <RoleCreateForm />
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
