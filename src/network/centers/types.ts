import { Organization } from '../organization/types'
import { User } from '../users/types'

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
  users: User[]
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
