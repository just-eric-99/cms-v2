import { z } from 'zod'
import { Permission, Scope } from '@/enum/exercisePermission.ts'

export const createRoleSchema = z.object({
  title: z.string(),
  titleEn: z.string(),
  organizationId: z.string(),
  centerId: z.string(),
  permissions: z.array(
    z.object({
      permission: z.nativeEnum(Permission),
      scope: z.nativeEnum(Scope),
    })
  ),
})

export const updateRoleSchema = z.object({
  title: z.string(),
  titleEn: z.string(),
  organizationId: z.string(),
  centerId: z.string(),
  permissions: z.array(
    z.object({
      permission: z.nativeEnum(Permission),
      scope: z.nativeEnum(Scope),
    })
  ),
})
