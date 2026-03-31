import Link from "next/link"

import { signupAction } from "@/app/actions"
import { AuthForm } from "@/components/academy/auth-form"
import { PublicHeader } from "@/components/academy/public-header"
import { SiteFooter } from "@/components/academy/site-footer"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getTenant } from "@/lib/learnbase/server"

type SignupPageProps = {
  searchParams: Promise<{ next?: string }>
}

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const tenant = await getTenant()
  const { next } = await searchParams

  return (
    <div className="min-h-svh bg-background">
      <PublicHeader tenant={tenant} />

      <main className="hero-glow mx-auto grid max-w-6xl gap-16 px-6 py-20 lg:grid-cols-[1fr_30rem] lg:items-start">
        <section className="max-w-2xl">
          <p className="section-kicker">Enroll in minutes</p>
          <h1 className="mt-4 font-heading text-5xl leading-[0.96] font-semibold sm:text-6xl">
            Create your student account.
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Join Launchcraft Academy to access the flagship course, track your
            progress, and earn your completion certificate.
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className="text-[0.64rem] tracking-[0.22em] uppercase"
            >
              One-minute signup
            </Badge>
            <Badge
              variant="secondary"
              className="text-[0.64rem] tracking-[0.22em] uppercase"
            >
              Guided onboarding
            </Badge>
          </div>

          <Card className="atelier-panel mt-8 py-0">
            <CardHeader className="border-b border-border/55 py-6">
              <div className="section-kicker">What happens next</div>
              <CardTitle className="text-3xl">
                Create your account, confirm access, and step straight into the
                course flow.
              </CardTitle>
            </CardHeader>
            <CardContent className="py-6 text-sm leading-7 text-muted-foreground">
              You&apos;ll land in the student workspace with checkout, learning,
              progress, and completion states already connected to real
              LearnBase data.
            </CardContent>
          </Card>
        </section>

        <section className="atelier-panel rounded-[2rem] border border-border/70 p-8">
          <h2 className="font-heading text-3xl font-semibold tracking-tight">
            Sign up
          </h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Start learning today. Your account is created inside the LearnBase
            tenant backing this demo.
          </p>

          <div className="mt-8">
            <AuthForm
              action={signupAction}
              mode="signup"
              nextPath={next ?? "/account"}
            />
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href={`/login${next ? `?next=${encodeURIComponent(next)}` : ""}`}
              className="text-foreground underline underline-offset-4"
            >
              Log in
            </Link>
          </p>
        </section>
      </main>

      <SiteFooter tenant={tenant} />
    </div>
  )
}
