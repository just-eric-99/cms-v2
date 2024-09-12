import { useMutation } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useCookies } from 'react-cookie'
import { respondCustomChallenge } from '@/network/auth/api.ts'
import { AWS_COGNITO_AUTH_SESSION_AGE } from '@/constants/network.ts'
import { Button } from '@/components/ui/button.tsx'

export default function EmailSentMessage() {
  const [loading, setLoading] = useState(false)
  const [cookies, setCookie] = useCookies()
  const [methods, setMethods] = useState<('EMAIL' | 'SMS')[]>([])
  const [selectedMethod, setSelectedMethod] = useState<
    'EMAIL' | 'SMS' | undefined
  >()

  useEffect(() => {
    responseToChallenge()
  }, [])

  const selectAuthMethodMutation = useMutation({
    mutationFn: respondCustomChallenge,
    onMutate: () => {
      setLoading(true)
    },
    onError: (error) => {
      console.log(error)
      // if (error instanceof NotAuthorizedException)
      toast.error(error.message ?? 'Please try again')
    },
    onSuccess: (data) => {
      setCookie('sub', cookies['sub'], {
        maxAge: AWS_COGNITO_AUTH_SESSION_AGE,
      })
      setCookie('session', data.Session, {
        maxAge: AWS_COGNITO_AUTH_SESSION_AGE,
      })
      setCookie('isRemember', cookies['isRemember'], {
        maxAge: AWS_COGNITO_AUTH_SESSION_AGE,
      })
      if (data.ChallengeParameters?.methods)
        setMethods(
          data.ChallengeParameters?.methods.split(',') as ('EMAIL' | 'SMS')[]
        )
    },
    onSettled: () => {
      setLoading(false)
    },
  })

  function responseToChallenge(
    method: 'EMAIL' | 'SMS' | undefined = selectedMethod
  ) {
    selectAuthMethodMutation.mutate({
      session: cookies['session'],
      sub: cookies['sub'],
      answer: 'SEND',
      method,
    })
  }

  function onMethodSelected(method: 'EMAIL' | 'SMS') {
    setSelectedMethod(method)
    responseToChallenge(method)
  }

  return (
    <div>
      {selectedMethod && (
        <div>
          The email has been sent to your email address. Please close this tab
          and check your email.
          <Button onClick={() => responseToChallenge()}>
            Resend
          </Button>
        </div>
      )}
      {!selectedMethod &&
        methods.map((method) => (
          <Button key={method} onClick={() => onMethodSelected(method)}>
            {method}
          </Button>
        ))}
    </div>
  )
}
