import { checkEmailSchema } from '@/pages/Auth/_data/schema.ts'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.tsx'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Button } from '@/components/ui/button.tsx'
import { useMutation } from '@tanstack/react-query'
import { checkEmail } from '@/network/auth/api.ts'
import { useState } from 'react'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

export default function CheckEmail() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const form = useForm<z.infer<typeof checkEmailSchema>>({
    resolver: zodResolver(checkEmailSchema),
    defaultValues: {
      email: '',
    },
  })

  const checkEmailMutation = useMutation({
    mutationFn: checkEmail,
    onMutate: () => {
      setLoading(true)
    },
    onError: (error) => {
      console.log(error)
      toast.error(error.message ?? 'Please try again')
    },
    onSuccess: (data) => {
      if (data) {
        navigate('/input-password', {
          state: { email: form.watch('email') },
        })
      } else {
        toast.error('Invalid email')
      }
    },
    onSettled: () => {
      setLoading(false)
    },
  })

  const handleSubmit = form.handleSubmit((data) => {
    checkEmailMutation.mutate(data.email)
  })

  return (
    <div className={'flex h-screen  items-center justify-center align-middle'}>
      <Card className='w-[350px]'>
        <CardHeader>
          <CardTitle className={'text-2xl'}>Login</CardTitle>
          <CardDescription>Please verify your email below.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className={'space-y-2'}>
            <Form {...form}>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormLabel className='col-span-2'>Email</FormLabel>
                    <FormControl className='col-span-5'>
                      <Input
                        {...field}
                        placeholder='e.g. chantaiman@gmail.com'
                      />
                    </FormControl>
                    <FormMessage className='col-span-5 col-start-3' />
                  </FormItem>
                )}
              />
            </Form>
          </div>
        </CardContent>
        <CardFooter className={'flex-1'}>
          <Button
            onClick={handleSubmit}
            loading={loading}
            disabled={loading}
            className={'flex-1'}
          >
            Next
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
