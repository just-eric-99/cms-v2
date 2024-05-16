import { Center } from '@/network/centers/types.ts'

export type Organization = {
  id: string
  name: string
  nameEn: string
  createdAt: string
  updatedAt: string
  centers: Center[]
}

export type CreateOrganizationRequest = {
  name: string
  nameEn: string
}

export type UpdateOrganizationRequest = {
  name?: string
  nameEn?: string
}
