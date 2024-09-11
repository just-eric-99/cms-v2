import { API_ENDPOINT } from '@/constants/network'
import { LoginRequest, LoginResponse } from './types'
import { axiosInstance } from '@/network/axios.ts'

export async function checkEmail(email: string): Promise<boolean> {
  const response = await axiosInstance.post('/auth/check-email', {
    email: email,
  })

  if (!response.data) {
    throw new Error('Failed to check email')
  }

  return response.data
}

export async function login(request: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(API_ENDPOINT + `/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    throw new Error('Failed to login')
  }

  return response.json()
}

export async function verifyMagicLink(token: string): Promise<void> {
  const response = await axiosInstance.post(`/auth/callback/${token}`)

  console.log('response', response.data)
  if (!response.data) {
    throw new Error('Failed to verify magic link')
  }

  // const response = await fetch(API_ENDPOINT + `/auth/callback/${token}`, {
  //   method: 'POST',
  //   credentials: 'include',
  //   headers: {
  //     // 'Access-Control-Allow-Credentials': 'true',
  //     // 'Access-Control-Allow-Origin': 'http://localhost:5173',
  //     SameSite: 'None',
  //     // Secure: 'true',
  //   },
  // })
  //
  // if (!response.ok) {
  //   throw new Error('Failed to verify magic link')
  // }
}

export async function updatePassword(password: string): Promise<void> {
  const response = await fetch(API_ENDPOINT + `/auth/new-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      password: password,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to update password')
  }
}
