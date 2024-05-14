import { z } from 'zod'
import { UserSummaryType } from './types'
import { createUserSchema } from './schema'
import { createUser, getAllUsers } from '@/network/users/api'
import { CreateUserRequest, User } from '@/network/users/types'

export const getUserSummary = async (): Promise<UserSummaryType[]> => {
  const users = await getAllUsers()

  const userSummary: UserSummaryType[] = users.map((user: User) => ({
    id: user.id,
    name: user.name,
    displayName: user.displayName,
    email: user.email,
    phone: user.phone,
    userGroupId: user.userGroupId,
    centerId: user.centerId,
  }))

  return userSummary
}

export const addNewUser = async (
  userSchema: z.infer<typeof createUserSchema>
): Promise<void> => {
  const user: CreateUserRequest = {
    name: userSchema.name,
    displayName: userSchema.displayName || '',
    email: userSchema.email,
    phone: userSchema.phone || undefined,
    avatar: userSchema.avatar,
    centerId: userSchema.centerId,
    userGroupId: userSchema.userGroupId,
  }

  await createUser(user)
}
