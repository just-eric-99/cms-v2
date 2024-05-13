export type User = {
  id: string
  name: string
  displayName: string
  userGroupId: string
  email: string
  phone: string
  avatar: number
  centerId: string
  createdAt: string
  updatedAt: string
}

export type CreateUserRequest = {
  name: string
  displayName?: string
  email: string
  phone: string
  avatar: number
  userGroupId: string
  centerId: string
}

export type UpdateUserRequest = {
  name?: string
  displayName?: string
  email?: string
  phone?: string
  avatar?: number
  userGroupId?: string
  centerId?: string
}
