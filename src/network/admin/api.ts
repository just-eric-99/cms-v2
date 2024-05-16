import { Admin, CreateAdminRequest, UpdateAdminDto } from '@/network/admin/types.ts'
import { API_ENDPOINT } from '@/constants/network.ts'

export const getAllAdmins = async (): Promise<Admin[]> => {
  const admins = await fetch(API_ENDPOINT + '/admin')

  if (!admins.ok) {
    const error = await admins.json()
    throw new Error(error.message ?? 'Failed to get admins')
  }

  return admins.json()
}

export const getAdminById = async (id: string): Promise<Admin> => {
  const admin = await fetch(API_ENDPOINT + `/admin/${id}`)

  if (!admin.ok) {
    const error = await admin.json()
    throw new Error(error.message ?? 'No such admin found')
  }

  return admin.json()
}

export const createAdmin = async (createAdminRequest: CreateAdminRequest): Promise<void> => {
  const response = await fetch(API_ENDPOINT + '/admin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(createAdminRequest),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message ?? 'Failed to create admin')
  }
}

export const updateAdmin = async (updateAdminDto: UpdateAdminDto, id: string): Promise<void> => {
  const response = await fetch(API_ENDPOINT + `/admin/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateAdminDto),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message ?? 'Failed to update admin')
  }
}
