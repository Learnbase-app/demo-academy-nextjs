import Link from "next/link"

import { loginAction } from "@/app/actions"
import { AuthForm } from "@/components/academy/auth-form"
import { PublicHeader } from "@/components/academy/public-header"
import { SiteFooter } from "@/components/academy/site-footer"
import { DemoCredentials } from "@/components/academy/demo-credentials"
import { Badge } from "@/components/ui/badge"
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

      <main className="hero-glow mx-auto grid max-w-6xl gap-16 px-6 py-20 lg:grid-cols-[1fr_28rem] lg:items-start">
        <section className="max-w-2xl">
          <p className="section-kicker">Student access</p>
          <h1 className="font-heading mt-4 text-5xl leading-[0.96] font-semibold sm:text-6xl">
            Welcome back to Launchcraft.
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Log in to resume the academy-building course, track progress, and
            access your dashboard.
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className="text-[0.64rem] tracking-[0.22em] uppercase"
            >
              Resume progress
            </Badge>
            <Badge
              variant="secondary"
              className="text-[0.64rem] tracking-[0.22em] uppercase"
            >
              Instant dashboard access
            </Badge>
          </div>

          <DemoCredentials />
        </section>

        <section className="atelier-panel relative mt-10 overflow-hidden rounded-[2rem] border border-border/70 bg-background/50 p-6 backdrop-blur-xl sm:p-8 lg:mt-0">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-foreground/[0.02] to-transparent" />

          <div className="relative z-10">
            <h2 className="font-heading text-3xl font-semibold tracking-tight">
              Log in
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Use your student account to continue learning.
            </p>

            <div className="mt-8">
              <AuthForm
                action={loginAction}
                mode="login"
                nextPath={next ?? "/account"}
              />
            </div>

            <p className="mt-6 text-center text-sm text-muted-foreground sm:text-left">
              New here?{" "}
              <Link
                href={`/signup${next ? `?next=${encodeURIComponent(next)}` : ""}`}
                className="text-foreground underline underline-offset-4 transition-colors hover:text-foreground/80"
              >
                Create an account
              </Link>
            </p>
          </div>
        </section>
      </main>

      <SiteFooter tenant={tenant} />
    </div>
  )
}
