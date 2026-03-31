import Link from "next/link"
import { redirect } from "next/navigation"

import { AccountHeader } from "@/components/academy/account-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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

      <main className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-20">
        <div>
          <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            Dashboard
          </p>
          <h1 className="font-heading mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Your academy workspace
          </h1>
          <p className="mt-3 max-w-xl leading-relaxed text-muted-foreground">
            Track your enrollments, jump back into lessons, and complete the
            curriculum at your own pace.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-6 text-sm">
          <div>
            <span className="text-xs text-muted-foreground">Student</span>
            <p className="text-lg font-semibold">{student.name}</p>
            <p className="text-muted-foreground">{student.email}</p>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">Enrollments</span>
            <p className="text-lg font-semibold">{enrollments.length}</p>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">
              Average progress
            </span>
            <p className="text-lg font-semibold">{averageProgress}%</p>
          </div>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {enrollments.map((enrollment) => (
            <div
              key={enrollment.id}
              className="rounded-xl border border-border/50 bg-card p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-heading text-lg font-semibold tracking-tight">
                  {enrollment.course.title}
                </h2>
                <Badge variant="outline" className="shrink-0 text-xs">
                  {getCourseProgressLabel(enrollment.progress)}
                </Badge>
              </div>

              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {enrollment.course.shortDescription}
              </p>

              <div className="mt-5">
                <Progress value={Math.max(enrollment.progress, 4)}>
                  <div className="flex w-full items-center justify-between text-sm">
                    <span className="font-medium">Progress</span>
                    <span className="text-muted-foreground">
                      {enrollment.progress}%
                    </span>
                  </div>
                </Progress>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <Button
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
                  View course
                </Button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
