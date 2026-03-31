import Link from "next/link"

import { signupAction } from "@/app/actions"
import { AuthForm } from "@/components/academy/auth-form"
import { PublicHeader } from "@/components/academy/public-header"
import { SiteFooter } from "@/components/academy/site-footer"
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

      <main className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_24rem] lg:gap-20">
          <div className="max-w-lg">
            <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              Create your account.
            </h1>
            <p className="mt-3 text-muted-foreground">
              Join Launchcraft Academy to access the flagship course, track
              progress, and earn your completion certificate.
            </p>

            <div className="mt-8 rounded-xl border border-border/50 bg-secondary/20 p-5">
              <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                What happens next
              </p>
              <p className="font-heading mt-2 text-lg font-semibold tracking-tight">
                Create your account, confirm access, and step straight into the
                course flow.
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                You&apos;ll land in the student workspace with checkout,
                learning, progress, and completion states already connected to
                real LearnBase data.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold tracking-tight">Sign up</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Your account is created inside the LearnBase tenant backing this
              demo.
            </p>

            <div className="mt-6">
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
          </div>
        </div>
      </main>

      <SiteFooter tenant={tenant} />
    </div>
  )
}
