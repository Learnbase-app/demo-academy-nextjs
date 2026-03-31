import "server-only"

import { cache } from "react"

import { learnbaseConfig } from "@/lib/learnbase/config"
import { getSessionTokens } from "@/lib/learnbase/session"
import type {
  AuthResponse,
  Category,
  CheckoutSessionResponse,
  CourseDetail,
  CourseListItem,
  Enrollment,
  LearnCourse,
  LearnVideoContent,
  PublicModuleItem,
  QuizSubmissionResult,
  Student,
  Tenant,
} from "@/lib/learnbase/types"

type FetchOptions = {
  method?: string
  body?: unknown
  accessToken?: string | null
  cacheMode?: RequestCache
  revalidate?: number
  idempotencyKey?: string
}

class LearnBaseError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = "LearnBaseError"
    this.status = status
  }
}

async function learnbaseFetch<T>(path: string, options: FetchOptions = {}) {
  const url = new URL(`${learnbaseConfig.apiBaseUrl}${path}`)
  url.searchParams.set("tenantSlug", learnbaseConfig.tenantSlug)

  const response = await fetch(url, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": learnbaseConfig.apiKey,
      ...(options.accessToken
        ? {
            Authorization: `Bearer ${options.accessToken}`,
          }
        : {}),
      ...(options.idempotencyKey
        ? {
            "Idempotency-Key": options.idempotencyKey,
          }
        : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: options.cacheMode,
    next: options.revalidate ? { revalidate: options.revalidate } : undefined,
  })

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as {
      message?: string
      error?: { message?: string }
    } | null
    const message =
      payload?.message ?? payload?.error?.message ?? response.statusText
    throw new LearnBaseError(message, response.status)
  }

  const payload = (await response.json()) as { data?: T } | T

  if (
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    payload.data !== undefined
  ) {
    return payload.data
  }

  return payload as T
}

export const getTenant = cache(async () => {
  return learnbaseFetch<Tenant>("/storefront/tenant", {
    cacheMode: "force-cache",
    revalidate: 300,
  })
})

export const getCategories = cache(async () => {
  return learnbaseFetch<Category[]>("/storefront/categories", {
    cacheMode: "force-cache",
    revalidate: 300,
  })
})

export const getCourses = cache(async () => {
  return learnbaseFetch<CourseListItem[]>("/storefront/courses", {
    cacheMode: "force-cache",
    revalidate: 300,
  })
})

export const getCourseBySlug = cache(async (slug: string) => {
  return learnbaseFetch<CourseDetail>(`/storefront/courses/${slug}`, {
    cacheMode: "force-cache",
    revalidate: 300,
  })
})

export const getPublicModuleItems = cache(async (moduleId: string) => {
  return learnbaseFetch<PublicModuleItem[]>(
    `/storefront/modules/${moduleId}/items`,
    {
      cacheMode: "force-cache",
      revalidate: 300,
    }
  )
})

export async function loginStudent(input: { email: string; password: string }) {
  return learnbaseFetch<AuthResponse>("/storefront/auth/login", {
    method: "POST",
    body: input,
    cacheMode: "no-store",
  })
}

export async function signupStudent(input: {
  email: string
  password: string
  name: string
}) {
  return learnbaseFetch<AuthResponse>("/storefront/auth/signup", {
    method: "POST",
    body: input,
    cacheMode: "no-store",
  })
}

export async function getCurrentStudent() {
  const { accessToken } = await getSessionTokens()

  if (!accessToken) {
    return null
  }

  try {
    return await learnbaseFetch<Student>("/storefront/auth/me", {
      accessToken,
      cacheMode: "no-store",
    })
  } catch (error) {
    if (error instanceof LearnBaseError && error.status === 401) {
      return null
    }

    throw error
  }
}

export async function getEnrollments() {
  const { accessToken } = await getSessionTokens()

  if (!accessToken) {
    return []
  }

  try {
    return await learnbaseFetch<Enrollment[]>("/storefront/enrollments", {
      accessToken,
      cacheMode: "no-store",
    })
  } catch (error) {
    if (error instanceof LearnBaseError && error.status === 401) {
      return []
    }

    throw error
  }
}

export async function getLearnCourse(courseId: string) {
  const { accessToken } = await getSessionTokens()

  if (!accessToken) {
    return null
  }

  try {
    return await learnbaseFetch<LearnCourse>(`/storefront/learn/${courseId}`, {
      accessToken,
      cacheMode: "no-store",
    })
  } catch (error) {
    if (
      error instanceof LearnBaseError &&
      (error.status === 401 || error.status === 403 || error.status === 404)
    ) {
      return null
    }

    throw error
  }
}

export async function getModuleItemVideoContent(moduleItemId: string) {
  const { accessToken } = await getSessionTokens()

  if (!accessToken) {
    return null
  }

  try {
    return await learnbaseFetch<LearnVideoContent>(
      `/storefront/modules/preview/${moduleItemId}/content`,
      {
        accessToken,
        cacheMode: "no-store",
      }
    )
  } catch {
    return null
  }
}

export async function startCheckout(courseIds: string[]) {
  const { accessToken } = await getSessionTokens()

  if (!accessToken) {
    throw new LearnBaseError("Authentication required", 401)
  }

  return learnbaseFetch<CheckoutSessionResponse>(
    "/storefront/checkout/session",
    {
      method: "POST",
      body: {
        courseIds,
        successUrl: `http://localhost:3000/account`,
        failureUrl: `http://localhost:3000/courses`,
      },
      accessToken,
      cacheMode: "no-store",
      idempotencyKey: crypto.randomUUID(),
    }
  )
}

export async function markItemCompleted(
  courseId: string,
  moduleItemId: string
) {
  const { accessToken } = await getSessionTokens()

  if (!accessToken) {
    throw new LearnBaseError("Authentication required", 401)
  }

  return learnbaseFetch<{ progress: number }>(
    `/storefront/learn/${courseId}/progress`,
    {
      method: "PUT",
      body: {
        moduleItemId,
        status: "completed",
      },
      accessToken,
      cacheMode: "no-store",
    }
  )
}

export async function submitQuiz(
  quizId: string,
  moduleItemId: string,
  answers: Array<{ questionId: string; selectedOptionIds: string[] }>
) {
  const { accessToken } = await getSessionTokens()

  if (!accessToken) {
    throw new LearnBaseError("Authentication required", 401)
  }

  return learnbaseFetch<QuizSubmissionResult>(
    `/storefront/quizzes/${quizId}/submit`,
    {
      method: "POST",
      body: {
        moduleItemId,
        answers,
      },
      accessToken,
      cacheMode: "no-store",
    }
  )
}

export { LearnBaseError }
