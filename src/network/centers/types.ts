import { Organization } from '../organization/types'
import { User } from '../users/types'
import { Admin } from '@/network/admin/types.ts'

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

// for center detail page
export type CenterWithUsersAndAdmins = {
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
  admins: Admin[]
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
