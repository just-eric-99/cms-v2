import { API_ENDPOINT } from '@/constants/network'
import {CreateRoleRequest, Role, RoleDetails} from '@/network/roles/types.ts'

export async function getAllRoles(): Promise<Role[]> {
  const roles = await fetch(API_ENDPOINT + '/role')
  // console.log(roles.json())
  return roles.json()
}

export async function getRoleById(id: string): Promise<RoleDetails> {
  const role = await fetch(API_ENDPOINT + `/role/${id}`)
  return role.json()
}

export async function createRole(role: CreateRoleRequest): Promise<void> {
  const response = await fetch(API_ENDPOINT + '/role', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(role),
  })

  if (!response.ok) {
    throw new Error('Failed to create role')
  }
}

export async function updateRole(
  role: CreateRoleRequest,
  id: string
): Promise<void> {
  const response = await fetch(API_ENDPOINT + `/role/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(role),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message ?? 'Failed to update role')
  }
}

export async function deleteRole(id: string): Promise<void> {
  const response = await fetch(API_ENDPOINT + `/role/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message ?? 'Failed to delete role')
  }
}
