/**
 * A user object that is returned by the server, sanitized for client use.
 */
export interface ClientUserInterface {
  id: string
  email: string
  firstName: string
  lastName: string
  roles: string[]
  avatarUuid: string | null
  isVerified: boolean
}
