import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { createCenter } from '@/network/centers/api'
import { createCenterSchema } from '../_data/schema'
import CenterCreateForm from './form'

export default function CreateCenterPage() {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const form = useForm<z.infer<typeof createCenterSchema>>({
    resolver: zodResolver(createCenterSchema),
    defaultValues: {
      name: '',
      nameEn: '',
      address: '',
      addressEn: '',
      organizationId: '',
    },
  })
  const queryClient = useQueryClient()
  const createCenterMutation = useMutation({
    mutationFn: async (data: z.infer<typeof createCenterSchema>) => {
      return createCenter(data)
    },
    onMutate: (data) => {
      console.log(data)
      setLoading(true)
    },
    onError: (error) => {
      console.log(error)
      setLoading(false)
      setOpen(false)
      toast('Error creating center', {
        description:
          error.message ?? 'An error occurred while creating the user.',
      })
    },
    onSuccess: () => {
      console.log('success')
      setLoading(false)
      setOpen(false)
      toast('Center created successfully', {
        description: 'Center has been created successfully.',
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
    createCenterMutation.mutate(data)
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <div className='text-xl font-bold'>Create Center</div>
        </DialogHeader>
        <FormProvider {...form}>
          <CenterCreateForm />
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
