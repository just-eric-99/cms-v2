import { Organization } from '../organization/types'

export type Center = {
  id: string
  name: string
  nameEn: string
  address: string
  addressEn: string
  organizationId: string
  createdAt: string
  updatedAt: string
  organization: Organization
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
