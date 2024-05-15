import { Admin } from '@/network/admin/types'

export class AdminSummaryType {
  id: string
  name: string
  nameEn: string
  displayName: string
  email: string
  phone: string
  centerId: string
  roleId: string

  constructor(
    id: string,
    name: string,
    nameEn: string,
    displayName: string,
    email: string,
    phone: string,
    centerId: string,
    roleId: string
  ) {
    this.id = id
    this.name = name
    this.nameEn = nameEn
    this.displayName = displayName
    this.email = email
    this.phone = phone
    this.centerId = centerId
    this.roleId = roleId
  }

  static fromNetwork(admin: Admin): AdminSummaryType {
    return new AdminSummaryType(
      admin.id,
      admin.name,
      admin.nameEn,
      admin.displayName,
      admin.email,
      admin.phone,
      admin.centerId,
      admin.roleId
    )
  }

  static toNetwork(admin: AdminSummaryType): Admin {
    return {
      id: admin.id,
      name: admin.name,
      nameEn: admin.nameEn,
      displayName: admin.displayName,
      email: admin.email,
      phone: admin.phone,
      centerId: admin.centerId,
      roleId: admin.roleId,
    }
  }
}
