import Link from "next/link"

import { loginAction } from "@/app/actions"
import { AuthForm } from "@/components/academy/auth-form"
import { PublicHeader } from "@/components/academy/public-header"
import { SiteFooter } from "@/components/academy/site-footer"
import { DemoCredentials } from "@/components/academy/demo-credentials"
import { getTenant } from "@/lib/learnbase/server"

type LoginPageProps = {
  searchParams: Promise<{ next?: string }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const tenant = await getTenant()
  const { next } = await searchParams

  return (
    <div className="min-h-svh bg-background">
      <PublicHeader tenant={tenant} />

      <main className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_24rem] lg:gap-20">
          <div className="max-w-lg">
            <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              Welcome back.
            </h1>
            <p className="mt-3 text-muted-foreground">
              Log in to resume the course, track progress, and access your
              dashboard.
            </p>

            <div className="mt-8">
              <DemoCredentials />
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold tracking-tight">Log in</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Use your student account to continue.
            </p>

            <div className="mt-6">
              <AuthForm
                action={loginAction}
                mode="login"
                nextPath={next ?? "/account"}
              />
            </div>

            <p className="mt-6 text-sm text-muted-foreground">
              New here?{" "}
              <Link
                href={`/signup${next ? `?next=${encodeURIComponent(next)}` : ""}`}
                className="text-foreground underline underline-offset-4"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </main>

      <SiteFooter tenant={tenant} />
    </div>
  )
}
