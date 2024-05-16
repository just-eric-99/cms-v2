import {
  deleteCenter,
  getAllCenters,
  getCenterById,
  updateCenter,
} from '@/network/centers/api'
import { CenterSummaryType } from './types'
import { Center } from '@/network/centers/types'
import { updateCenterSchema } from './schema'
import { z } from 'zod'

export const fetchCenters = async (): Promise<CenterSummaryType[]> => {
  console.log('fetchCenters')

  const centers = await getAllCenters()
  console.log('centers', centers)

  const centerSummary: CenterSummaryType[] = centers.map((center: Center) => ({
    id: center.id,
    name: center.name,
    nameEn: center.nameEn,
    address: center.address,
    addressEn: center.addressEn,
    organizationName: center.organization.name,
    organizationNameEn: center.organization.nameEn,
  }))

  console.log(centerSummary)

  return centerSummary
}

export const fetchCenterById = async (id: string): Promise<Center> => {
  return await getCenterById(id)
}

export const updateCenterById = async (
  id: string,
  center: z.infer<typeof updateCenterSchema>
): Promise<void> => {
  return updateCenter(center, id)
}

export const deleteCenterByCenterId = async (id: string): Promise<void> => {
  return deleteCenter(id)
}
