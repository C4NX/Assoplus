// import type { H3Event, EventHandlerRequest } from "h3"
// import { createLogger } from "~/server/util/logger/logger.service"
// import { authenticateUserByOauth2 } from "~/server/util/user/auth.service"
// import { Role } from "~/server/util/user/role.enum"
// import { sanitizeUser } from "~/server/util/user/user.service"

// export interface DiscordUser {
//   id: string
//   username: string
//   avatar: string
//   discriminator: string
//   public_flags: number
//   flags: number
//   accent_color: number
//   global_name: string
//   banner_color: string
//   mfa_enabled: boolean
//   locale: string
//   premium_type: number
//   email: string
//   verified: boolean
// }

// const logger = createLogger("auth/discord")

// /**
//  * @see https://nuxt.com/modules/auth-utils#oauth-event-handlers
//  */
// export default defineOAuthDiscordEventHandler({
//   config: {
//     emailRequired: true,
//   },
//   async onSuccess(event: H3Event<EventHandlerRequest>, info: { user: DiscordUser }) {
//     const user = await authenticateUserByOauth2(
//       "discord",
//       info.user.id,
//       async () => { // create user if not exists
//       // TODO: Upload discord avatar to S3
//         return Promise.resolve({
//           email: info.user.email,
//           firstName: info.user.username,
//           lastName: "",
//           passwordHash: null,
//           roles: [Role.USER],
//           isVerified: info.user.verified,
//           createdAt: new Date(),
//           avatarUuid: null,
//         })
//       })

//     await setUserSession(event, {
//       user: sanitizeUser(user),
//       loggedInAt: Date.now(),
//     })

//     return sendRedirect(event, "/")
//   },
//   // Optional, will return a json error and 401 status code by default
//   onError(event: H3Event<EventHandlerRequest>, error: unknown) {
//     logger.error("GitHub OAuth error:", error)
//     return sendRedirect(event, "/")
//   },
// })
