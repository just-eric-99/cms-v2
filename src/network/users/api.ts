import { API_ENDPOINT } from '@/constants/network'
import { CreateUserRequest, User } from './types'

export async function getAllUsers(): Promise<User[]> {
  const users = await fetch(API_ENDPOINT + '/user')
  return users.json()
}

export async function getUserById(id: string): Promise<User> {
  const user = await fetch(API_ENDPOINT + `/user/${id}`)
  return user.json()
}

export async function createUser(user: CreateUserRequest): Promise<void> {
  const response = await fetch(API_ENDPOINT + '/user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  })

  if (!response.ok) {
    throw new Error('Failed to create user')
  }
}

export async function updateUser(
  user: CreateUserRequest,
  id: string
): Promise<void> {
  const response = await fetch(API_ENDPOINT + `/user/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  })

  if (!response.ok) {
    throw new Error('Failed to update user')
  }
}

export async function deleteUser(id: string): Promise<void> {
  const response = await fetch(API_ENDPOINT + `/user/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('Failed to delete user')
  }
}
