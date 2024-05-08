import { getUsers } from '@/api/Users'
import { User } from '../table/columns'

export const getUsersData = (): Promise<User[]> => {
  return getUsers()
}
