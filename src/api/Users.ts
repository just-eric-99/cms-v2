import { User } from '@/pages/Users/table/columns'

export async function getUsers(): Promise<User[]> {
  const response = await fetch(
    'https://64a6f5fc096b3f0fcc80e3fa.mockapi.io/api/users'
  )
  return await response.json()
}
