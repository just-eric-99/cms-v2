import { Permission, Scope } from '@/enum/exercisePermission.ts'
import {Admin} from "@/network/admin/types.ts";

export type Role = {
  id: string
  title: string
  titleEn: string
  super: boolean
  createdAt: string
  updatedAt: string
}

export type RoleDetails = {
  id: string
  title: string
  titleEn: string
  super: boolean
  createdAt: string
  updatedAt: string
  admins: Admin[]
  rolePermissions: RolePermission[]
}

export type CreateRoleRequest = {
  title: string
  titleEn: string
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
