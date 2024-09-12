declare module 'amazon-user-pool-srp-client' {
  export const SRPClient: {
    new (poolName: string): SRPClient
  }

  export function calculateSignature(
    hkdf,
    userPoolId,
    username,
    secretBlock,
    dateNow,
  ): string

  export function getNowString(): string
}
