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

export type CreateUserDTO = {
  name: string
  displayName: string
  email: string
  phone: string
  avatar: number
  centerId: string
  userGroupId: string
}
