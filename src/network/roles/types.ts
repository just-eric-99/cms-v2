import { Permission, Scope } from '@/enum/exercisePermission.ts'
import { Admin } from '@/network/admin/types.ts'
import { Organization } from '@/network/organization/types.ts'
import { Center } from '@/network/centers/types.ts'

export type Role = {
  id: string
  title: string
  titleEn: string
  organizationId: string | null
  organization: Organization | null
  centerId: string | null
  center: Center | null
  super: boolean
  createdAt: string
  updatedAt: string
}

export type RoleDetails = {
  id: string
  title: string
  titleEn: string
  organizationId: string
  organization: Organization
  centerId: string
  center: Center
  super: boolean
  createdAt: string
  updatedAt: string
  admins: Admin[]
  rolePermissions: RolePermission[]
}

export type CreateRoleRequest = {
  title: string
  titleEn: string
  organizationId: string
  centerId: string
  permissions: RolePermission[]
}

export type UpdateRoleRequest = {
  title: string
  titleEn: string
  permissions: RolePermission[]
}

export type RolePermission = {
  permission: Permission
  scope: Scope
}
