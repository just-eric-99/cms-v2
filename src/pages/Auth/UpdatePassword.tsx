import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { updatePasswordSchema } from '@/pages/Auth/_data/schema.ts'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
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
import { PasswordInput } from '@/components/custom/password-input.tsx'
import { Button } from '@/components/ui/button.tsx'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { updatePassword } from '@/network/auth/api.ts'
import { useSetAtom } from 'jotai'
import { isAuthenticatedAtom } from '@/state/global.ts'

export default function UpdatePassword() {
  const [loading, setLoading] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const setAuthenticated = useSetAtom(isAuthenticatedAtom)

  useEffect(() => {
    const email = location.state?.email
    console.log('email', email)
    if (!email) {
      navigate('/check-email')
    } else {
      console.log('email', email)
    }
  }, [location.state?.email, navigate])

  const form = useForm<z.infer<typeof updatePasswordSchema>>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  const updatePasswordMutation = useMutation({
    mutationFn: updatePassword,
    onMutate: () => {
      setLoading(true)
    },
    onError: (error) => {
      console.log(error)
      toast.error(error.message ?? 'Please try again')
    },
    onSuccess: () => {
      toast.success('Password updated successfully')
      // set authenticated = true
      setAuthenticated(true)
      navigate('/users')
    },
    onSettled: () => {
      setLoading(false)
    },
  })

  const handleSubmit = form.handleSubmit(async (data) => {
    console.log('data', data)
    await updatePasswordMutation.mutateAsync(data.password)
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
              <FormField
                control={form.control}
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormLabel className='col-span-2'>
                      Confirm Password
                    </FormLabel>
                    <FormControl className='col-span-5'>
                      <PasswordInput {...field} placeholder='e.g. ********' />
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
            // onClick={handleSubmit}
            onClick={() => setAuthenticated(true)}
            loading={loading}
            disabled={loading}
            className={'flex-1'}
          >
            Update
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
