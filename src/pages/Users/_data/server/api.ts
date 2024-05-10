import { CreateUserDTO, User } from './types'

const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT

export async function getUsers(): Promise<User[]> {
  const response = await fetch(API_ENDPOINT + '/users')
  return await response.json()
}

export async function createUser(user: CreateUserDTO): Promise<void> {
  const response = await fetch(API_ENDPOINT + '/users', {
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
