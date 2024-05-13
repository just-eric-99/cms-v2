import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { createOrganizationSchema } from '../_data/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addNewOrganization } from '../_data/data'
import { toast } from 'sonner'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import OrganizationCreateForm from './form'

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
      return addNewOrganization(data)
    },
    onMutate: (data) => {
      console.log(data)
      setLoading(true)
    },
    onError: (error) => {
      console.log(error)
      setLoading(false)
      setOpen(false)
      toast('Error creating organization', {
        description:
          error.message ?? 'An error occurred while creating the user.',
      })
    },
    onSuccess: () => {
      console.log('success')
      setLoading(false)
      setOpen(false)
      toast('Organization created successfully', {
        description: 'Organization has been created successfully.',
      })
      queryClient.invalidateQueries({ queryKey: ['organizations'] })
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
          <DialogTitle>Create User</DialogTitle>
          <DialogDescription>
            Create a user here. Click done when you're finished.
          </DialogDescription>
        </DialogHeader>
        <div className='py-8'>
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
