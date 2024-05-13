import {
  createOrganization,
  deleteOrganization,
  getAllOrganization,
  getOrganizationById,
  updateOrganization,
} from '@/network/organization/api'
import { OrganizationSummaryType } from './OrganizationSummaryType'
import {
  CreateOrganizationRequest,
  Organization,
  UpdateOrganizationRequest,
} from '@/network/organization/types'
import { createOrganizationSchema, updateOrganizationSchema } from './schema'
import { z } from 'zod'

export const getOrganizationSummary = async (): Promise<
  OrganizationSummaryType[]
> => {
  const users = await getAllOrganization()

  const organizationSummary: OrganizationSummaryType[] = users.map(
    (org: Organization) => ({
      id: org.id,
      name: org.name,
      nameEn: org.nameEn,
      createdAt: org.createdAt,
      updatedAt: org.updatedAt,
    })
  )

  return organizationSummary
}

export const addNewOrganization = async (
  organizationSchema: z.infer<typeof createOrganizationSchema>
): Promise<void> => {
  const organization: CreateOrganizationRequest = {
    name: organizationSchema.name,
    nameEn: organizationSchema.nameEn,
  }

  await createOrganization(organization)
}

export function getOrganizationByOrgId(id: string): Promise<Organization> {
  return getOrganizationById(id)
}

export function updateOrganizationById(
  organizationSchema: z.infer<typeof updateOrganizationSchema>,
  id: string
): Promise<void> {
  const organization: UpdateOrganizationRequest = {
    name: organizationSchema.name,
    nameEn: organizationSchema.nameEn,
  }

  return updateOrganization(organization, id)
}

export function deleteOrganizationByOrgId(id: string): Promise<void> {
  return deleteOrganization(id)
}
