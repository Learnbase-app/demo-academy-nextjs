import Link from "next/link"
import { redirect } from "next/navigation"

import { checkoutAction } from "@/app/actions"
import { AccountHeader } from "@/components/academy/account-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

      <main className="mx-auto max-w-4xl px-6 py-20">
        <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
          <section>
            <p className="section-kicker">Checkout</p>
            <h1 className="mt-4 font-heading text-4xl leading-tight font-semibold sm:text-5xl">
              Confirm your enrollment.
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              This course is free, so enrollment is instant once you confirm.
            </p>

            <Card className="atelier-panel mt-10 py-0">
              <CardHeader className="border-b border-border/55 py-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="section-kicker">Selected course</div>
                    <CardTitle className="mt-4 text-3xl">
                      {course.title}
                    </CardTitle>
                  </div>
                  <Badge
                    variant="secondary"
                    className="text-[0.64rem] tracking-[0.18em] uppercase"
                  >
                    Instant access
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="py-6">
                <p className="text-sm leading-7 text-muted-foreground">
                  {course.shortDescription}
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {course.features.map((feature) => (
                    <div
                      key={feature}
                      className="rounded-[1.35rem] border border-border/60 bg-background/72 px-4 py-4 text-sm text-foreground/90"
                    >
                      {feature}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          <aside>
            <Card className="atelier-panel sticky top-28 py-0">
              <CardHeader className="border-b border-border/55 py-6">
                <div className="section-kicker">Summary</div>
                <CardTitle className="text-5xl">
                  {formatPrice(course.price, course.currency)}
                </CardTitle>
              </CardHeader>

              <CardContent className="py-6">
                <p className="text-sm leading-7 text-muted-foreground">
                  You&apos;ll be redirected straight into the learning
                  experience after enrollment.
                </p>

                <div className="mt-6 rounded-[1.35rem] border border-border/60 bg-background/72 px-4 py-4 text-sm text-foreground/90">
                  No payment required in this demo. The button below completes
                  the enrollment immediately.
                </div>

                <form action={checkoutAction} className="mt-8 space-y-3">
                  <input type="hidden" name="courseId" value={course.id} />
                  <input type="hidden" name="courseSlug" value={course.slug} />
                  <Button type="submit" size="lg" className="h-12 w-full">
                    Confirm enrollment
                  </Button>
                </form>

                <Button
                  variant="ghost"
                  className="mt-3 w-full"
                  render={<Link href={`/courses/${course.slug}`} />}
                >
                  Back to course page
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  )
}
