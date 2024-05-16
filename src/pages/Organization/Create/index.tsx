import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { createOrganizationSchema } from '../_data/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import OrganizationCreateForm from './form'
import { createOrganization } from '@/network/organization/api.ts'

export default function CreateOrganizationPage() {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const form = useForm<z.infer<typeof createOrganizationSchema>>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      name: '',
      nameEn: '',
    },
  })
  const queryClient = useQueryClient()
  const createOrganizationMutation = useMutation({
    mutationFn: async (data: z.infer<typeof createOrganizationSchema>) => {
      return createOrganization(data)
    },
    onMutate: (data) => {
      console.log(data)
      setLoading(true)
    },
    onError: (error) => {
      console.log(error)
      setLoading(false)
      setOpen(false)
      toast.error(error.message ?? 'Error creating organization')
    },
    onSuccess: () => {
      console.log('success')
      setLoading(false)
      toast.success(`Organization created successfully`)
      queryClient.invalidateQueries({ queryKey: ['organizations'] })
      setOpen(false)
    },
    onSettled: () => {
      console.log('settled')
      setLoading(false)
      setOpen(false)
      form.reset()
    },
  })

  const onSubmit = form.handleSubmit((data) => {
    createOrganizationMutation.mutate(data)
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Create Organization</DialogTitle>
        </DialogHeader>
        <div className='py-5'>
          <FormProvider {...form}>
            <OrganizationCreateForm />
          </FormProvider>
        </div>
        <DialogFooter className='gap-2'>
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
