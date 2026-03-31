import Link from "next/link"
import { redirect } from "next/navigation"

import { checkoutAction } from "@/app/actions"
import { AccountHeader } from "@/components/academy/account-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  getCourseBySlug,
  getCurrentStudent,
  getEnrollments,
} from "@/lib/learnbase/server"
import { formatPrice } from "@/lib/learnbase/ui"

type CheckoutPageProps = {
  searchParams: Promise<{ courseId?: string; slug?: string }>
}

export const dynamic = "force-dynamic"

export default async function CheckoutPage({
  searchParams,
}: CheckoutPageProps) {
  const { courseId, slug } = await searchParams

  if (!courseId || !slug) {
    redirect("/courses")
  }

  const [student, course, enrollments] = await Promise.all([
    getCurrentStudent(),
    getCourseBySlug(slug),
    getEnrollments(),
  ])

  if (!student) {
    redirect(
      `/login?next=${encodeURIComponent(`/checkout?courseId=${courseId}&slug=${slug}`)}`
    )
  }

  const alreadyEnrolled = enrollments.some(
    (enrollment) => enrollment.course.id === courseId
  )

  if (alreadyEnrolled) {
    redirect(`/learn/${slug}`)
  }

  return (
    <div className="min-h-svh bg-background">
      <AccountHeader student={student} />

      <main className="mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_20rem]">
          <section>
            <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              Checkout
            </p>
            <h1 className="font-heading mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Confirm your enrollment
            </h1>
            <p className="mt-3 max-w-xl leading-relaxed text-muted-foreground">
              This course is free, so enrollment is instant once you confirm.
            </p>

            <div className="mt-10 rounded-xl border border-border/50 bg-card p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                    Selected course
                  </p>
                  <h2 className="font-heading mt-2 text-xl font-semibold tracking-tight">
                    {course.title}
                  </h2>
                </div>
                <Badge variant="secondary" className="shrink-0 text-xs">
                  Instant access
                </Badge>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {course.shortDescription}
              </p>

              <Separator className="my-4" />

              <ul className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                {course.features.map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-foreground/30" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-xl border border-border/50 bg-card p-5">
              <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                Summary
              </p>
              <p className="font-heading mt-2 text-3xl font-semibold tracking-tight">
                {formatPrice(course.price, course.currency)}
              </p>

              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                You&apos;ll be redirected straight into the learning experience
                after enrollment.
              </p>

              <p className="mt-3 rounded-lg border border-border/40 bg-secondary/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
                No payment required in this demo. The button below completes
                the enrollment immediately.
              </p>

              <form action={checkoutAction} className="mt-5">
                <input type="hidden" name="courseId" value={course.id} />
                <input type="hidden" name="courseSlug" value={course.slug} />
                <Button type="submit" size="lg" className="w-full">
                  Confirm enrollment
                </Button>
              </form>

              <Button
                variant="ghost"
                className="mt-2 w-full text-xs"
                render={<Link href={`/courses/${course.slug}`} />}
              >
                Back to course page
              </Button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}
