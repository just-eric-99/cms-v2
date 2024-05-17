import { User } from '@/network/users/types.ts'

export type UserGroup = {
  id: string
  name: string
  centerId: string
  createdAt: string
  updatedAt: string
}

export type UserGroupDetail = {
  id: string
  name: string
  centerId: string
  createdAt: string
  updatedAt: string
  users: User[]
}

export type CreateUserGroupRequest = {
  name: string
  centerId: string
  userIds: string[]
}

export type UpdateUserGroupRequest = {
  name: string
  userIds: string[]
}
