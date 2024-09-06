import { API_ENDPOINT } from '@/constants/network'
import { LoginRequest, LoginResponse } from './types'

export async function adminLogin(
  request: LoginRequest
): Promise<LoginResponse> {
  const response = await fetch(API_ENDPOINT + '/auth/login', {
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

export async function tokenCallback(token: string): Promise<void> {
  const response = await fetch(API_ENDPOINT + `/auth/callback/${token}`, {
    method: 'POST',
  })

  if (!response.ok) {
    throw new Error('Failed to verify token')
  }
}

export async function setNewPassword(password: string): Promise<void> {
  const response = await fetch(API_ENDPOINT + '/auth/new-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password }),
  })

  if (!response.ok) {
    throw new Error('Failed to change password')
  }
}

export async function refreshToken(): Promise<void> {
  const response = await fetch(API_ENDPOINT + '/auth/refresh', {
    method: 'POST',
  })

  if (!response.ok) {
    throw new Error('Failed to refresh token')
  }
}

export async function checkEmail(email: string): Promise<boolean> {
  const response = await fetch(API_ENDPOINT + `/auth/check-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to check email')
  }

  return response.json()
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
  const response = await fetch(API_ENDPOINT + `/auth/callback/${token}`, {
    method: 'POST',
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Failed to verify magic link')
  }
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
