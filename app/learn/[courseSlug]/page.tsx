import Link from "next/link"
import { redirect } from "next/navigation"

import { completeItemAction, submitQuizAction } from "@/app/actions"
import { AccountHeader } from "@/components/academy/account-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  getCourseBySlug,
  getCurrentStudent,
  getLearnCourse,
} from "@/lib/learnbase/server"
import { findActiveLearnItem } from "@/lib/learnbase/ui"
import type { LearnQuizContent } from "@/lib/learnbase/types"

type LearnPageProps = {
  params: Promise<{ courseSlug: string }>
  searchParams: Promise<{ item?: string; quizScore?: string }>
}

export const dynamic = "force-dynamic"

function QuizForm({
  quiz,
  moduleItemId,
  redirectPath,
}: {
  quiz: LearnQuizContent
  moduleItemId: string
  redirectPath: string
}) {
  return (
    <form action={submitQuizAction} className="space-y-8">
      <input type="hidden" name="quizId" value={quiz.id} />
      <input type="hidden" name="moduleItemId" value={moduleItemId} />
      <input type="hidden" name="redirectPath" value={redirectPath} />

      {quiz.questions.map((question) => (
        <fieldset
          key={question.id}
          className="space-y-4 rounded-[1.75rem] border border-border/70 bg-background/72 p-6"
        >
          <legend className="text-lg font-semibold tracking-tight">
            {question.questionText}
          </legend>

          <div className="space-y-3 text-sm text-foreground/90">
            {question.options.map((option) => {
              const inputType =
                question.type === "multiple_select" ? "checkbox" : "radio"

              return (
                <label
                  key={option.id}
                  className="flex cursor-pointer items-start gap-3 rounded-[1.25rem] border border-border/60 bg-background/80 px-4 py-4 transition hover:border-primary/35"
                >
                  <input
                    type={inputType}
                    name={`question:${question.id}`}
                    value={option.id}
                    className="mt-1 accent-[var(--primary)]"
                  />
                  <span>{option.optionText}</span>
                </label>
              )
            })}
          </div>
        </fieldset>
      ))}

      <Button type="submit" size="lg" className="h-12 rounded-2xl px-6">
        Submit quiz
      </Button>
    </form>
  )
}

export default async function LearnPage({
  params,
  searchParams,
}: LearnPageProps) {
  const { courseSlug } = await params
  const { item, quizScore } = await searchParams

  const student = await getCurrentStudent()

  if (!student) {
    redirect(`/login?next=${encodeURIComponent(`/learn/${courseSlug}`)}`)
  }

  const course = await getCourseBySlug(courseSlug)
  const learnCourse = await getLearnCourse(course.id)

  if (!learnCourse) {
    redirect(`/checkout?courseId=${course.id}&slug=${course.slug}`)
  }

  const activeItem = findActiveLearnItem(learnCourse, item)

  if (!activeItem) {
    redirect("/account")
  }

  const redirectPath = `/learn/${courseSlug}?item=${activeItem.id}`
  const activeContent = activeItem.content
  const isEmbeddableContent =
    activeContent &&
    "embedUrl" in activeContent &&
    activeItem.contentType !== "quiz"

  return (
    <div className="min-h-svh bg-background">
      <AccountHeader student={student} />

      <main className="mx-auto flex flex-col-reverse gap-8 px-4 py-8 sm:px-6 sm:py-10 lg:grid lg:max-w-7xl lg:grid-cols-[20rem_1fr]">
        <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
          <Card className="atelier-panel py-0">
            <CardHeader className="border-b border-border/55 py-6">
              <div className="section-kicker">Course progress</div>
              <CardTitle className="text-3xl">
                {learnCourse.course.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="py-6">
              <Progress value={Math.max(learnCourse.enrollment.progress, 4)}>
                <div className="flex w-full items-center justify-between text-sm">
                  <span className="font-medium text-foreground">
                    Completion
                  </span>
                  <span className="text-muted-foreground">
                    {learnCourse.enrollment.progress}%
                  </span>
                </div>
              </Progress>
            </CardContent>
          </Card>

          <div className="space-y-2.5">
            {learnCourse.modules.map((module, moduleIndex) => (
              <div
                key={module.id}
                className="rounded-[1.7rem] border border-border/70 bg-background/70 p-4 shadow-sm shadow-black/5"
              >
                <div className="section-kicker">Module {moduleIndex + 1}</div>
                <h2 className="mt-2 text-sm font-semibold tracking-tight">
                  {module.title}
                </h2>
                <div className="mt-4 space-y-2">
                  {module.items.map((moduleItem) => (
                    <Link
                      key={moduleItem.id}
                      href={`/learn/${courseSlug}?item=${moduleItem.id}`}
                      className={`block rounded-[1.2rem] px-3 py-3 text-sm transition ${
                        moduleItem.id === activeItem.id
                          ? "border border-primary/25 bg-primary/8 text-foreground"
                          : "border border-transparent text-muted-foreground hover:border-border/55 hover:bg-background/45 hover:text-foreground"
                      }`}
                    >
                      <div className="font-medium text-foreground">
                        {moduleItem.title}
                      </div>
                      <div className="mt-1 text-xs tracking-[0.18em] text-muted-foreground uppercase">
                        {moduleItem.contentType} ·{" "}
                        {moduleItem.status.replaceAll("_", " ")}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>

        <Card className="atelier-panel py-0">
          <CardHeader className="border-b border-border/55 py-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-3xl">
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant="outline"
                    className="text-[0.64rem] tracking-[0.18em] uppercase"
                  >
                    {activeItem.contentType}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="text-[0.64rem] tracking-[0.18em] uppercase"
                  >
                    {activeItem.status.replaceAll("_", " ")}
                  </Badge>
                </div>
                <CardTitle className="mt-4 text-4xl">
                  {activeItem.title}
                </CardTitle>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  {activeItem.module.description}
                </p>
              </div>

              <Button variant="outline" render={<Link href="/account" />}>
                Back to dashboard
              </Button>
            </div>
          </CardHeader>

          <CardContent className="py-8">
            {quizScore ? (
              <div className="rounded-[1.35rem] border border-primary/20 bg-primary/10 px-5 py-4 text-sm text-foreground">
                Quiz submitted successfully. Latest score:{" "}
                <strong>{quizScore}%</strong>
              </div>
            ) : null}

            {isEmbeddableContent ? (
              <div className="mt-8 space-y-8">
                <div className="overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] border-0 bg-black shadow-2xl ring-1 ring-white/10 relative group">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  {activeContent.embedUrl ? (
                    <iframe
                      src={activeContent.embedUrl}
                      title={activeItem.title}
                      className="aspect-video w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="flex aspect-video items-center justify-center text-sm text-muted-foreground">
                      No embedded content available.
                    </div>
                  )}
                </div>

                <div className="rounded-[1.7rem] border border-border/60 bg-background/72 p-6 shadow-sm shadow-black/5">
                  <h3 className="text-lg font-semibold tracking-tight">
                    Lesson summary
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground">
                    {activeContent.description}
                  </p>
                </div>

                {activeItem.status !== "completed" ? (
                  <form action={completeItemAction}>
                    <input
                      type="hidden"
                      name="courseId"
                      value={learnCourse.course.id}
                    />
                    <input
                      type="hidden"
                      name="moduleItemId"
                      value={activeItem.id}
                    />
                    <input
                      type="hidden"
                      name="redirectPath"
                      value={redirectPath}
                    />
                    <Button type="submit" size="lg" className="h-14 mt-4 w-full sm:w-auto rounded-full px-8 text-base shadow-lg shadow-black/5 transition-transform active:scale-95">
                      Mark lesson complete
                    </Button>
                  </form>
                ) : (
                  <div className="rounded-[1.35rem] border border-primary/20 bg-primary/10 px-5 py-4 text-sm text-foreground">
                    This lesson is complete.
                  </div>
                )}
              </div>
            ) : null}

            {activeItem.contentType === "quiz" &&
            activeContent &&
            "questions" in activeContent ? (
              <div className="mt-8">
                <QuizForm
                  quiz={activeContent as LearnQuizContent}
                  moduleItemId={activeItem.id}
                  redirectPath={redirectPath}
                />
              </div>
            ) : null}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
