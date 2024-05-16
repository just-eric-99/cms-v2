export type Admin = {
  id: string
  name: string
  nameEn: string
  displayName: string
  email: string
  phone: string
  centerId: string
  roleId: string
  createdAt: string
  updatedAt: string
}

export type CreateAdminRequest = {
  name: string
  nameEn: string
  displayName: string
  email: string
  phone: string
  centerId: string
  roleId: string
}

export type UpdateAdminDto = {
  name: string
  nameEn: string
  displayName: string
  phone: string
  centerId: string
  roleId: string
}