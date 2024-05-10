import { z } from 'zod'
import { createUser, getUsers } from '../server/api'
import { CreateUserDTO, User } from '../server/types'
import { UserSummaryType } from './types'
import { createUserSchema } from './schema'

export const getUserSummary = async (): Promise<UserSummaryType[]> => {
  const users = await getUsers()

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
  const user: CreateUserDTO = {
    name: userSchema.name,
    displayName: userSchema.displayName || '',
    email: userSchema.email,
    phone: userSchema.phone,
    avatar: userSchema.avatar,
    centerId: userSchema.centerId,
    userGroupId: userSchema.userGroupId,
  }

  await createUser(user)
}
