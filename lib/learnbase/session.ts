import "server-only"

import { cookies } from "next/headers"

export const sessionCookieNames = {
  accessToken: "lb_access_token",
  refreshToken: "lb_refresh_token",
} as const

export async function getSessionTokens() {
  const cookieStore = await cookies()

  return {
    accessToken: cookieStore.get(sessionCookieNames.accessToken)?.value ?? null,
    refreshToken:
      cookieStore.get(sessionCookieNames.refreshToken)?.value ?? null,
  }
}

export async function setSessionTokens(
  accessToken: string,
  refreshToken: string
) {
  const cookieStore = await cookies()

  cookieStore.set(sessionCookieNames.accessToken, accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 15,
  })

  cookieStore.set(sessionCookieNames.refreshToken, refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  })
}

export async function clearSessionTokens() {
  const cookieStore = await cookies()

  cookieStore.delete(sessionCookieNames.accessToken)
  cookieStore.delete(sessionCookieNames.refreshToken)
}
