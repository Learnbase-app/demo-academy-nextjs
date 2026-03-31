import Link from "next/link"
import { redirect } from "next/navigation"

import { AccountHeader } from "@/components/academy/account-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { getCurrentStudent, getEnrollments } from "@/lib/learnbase/server"
import { getCourseProgressLabel } from "@/lib/learnbase/ui"

export const dynamic = "force-dynamic"

export default async function AccountPage() {
  const [student, enrollments] = await Promise.all([
    getCurrentStudent(),
    getEnrollments(),
  ])

  if (!student) {
    redirect("/login?next=/account")
  }

  const averageProgress = enrollments.length
    ? Math.round(
        enrollments.reduce(
          (total, enrollment) => total + enrollment.progress,
          0
        ) / enrollments.length
      )
    : 0

  return (
    <div className="min-h-svh bg-background">
      <AccountHeader student={student} />

      <main className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_22rem] lg:items-end">
          <div className="max-w-3xl">
            <p className="section-kicker">Dashboard</p>
            <h1 className="mt-4 font-heading text-5xl leading-[0.96] font-semibold sm:text-6xl">
              Your academy workspace.
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Track your enrollments, jump back into lessons, and complete the
              launch curriculum at your own pace.
            </p>
          </div>

          <Card className="atelier-panel py-0">
            <CardHeader className="border-b border-border/55 py-6">
              <div className="section-kicker">Snapshot</div>
              <CardTitle className="text-4xl">{enrollments.length}</CardTitle>
            </CardHeader>
            <CardContent className="py-6">
              <p className="text-sm leading-7 text-muted-foreground">
                Active enrollments with an average progress of{" "}
                <strong className="text-foreground">{averageProgress}%</strong>.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-[1.6rem] border border-border/70 bg-background/76 px-5 py-5 shadow-sm shadow-black/5">
            <div className="section-kicker">Student</div>
            <div className="mt-3 text-xl font-semibold">{student.name}</div>
            <div className="mt-1 text-sm text-muted-foreground">
              {student.email}
            </div>
          </div>

          <div className="rounded-[1.6rem] border border-border/70 bg-background/76 px-5 py-5 shadow-sm shadow-black/5">
            <div className="section-kicker">Average progress</div>
            <div className="mt-3 text-xl font-semibold">{averageProgress}%</div>
            <div className="mt-1 text-sm text-muted-foreground">
              Across all enrollments
            </div>
          </div>

          <div className="rounded-[1.6rem] border border-border/70 bg-background/76 px-5 py-5 shadow-sm shadow-black/5">
            <div className="section-kicker">Status</div>
            <div className="mt-3 text-xl font-semibold">Active learner</div>
            <div className="mt-1 text-sm text-muted-foreground">
              Ready to continue lessons
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-6 xl:grid-cols-2">
          {enrollments.map((enrollment) => (
            <Card
              key={enrollment.id}
              className="atelier-panel h-full py-0 shadow-[0_24px_60px_-38px_color-mix(in_oklab,var(--foreground)_55%,transparent)]"
            >
              <CardHeader className="border-b border-border/55 py-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="section-kicker">Enrolled course</div>
                    <CardTitle className="mt-4 text-3xl">
                      {enrollment.course.title}
                    </CardTitle>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-[0.64rem] tracking-[0.18em] uppercase"
                  >
                    {getCourseProgressLabel(enrollment.progress)}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="py-6">
                <p className="text-sm leading-7 text-muted-foreground">
                  {enrollment.course.shortDescription}
                </p>

                <div className="mt-6 rounded-[1.4rem] border border-border/60 bg-background/68 px-4 py-4">
                  <Progress value={Math.max(enrollment.progress, 4)}>
                    <div className="flex w-full items-center justify-between text-sm">
                      <span className="font-medium text-foreground">
                        Course progress
                      </span>
                      <span className="text-muted-foreground">
                        {enrollment.progress}%
                      </span>
                    </div>
                  </Progress>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Button
                    size="lg"
                    className="h-12"
                    render={<Link href={`/learn/${enrollment.course.slug}`} />}
                  >
                    Continue learning
                  </Button>
                  <Button
                    variant="ghost"
                    render={
                      <Link href={`/courses/${enrollment.course.slug}`} />
                    }
                  >
                    View course page
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
