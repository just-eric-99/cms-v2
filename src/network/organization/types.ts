export type Organization = {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

export type CreateOrganizationRequest = {
  name: string
}

export type UpdateOrganizationRequest = {
  name?: string
}