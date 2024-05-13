export type Center = {
  id: string
  name: string
  address: string
  organizationId: string
  createdAt: string
  updatedAt: string
}

export type CreateCenterRequest = {
  name: string
  nameEn: string
  address: string
  addressEn: string
  organizationId: string
}

export type UpdateCenterRequest = {
  name?: string
  nameEn?: string
  address?: string
  addressEn?: string
  organizationId?: string
}
