export default defineNuxtRouteMiddleware(async () => {
  const { loggedIn, fetch: refresh } = useUserSession()
  await refresh() // Refresh the session to check if the user is logged in
  if (!loggedIn.value) {
    return navigateTo("/login")
  }
})
