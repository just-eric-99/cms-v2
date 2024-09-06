import { useNavigate, useSearchParams } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { verifyMagicLink } from '@/network/auth/api.ts'
import { useEffect } from 'react'
import { toast } from 'sonner'

export default function VerifyMagicLink() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpzbWdjdGZ3QGhvdG1haWwuY29tIiwiY29kZSI6IjA5MjM0NiIsImV4cCI6MTcyNTU1MzAxNywiaWF0IjoxNzI1NTUyODM3fQ.ZFxGJLC-GPPjWSMLiVIMgCYlttT-fp-x__v0LqGPVyI

  const verifyMagicLinkMutation = useMutation({
    mutationFn: verifyMagicLink,
    onMutate: () => {
      console.log('onMutate')
    },
    onError: (error) => {
      console.log(error)
      // toast.error(error.message ?? 'Please try again')
      // navigate('/check-email')
    },
    onSuccess: (data) => {
      console.log('onSuccess', data)
    },
    onSettled: () => {
      console.log('onSettled')
    },
  })

  useEffect(() => {
    const token = params.get('token')
    if (token) {
      verifyMagicLinkMutation.mutate(token)
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
