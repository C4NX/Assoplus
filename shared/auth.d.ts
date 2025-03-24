/**
 * A user object that is returned by the server, sanitized for client use.
 */
export interface PublicUserInterface {
  id: string
  email: string
  firstName: string
  lastName: string
  roles: string[]
  avatarUuid: string | null
  isVerified: boolean
  discordId: string | null
}

declare module "#auth-utils" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface User extends PublicUserInterface {}

  interface SecureSessionData {
    passwordReset?: {
      userId: string
      token: string
      expiresAt: Date
    }
  }
}
