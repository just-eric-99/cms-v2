import { API_ENDPOINT } from '@/constants/network'
import {
  CreateOrganizationRequest,
  Organization,
  UpdateOrganizationRequest,
} from './types'

export async function getAllOrganization(): Promise<Organization[]> {
  const organizations = await fetch(API_ENDPOINT + '/organization')
  return organizations.json()
}

export async function getOrganizationById(id: string): Promise<Organization> {
  const organization = await fetch(API_ENDPOINT + `/organization/${id}`)
  return organization.json()
}

export async function createOrganization(
  organization: CreateOrganizationRequest
): Promise<void> {
  const response = await fetch(API_ENDPOINT + `/organization`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(organization),
  })

  if (!response.ok) {
    throw new Error('Failed to create organization')
  }
}

export async function updateOrganization(
  organization: UpdateOrganizationRequest,
  id: string
): Promise<void> {
  const response = await fetch(API_ENDPOINT + `/organization/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(organization),
  })

  if (!response.ok) {
    throw new Error('Failed to update organization')
  }
}

export async function deleteOrganization(id: string): Promise<void> {
  const response = await fetch(API_ENDPOINT + `/organization/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('Failed to delete organization')
  }
}
