import {
  API_ENDPOINT,
  AWS_COGNITO_CLIENT_ID,
  AWS_COGNITO_POOL_ID,
  AWS_REGION,
} from '@/constants/network'
import {
  calculateSignature,
  getNowString,
  SRPClient,
} from 'amazon-user-pool-srp-client'
import {
  LoginRequest,
  LoginResponse,
  RespondCustomChallengeRequest,
} from './types'
import {
  AuthFlowType,
  ChallengeNameType,
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  InitiateAuthCommandInput,
  RespondToAuthChallengeCommand,
  RespondToAuthChallengeRequest,
  RespondToAuthChallengeResponse,
} from '@aws-sdk/client-cognito-identity-provider'

const client = new CognitoIdentityProviderClient({
  region: AWS_REGION,
})
const clientId = AWS_COGNITO_CLIENT_ID
const userPooId = AWS_COGNITO_POOL_ID

export async function initAuth(request: LoginRequest) {
  const poolName = userPooId.split('_')[1]
  const srp = new SRPClient(poolName)
  const input: InitiateAuthCommandInput = {
    AuthFlow: AuthFlowType.CUSTOM_AUTH,
    ClientId: clientId,
    AuthParameters: {
      USERNAME: request.email,
      SRP_A: srp.calculateA(),
      CHALLENGE_NAME: 'SRP_A',
    },
  }

  const command = new InitiateAuthCommand(input)
  const response = await client.send(command)

  // Check if password is correct
  const hkdf = srp.getPasswordAuthenticationKey(
    response.ChallengeParameters!.USER_ID_FOR_SRP,
    request.password,
    response.ChallengeParameters!.SRP_B,
    response.ChallengeParameters!.SALT
  )
  const dateNow = getNowString()
  const signatureString = calculateSignature(
    hkdf,
    poolName,
    response.ChallengeParameters!.USER_ID_FOR_SRP,
    response.ChallengeParameters!.SECRET_BLOCK,
    dateNow
  )

  const passwordChallengeResponse = await respondToAuthChallenge(
    response.Session!,
    response.ChallengeName!,
    {
      PASSWORD_CLAIM_SIGNATURE: signatureString,
      PASSWORD_CLAIM_SECRET_BLOCK: response.ChallengeParameters!.SECRET_BLOCK,
      TIMESTAMP: dateNow,
      USERNAME: response.ChallengeParameters!.USER_ID_FOR_SRP,
    }
  )

  return {
    sub: response.ChallengeParameters!.USER_ID_FOR_SRP,
    session: passwordChallengeResponse.Session!,
    challengeName: passwordChallengeResponse.ChallengeName!,
    isRemember: request.isRemember,
  }
}

export async function respondCustomChallenge(
  respondCustomChallengeRequest: RespondCustomChallengeRequest
) {
  console.log(respondCustomChallengeRequest)
  return await respondToAuthChallenge(
    respondCustomChallengeRequest.session,
    'CUSTOM_CHALLENGE',
    {
      USERNAME: respondCustomChallengeRequest.sub,
      ANSWER: respondCustomChallengeRequest.answer,
    },
    respondCustomChallengeRequest.method
  )
}

async function respondToAuthChallenge(
  session: string,
  challengeName: ChallengeNameType,
  challengeResponse: Record<string, string>,
  method?: 'EMAIL' | 'SMS'
): Promise<RespondToAuthChallengeResponse> {
  const input: RespondToAuthChallengeRequest = {
    ChallengeName: challengeName,
    ClientId: clientId,
    Session: session,
    ChallengeResponses: challengeResponse,
  }

  if (method) {
    input.ClientMetadata = { method }
  }

  const command = new RespondToAuthChallengeCommand(input)
  return await client.send(command)
}

export async function refreshToken(
  refreshToken: string
): Promise<RespondToAuthChallengeResponse> {
  const input: InitiateAuthCommandInput = {
    AuthFlow: 'REFRESH_TOKEN_AUTH',
    ClientId: clientId,
    AuthParameters: {
      REFRESH_TOKEN: refreshToken,
    },
  }

  const command = new InitiateAuthCommand(input)
  return await client.send(command)
}

export async function adminLogin(
  request: LoginRequest
): Promise<LoginResponse> {
  const response = await fetch(API_ENDPOINT + '/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    throw new Error('Failed to login')
  }

  return response.json()
}

export async function tokenCallback(token: string): Promise<void> {
  const response = await fetch(API_ENDPOINT + `/auth/callback/${token}`, {
    method: 'POST',
  })

  if (!response.ok) {
    throw new Error('Failed to verify token')
  }
}

export async function setNewPassword(password: string): Promise<void> {
  const response = await fetch(API_ENDPOINT + '/auth/new-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password }),
  })

  if (!response.ok) {
    throw new Error('Failed to change password')
  }
}

// export async function refreshToken(): Promise<void> {
//   const response = await fetch(API_ENDPOINT + '/auth/refresh', {
//     method: 'POST',
//   })
//
//   if (!response.ok) {
//     throw new Error('Failed to refresh token')
//   }
// }

export async function checkEmail(email: string): Promise<boolean> {
  const response = await fetch(API_ENDPOINT + `/auth/check-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to check email')
  }

  return response.json()
}

export async function login(request: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(API_ENDPOINT + `/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    throw new Error('Failed to login')
  }

  return response.json()
}

// export async function verifyMagicLink(token: string): Promise<void> {
//   const response = await fetch(API_ENDPOINT + `/auth/callback/${token}`, {
//     method: 'POST',
//     credentials: 'include',
//   })
//
//   if (!response.ok) {
//     throw new Error('Failed to verify magic link')
//   }
// }

export async function updatePassword(password: string): Promise<void> {
  const response = await fetch(API_ENDPOINT + `/auth/new-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      password: password,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to update password')
  }
}
