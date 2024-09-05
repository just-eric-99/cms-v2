export type LoginRequest = {
  email: string
  password: string
  isRemember: boolean
}

export type LoginResponse = {
  challengeName: ChallengeName
}

enum ChallengeName {
  NEW_PASSWORD_REQUIRED = 'NEW_PASSWORD_REQUIRED',
  CUSTOM_CHALLENGE = 'CUSTOM_CHALLENGE',
}
