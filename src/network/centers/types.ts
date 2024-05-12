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
  address: string
  organizationId: string
}

export type UpdateCenterRequest = {
  name?: string
  address?: string
  organizationId?: string
}
