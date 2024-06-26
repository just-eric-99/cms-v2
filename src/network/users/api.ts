import { API_ENDPOINT } from '@/constants/network'
import { CreateUserRequest, UpdateUserRequest, User } from './types'

export async function getAllUsers(): Promise<User[]> {
  // to add take and skip when implementing server side pagination
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
  user: UpdateUserRequest,
  id: string
): Promise<void> {
  const response = await fetch(API_ENDPOINT + `/user/${id}`, {
    method: 'PUT',
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
