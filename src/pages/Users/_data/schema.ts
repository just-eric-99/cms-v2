import * as z from 'zod'

export const createUserSchema = z.object({
  name: z.string().min(1),
  displayName: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  avatar: z
    .number()
    .min(0, 'Please choose an avatar')
    .max(1, 'Please choose an avatar'),
  centerId: z.string().min(1, 'Please select a center.'),
  userGroupId: z.string().min(1, 'Please select a user group.'),
})

export const updateUserSchema = z.object({
  name: z.string().min(1),
  displayName: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  avatar: z
    .number()
    .min(0, 'Please choose an avatar')
    .max(1, 'Please choose an avatar'),
  organizationId: z.string().min(1, 'Please select an organization.'),
  centerId: z.string().min(1, 'Please select a center.'),
  userGroupId: z.string().min(1, 'Please select a user group.'),
})
