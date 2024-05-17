import {
  CreateUserGroupRequest,
  UpdateUserGroupRequest,
  UserGroup,
  UserGroupDetail,
} from '@/network/user-groups/types.ts'
import { API_ENDPOINT } from '@/constants/network.ts'

export async function getAllUserGroup(): Promise<UserGroup[]> {
  const roles = await fetch(API_ENDPOINT + '/user-group')
  // console.log(roles.json())
  return roles.json()
}

export async function getUserGroupById(id: string): Promise<UserGroupDetail> {
  const role = await fetch(API_ENDPOINT + `/user-group/${id}`)
  return role.json()
}

export const createUserGroup = async (request: CreateUserGroupRequest) => {
  const response = await fetch(API_ENDPOINT + '/user-group', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    throw new Error('Failed to create role')
  }
}

export const updateUserGroup = async (
  request: UpdateUserGroupRequest,
  id: string
) => {
  const response = await fetch(API_ENDPOINT + `/user-group/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message ?? 'Failed to update role')
  }
}

export const deleteUserGroup = async (id: string) => {
  const response = await fetch(API_ENDPOINT + `/user-group/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message ?? 'Failed to delete role')
  }
}
