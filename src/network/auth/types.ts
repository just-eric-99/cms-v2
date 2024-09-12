import { ChallengeNameType } from '@aws-sdk/client-cognito-identity-provider'

export type LoginRequest = {
  email: string
  password: string
  isRemember: boolean
}

export type RespondCustomChallengeRequest = {
  sub: string
  session: string
  answer: string
  method?: 'EMAIL' | 'SMS'
}

export type LoginResponse = {
  challengeName: ChallengeNameType
}
