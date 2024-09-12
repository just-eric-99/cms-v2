import { useNavigate, useSearchParams } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { respondCustomChallenge } from '@/network/auth/api.ts'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { useCookies } from 'react-cookie'
import { AWS_COGNITO_AUTH_SESSION_AGE } from '@/constants/network.ts'

export default function VerifyMagicLink() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const [cookies, setCookie, removeCookie] = useCookies()

  const verifyMagicLinkMutation = useMutation({
    mutationFn: respondCustomChallenge,
    onMutate: () => {
      console.log('onMutate')
    },
    onError: (error) => {
      console.log(error)
      // toast.error(error.message ?? 'Please try again')
      // navigate('/check-email')
    },
    onSuccess: (data) => {
      if (data.AuthenticationResult) {
        const isRemember = cookies.isRemember
        setCookie('accessToken', data.AuthenticationResult?.AccessToken, {
          maxAge: data.AuthenticationResult?.ExpiresIn
        })
        if (isRemember) {
          setCookie('refreshToken', data.AuthenticationResult?.RefreshToken, {
            maxAge: data.AuthenticationResult?.ExpiresIn
          })
        }
        // remove
        removeCookie('sub')
        removeCookie('session')
        removeCookie('isRemember')
      } else {
        setCookie('sub', cookies['sub'], {
          maxAge: AWS_COGNITO_AUTH_SESSION_AGE,
        })
        setCookie('session', data.Session, {
          maxAge: AWS_COGNITO_AUTH_SESSION_AGE,
        })
        setCookie('isRemember', cookies['isRemember'], {
          maxAge: AWS_COGNITO_AUTH_SESSION_AGE,
        })
      }
      console.log('onSuccess', data)
    },
    onSettled: () => {
      console.log('onSettled')
    },
  })

  useEffect(() => {
    const token = params.get('token')
    if (token) {
      verifyMagicLinkMutation.mutate({
        sub: cookies.sub,
        session: cookies.session,
        answer: token
      })
    } else {
      toast.error('Invalid token', {
        duration: 5000,
        onAutoClose: () => navigate('/check-email'),
      })
    }
  }, [])

  return (
    <div>
      {verifyMagicLinkMutation.isPending && (
        <div>Verifying...</div>
      )}

      {verifyMagicLinkMutation.isError && (
        <div>Error verifying</div>
      )}

      {verifyMagicLinkMutation.isSuccess && (
        <div>Verified</div>
      )}
    </div>
  )
}
