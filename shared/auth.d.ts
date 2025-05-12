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
  googleId: string | null
}

export interface UserPersonalInformation {
  firstName?: string
  lastName?: string
  email?: string
  birthdate?: string
  phone?: string
}

declare module "#auth-utils" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface User extends PublicUserInterface {}

  interface SecureSessionData {
    passwordReset?: { // Handle password reset
      userId: string
      token: string
      expiresAt: Date
    }
    verify?: { // Handle email verification
      userId: string
      token: string
      pendingEmailUpdate?: string // If the user verifies the new email, this will be the new email.
      expiresAt: Date
    }
  }
}
