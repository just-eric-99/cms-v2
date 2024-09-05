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
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { inputPasswordSchema } from '@/pages/Auth/_data/schema.ts'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { login } from '@/network/auth/api.ts'
import { toast } from 'sonner'
import { Checkbox } from '@/components/ui/checkbox.tsx'
import { Label } from '@/components/ui/label.tsx'
import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { PasswordInput } from '@/components/custom/password-input.tsx'

export default function InputPassword() {
  const [loading, setLoading] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  if (!location.state?.email) {
    return <Navigate to='/check-email' replace />
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const form = useForm<z.infer<typeof inputPasswordSchema>>({
    resolver: zodResolver(inputPasswordSchema),
    defaultValues: {
      email: location.state.email ?? '',
      password: '',
      isRemember: false,
    },
  })

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const loginMutation = useMutation({
    mutationFn: login,
    onMutate: () => {
      setLoading(true)
    },
    onError: (error) => {
      console.log(error)
      toast.error(error.message ?? 'Please try again')
    },
    onSuccess: (data) => {
      console.log('data.challengeName', data.challengeName)
      if (data.challengeName === 'NEW_PASSWORD_REQUIRED') {
        navigate('/update-password', {
          state: { email: form.watch('email') },
        })
      } else if (data.challengeName === 'CUSTOM_CHALLENGE') {
        navigate('/email-sent-message')
      }
    },
    onSettled: () => {
      setLoading(false)
    },
  })

  const handleSubmit = form.handleSubmit((data) => {
    loginMutation.mutate(data)
  })

  return (
    <div className={'flex h-screen  items-center justify-center align-middle'}>
      <Card className='w-[350px]'>
        <CardHeader>
          <CardTitle className={'text-2xl'}>Login</CardTitle>
          <CardDescription>Please input your password.</CardDescription>
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
                        disabled={true}
                        placeholder='e.g. chantaiman@gmail.com'
                      />
                    </FormControl>
                    <FormMessage className='col-span-5 col-start-3' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormLabel className='col-span-2'>Password</FormLabel>
                    <FormControl className='col-span-5'>
                      <PasswordInput {...field} placeholder='e.g. ********' />
                    </FormControl>
                    <FormMessage className='col-span-5 col-start-3' />
                  </FormItem>
                )}
              />
              <Controller
                name='isRemember'
                control={form.control}
                render={({ field }) => (
                  <div className={'flex items-center space-x-2'}>
                    <Checkbox
                      id={'isRemember'}
                      title={'Keep me sign in'}
                      checked={form.watch('isRemember')}
                      onClick={() => field.onChange(!form.watch('isRemember'))}
                    />
                    <Label htmlFor={'isRemember'}>
                      <p className='text-sm text-muted-foreground'>
                        Keep me signed in
                      </p>
                    </Label>
                  </div>
                )}
              />
            </Form>
          </div>
        </CardContent>
        <CardFooter className={'flex-1'}>
          <Button
            onClick={handleSubmit}
            // onClick={() => console.log('form.getValues()', form.getValues())}
            loading={loading}
            disabled={loading}
            className={'flex-1'}
          >
            Send Email
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
