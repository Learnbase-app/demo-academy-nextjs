import Link from "next/link"

import { loginAction } from "@/app/actions"
import { AuthForm } from "@/components/academy/auth-form"
import { PublicHeader } from "@/components/academy/public-header"
import { SiteFooter } from "@/components/academy/site-footer"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
          <h1 className="mt-4 font-heading text-5xl leading-[0.96] font-semibold sm:text-6xl">
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

          <Card className="atelier-panel mt-8 py-0">
            <CardHeader className="border-b border-border/55 py-6">
              <div className="section-kicker">Demo student account</div>
              <CardTitle className="text-3xl">
                Use the seeded credentials to explore the full flow.
              </CardTitle>
            </CardHeader>
            <CardContent className="py-6 text-sm leading-7 text-muted-foreground">
              <p>
                Email: <code>demo@launchcraft.academy</code>
              </p>
              <p className="mt-3">
                Password: <code>Launchcraft123!</code>
              </p>
              <p className="mt-4">
                This account is already enrolled in the flagship course.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="atelier-panel rounded-[2rem] border border-border/70 p-8">
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

          <p className="mt-6 text-sm text-muted-foreground">
            New here?{" "}
            <Link
              href={`/signup${next ? `?next=${encodeURIComponent(next)}` : ""}`}
              className="text-foreground underline underline-offset-4"
            >
              Create an account
            </Link>
          </p>
        </section>
      </main>

      <SiteFooter tenant={tenant} />
    </div>
  )
}
