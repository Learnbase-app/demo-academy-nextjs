import Link from "next/link"
import { redirect } from "next/navigation"

import { completeItemAction, submitQuizAction } from "@/app/actions"
import { AccountHeader } from "@/components/academy/account-header"
import { VideoPlayer } from "@/components/academy/video-player"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
    <form action={submitQuizAction} className="space-y-6">
      <input type="hidden" name="quizId" value={quiz.id} />
      <input type="hidden" name="moduleItemId" value={moduleItemId} />
      <input type="hidden" name="redirectPath" value={redirectPath} />

      {quiz.questions.map((question) => (
        <fieldset
          key={question.id}
          className="space-y-3 rounded-xl border border-border/50 p-5"
        >
          <legend className="text-base font-semibold tracking-tight">
            {question.questionText}
          </legend>

          <div className="space-y-2 text-sm">
            {question.options.map((option) => {
              const inputType =
                question.type === "multiple_select" ? "checkbox" : "radio"

              return (
                <label
                  key={option.id}
                  className="flex cursor-pointer items-start gap-3 rounded-lg border border-border/40 px-4 py-3 transition hover:border-primary/30"
                >
                  <input
                    type={inputType}
                    name={`question:${question.id}`}
                    value={option.id}
                    className="mt-0.5 accent-[var(--primary)]"
                  />
                  <span>{option.optionText}</span>
                </label>
              )
            })}
          </div>
        </fieldset>
      ))}

      <Button type="submit" size="lg">
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
    activeItem.contentType !== "quiz" &&
    activeItem.contentType !== "video"

  // Get video URL from the API content
  const videoSrc =
    activeItem.contentType === "video" && activeContent && "url" in activeContent && activeContent.url
      ? (activeContent.url as string)
      : null

  return (
    <div className="min-h-svh bg-background">
      <AccountHeader student={student} />

      <main className="mx-auto flex flex-col-reverse gap-8 px-5 py-10 sm:px-8 lg:grid lg:max-w-7xl lg:grid-cols-[18rem_1fr]">
        {/* Sidebar */}
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border border-border/50 bg-card p-4">
            <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              Progress
            </p>
            <h2 className="font-heading mt-2 text-base font-semibold tracking-tight">
              {learnCourse.course.title}
            </h2>
            <div className="mt-3">
              <Progress value={Math.max(learnCourse.enrollment.progress, 4)}>
                <div className="flex w-full items-center justify-between text-sm">
                  <span className="font-medium">Completion</span>
                  <span className="text-muted-foreground">
                    {learnCourse.enrollment.progress}%
                  </span>
                </div>
              </Progress>
            </div>
          </div>

          <div className="space-y-2">
            {learnCourse.modules.map((module, moduleIndex) => (
              <div
                key={module.id}
                className="rounded-xl border border-border/50 p-4"
              >
                <p className="text-xs text-muted-foreground">
                  Module {moduleIndex + 1}
                </p>
                <h3 className="mt-1 text-sm font-semibold tracking-tight">
                  {module.title}
                </h3>
                <div className="mt-3 space-y-1">
                  {module.items.map((moduleItem) => (
                    <Link
                      key={moduleItem.id}
                      href={`/learn/${courseSlug}?item=${moduleItem.id}`}
                      className={`block rounded-lg px-3 py-2.5 text-sm transition ${
                        moduleItem.id === activeItem.id
                          ? "border border-primary/20 bg-primary/5 text-foreground"
                          : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
                      }`}
                    >
                      <span className="font-medium">{moduleItem.title}</span>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {moduleItem.contentType} ·{" "}
                        {moduleItem.status.replaceAll("_", " ")}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main content */}
        <div className="rounded-xl border border-border/50 bg-card">
          <div className="border-b border-border/40 p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="outline" className="text-xs">
                    {activeItem.contentType}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {activeItem.status.replaceAll("_", " ")}
                  </Badge>
                </div>
                <h1 className="font-heading mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                  {activeItem.title}
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {activeItem.module.description}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                render={<Link href="/account" />}
              >
                Dashboard
              </Button>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            {quizScore ? (
              <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm">
                Quiz submitted successfully. Latest score:{" "}
                <strong>{quizScore}%</strong>
              </div>
            ) : null}

            {videoSrc ? (
              <div className="space-y-6">
                <VideoPlayer src={videoSrc} title={activeItem.title} />

                {activeContent &&
                "description" in activeContent &&
                activeContent.description ? (
                  <div className="rounded-lg border border-border/40 bg-secondary/20 p-4">
                    <h3 className="text-sm font-semibold">Lesson summary</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {activeContent.description}
                    </p>
                  </div>
                ) : null}

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
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full sm:w-auto"
                    >
                      Mark lesson complete
                    </Button>
                  </form>
                ) : (
                  <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm">
                    This lesson is complete.
                  </div>
                )}
              </div>
            ) : activeItem.contentType === "video" && !videoSrc ? (
              <div className="flex aspect-video items-center justify-center rounded-lg bg-secondary/30 text-sm text-muted-foreground">
                Video not available yet.
              </div>
            ) : isEmbeddableContent ? (
              <div className="space-y-6">
                <div className="overflow-hidden rounded-lg bg-black">
                  {activeContent && "embedUrl" in activeContent && activeContent.embedUrl ? (
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

                <div className="rounded-lg border border-border/40 bg-secondary/20 p-4">
                  <h3 className="text-sm font-semibold">Lesson summary</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {activeContent && "embedUrl" in activeContent ? (activeContent as { description?: string | null }).description : null}
                  </p>
                </div>
              </div>
            ) : null}

            {activeItem.contentType === "quiz" &&
            activeContent &&
            "questions" in activeContent ? (
              <div className="mt-4">
                <QuizForm
                  quiz={activeContent as LearnQuizContent}
                  moduleItemId={activeItem.id}
                  redirectPath={redirectPath}
                />
              </div>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  )
}
