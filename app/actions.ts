"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { clearSessionTokens, setSessionTokens } from "@/lib/learnbase/session"
import {
  LearnBaseError,
  loginStudent,
  markItemCompleted,
  signupStudent,
  startCheckout,
  submitQuiz,
} from "@/lib/learnbase/server"

export type AuthActionState = {
  error: string | null
}

function getSafeNextPath(rawValue: FormDataEntryValue | null) {
  if (typeof rawValue !== "string" || rawValue.length === 0) {
    return "/account"
  }

  if (!rawValue.startsWith("/")) {
    return "/account"
  }

  return rawValue
}

export async function loginAction(
  _prevState: AuthActionState,
  formData: FormData
) {
  const email = String(formData.get("email") ?? "").trim()
  const password = String(formData.get("password") ?? "")
  const nextPath = getSafeNextPath(formData.get("next"))

  if (!email || !password) {
    return { error: "Email and password are required." }
  }

  try {
    const session = await loginStudent({ email, password })
    await setSessionTokens(session.accessToken, session.refreshToken)
  } catch (error) {
    if (error instanceof LearnBaseError) {
      return { error: error.message }
    }

    return { error: "Unable to sign in right now." }
  }

  redirect(nextPath)
}

export async function signupAction(
  _prevState: AuthActionState,
  formData: FormData
) {
  const name = String(formData.get("name") ?? "").trim()
  const email = String(formData.get("email") ?? "").trim()
  const password = String(formData.get("password") ?? "")
  const nextPath = getSafeNextPath(formData.get("next"))

  if (!name || !email || !password) {
    return { error: "Name, email, and password are required." }
  }

  try {
    const session = await signupStudent({ name, email, password })
    await setSessionTokens(session.accessToken, session.refreshToken)
  } catch (error) {
    if (error instanceof LearnBaseError) {
      return { error: error.message }
    }

    return { error: "Unable to create your account right now." }
  }

  redirect(nextPath)
}

export async function logoutAction() {
  await clearSessionTokens()
  redirect("/")
}

export async function checkoutAction(formData: FormData) {
  const courseId = String(formData.get("courseId") ?? "")
  const courseSlug = String(formData.get("courseSlug") ?? "")

  if (!courseId || !courseSlug) {
    redirect("/courses")
  }

  const session = await startCheckout([courseId])

  if (session.type === "checkout" && session.checkoutUrl) {
    redirect(session.checkoutUrl)
  }

  revalidatePath("/account")
  revalidatePath(`/learn/${courseSlug}`)
  redirect(`/learn/${courseSlug}`)
}

export async function completeItemAction(formData: FormData) {
  const courseId = String(formData.get("courseId") ?? "")
  const moduleItemId = String(formData.get("moduleItemId") ?? "")
  const redirectPath = getSafeNextPath(formData.get("redirectPath"))

  if (!courseId || !moduleItemId) {
    redirect(redirectPath)
  }

  await markItemCompleted(courseId, moduleItemId)
  revalidatePath(redirectPath)
  revalidatePath("/account")
  redirect(redirectPath)
}

export async function submitQuizAction(formData: FormData) {
  const quizId = String(formData.get("quizId") ?? "")
  const moduleItemId = String(formData.get("moduleItemId") ?? "")
  const redirectPath = getSafeNextPath(formData.get("redirectPath"))

  if (!quizId || !moduleItemId) {
    redirect(redirectPath)
  }

  const answerMap = new Map<string, string[]>()

  for (const [key, value] of formData.entries()) {
    if (!key.startsWith("question:")) {
      continue
    }

    const questionId = key.slice("question:".length)
    const selections = answerMap.get(questionId) ?? []
    selections.push(String(value))
    answerMap.set(questionId, selections)
  }

  const answers = Array.from(answerMap.entries()).map(
    ([questionId, selectedOptionIds]) => ({
      questionId,
      selectedOptionIds,
    })
  )

  const result = await submitQuiz(quizId, moduleItemId, answers)
  revalidatePath(redirectPath)
  revalidatePath("/account")
  redirect(
    `${redirectPath}${redirectPath.includes("?") ? "&" : "?"}quizScore=${result.percentage}`
  )
}
