import { API_ENDPOINT } from '@/constants/network'
import { Center, CreateCenterRequest, UpdateCenterRequest } from './types'

export async function getAllCenters(): Promise<Center[]> {
  const centers = await fetch(API_ENDPOINT + '/center')
  return centers.json()
}

export async function getCenterById(id: string): Promise<Center> {
  const center = await fetch(API_ENDPOINT + `/center/${id}`)
  return center.json()
}

export async function createCenter(center: CreateCenterRequest): Promise<void> {
  const response = await fetch(API_ENDPOINT + '/center', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(center),
  })

  if (!response.ok) {
    throw new Error('Failed to create center')
  }
}

export async function updateCenter(
  center: UpdateCenterRequest,
  id: string
): Promise<void> {
  const response = await fetch(API_ENDPOINT + `/center/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(center),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message ?? 'Failed to update center')
  }
}

export async function deleteCenter(id: string): Promise<void> {
  const response = await fetch(API_ENDPOINT + `/center/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message ?? 'Failed to delete center') // server side error
  }
}
