import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { checkoutAction } from "@/app/actions"
import { PublicHeader } from "@/components/academy/public-header"
import { SiteFooter } from "@/components/academy/site-footer"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  getCourseBySlug,
  getCourses,
  getPublicModuleItems,
  getTenant,
} from "@/lib/learnbase/server"
import { formatPrice } from "@/lib/learnbase/ui"

type CoursePageProps = {
  params: Promise<{ slug: string }>
}

export const revalidate = 300

export async function generateStaticParams() {
  const courses = await getCourses()
  return courses.map((course) => ({ slug: course.slug }))
}

export async function generateMetadata({
  params,
}: CoursePageProps): Promise<Metadata> {
  const { slug } = await params

  try {
    const course = await getCourseBySlug(slug)

    return {
      title: `${course.title} | Launchcraft Academy`,
      description: course.shortDescription,
    }
  } catch {
    return {
      title: "Course | Launchcraft Academy",
    }
  }
}

const faqs = [
  {
    question: "Who is this course for?",
    answer:
      "Creators, consultants, educators, and operators who want to turn expertise into a structured academy offer without building a huge media company first.",
  },
  {
    question: "Do I need existing students?",
    answer:
      "No. The course starts with positioning and audience clarity so you can launch from a tight wedge instead of an existing list.",
  },
  {
    question: "What happens after enrollment?",
    answer:
      "You get access to the full curriculum immediately, a final quiz, and a certificate when you complete the course.",
  },
]

export default async function CourseDetailPage({ params }: CoursePageProps) {
  const { slug } = await params

  const tenant = await getTenant()

  let course

  try {
    course = await getCourseBySlug(slug)
  } catch {
    notFound()
  }

  const checkoutPath = `/checkout?courseId=${course.id}&slug=${course.slug}`
  const modulesWithItems = await Promise.all(
    course.modules.map(async (module) => ({
      ...module,
      items: await getPublicModuleItems(module.id),
    }))
  )
  const originalPrice = course.originalPrice
    ? formatPrice(course.originalPrice, course.currency)
    : null

  return (
    <div className="min-h-svh bg-background">
      <PublicHeader tenant={tenant} />

      <main className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_20rem] lg:gap-12">
          {/* Main Content */}
          <section>
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="secondary" className="text-xs">
                {course.categories[0]?.name ?? "Course"}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {course.level}
              </Badge>
              {course.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            <h1 className="font-heading mt-5 text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl">
              {course.title}
            </h1>
            <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
              {course.description}
            </p>

            {/* Stats */}
            <div className="mt-8 flex flex-wrap gap-6 text-sm">
              <div>
                <span className="text-xs text-muted-foreground">Modules</span>
                <p className="text-lg font-semibold">{course.modulesCount}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Lessons</span>
                <p className="text-lg font-semibold">{course.itemsCount}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Level</span>
                <p className="text-lg font-semibold capitalize">
                  {course.level}
                </p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">
                  Certificate
                </span>
                <p className="text-lg font-semibold">
                  {course.includeCertificate ? "Yes" : "No"}
                </p>
              </div>
            </div>

            {/* Objectives */}
            <section className="mt-14">
              <h2 className="font-heading text-xl font-semibold tracking-tight">
                What you will learn
              </h2>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {course.objectives.map((objective) => (
                  <div
                    key={objective}
                    className="rounded-lg border border-border/40 px-4 py-3 text-sm leading-relaxed text-muted-foreground"
                  >
                    {objective}
                  </div>
                ))}
              </div>
            </section>

            {/* Curriculum */}
            <section className="mt-14">
              <h2 className="font-heading text-xl font-semibold tracking-tight">
                Curriculum
              </h2>
              <Accordion
                className="mt-4"
                multiple
                defaultValue={
                  modulesWithItems[0] ? [modulesWithItems[0].id] : []
                }
              >
                {modulesWithItems.map((module, index) => (
                  <AccordionItem key={module.id} value={module.id}>
                    <AccordionTrigger>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">
                          Module {index + 1}
                        </p>
                        <h3 className="mt-1 text-base font-semibold tracking-tight">
                          {module.title}
                        </h3>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {module.itemsCount} lessons
                      </span>
                    </AccordionTrigger>

                    <AccordionContent className="border-t border-border/30 pt-3">
                      <div className="space-y-1">
                        {module.items.map((item, itemIndex) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between gap-4 rounded-lg px-3 py-2.5 text-sm"
                          >
                            <div className="flex items-center gap-3">
                              <span className="font-mono text-xs text-muted-foreground">
                                {String(itemIndex + 1).padStart(2, "0")}
                              </span>
                              <span>{item.title}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{item.contentType}</span>
                              {item.isPreview ? (
                                <Badge
                                  variant="secondary"
                                  className="text-[0.65rem]"
                                >
                                  Preview
                                </Badge>
                              ) : null}
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            {/* FAQ */}
            <section className="mt-14">
              <h2 className="font-heading text-xl font-semibold tracking-tight">
                FAQ
              </h2>
              <Accordion className="mt-4">
                {faqs.map((faq) => (
                  <AccordionItem key={faq.question} value={faq.question}>
                    <AccordionTrigger className="font-semibold">
                      <span>{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="border-t border-border/30 pt-3 leading-relaxed">
                      <p>{faq.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          </section>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-xl border border-border/50 bg-card p-5">
              <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                Enrollment
              </p>
              <p className="font-heading mt-2 text-3xl font-semibold tracking-tight">
                {formatPrice(course.price, course.currency)}
              </p>
              {originalPrice ? (
                <p className="mt-0.5 text-sm text-muted-foreground line-through">
                  {originalPrice}
                </p>
              ) : null}

              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {course.shortDescription}
              </p>

              <Separator className="my-4" />

              <ul className="space-y-2 text-sm text-muted-foreground">
                {course.features.map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-foreground/30" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 space-y-2">
                <Button
                  size="lg"
                  className="w-full"
                  render={
                    <Link
                      href={`/signup?next=${encodeURIComponent(checkoutPath)}`}
                    />
                  }
                >
                  Create account to enroll
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  render={
                    <Link
                      href={`/login?next=${encodeURIComponent(checkoutPath)}`}
                    />
                  }
                >
                  Log in to enroll
                </Button>
                <form action={checkoutAction}>
                  <input type="hidden" name="courseId" value={course.id} />
                  <input
                    type="hidden"
                    name="courseSlug"
                    value={course.slug}
                  />
                  <Button
                    type="submit"
                    variant="ghost"
                    className="w-full text-xs"
                  >
                    Already signed in? Enroll instantly.
                  </Button>
                </form>
              </div>

              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                Course access is immediate. Since this demo course is free,
                enrollment takes a single click once you&apos;re signed in.
              </p>
            </div>

            {course.instructor ? (
              <div className="mt-4 rounded-xl border border-border/50 p-5">
                <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                  Instructor
                </p>
                <p className="font-heading mt-2 text-lg font-semibold tracking-tight">
                  {course.instructor.name ?? "Launchcraft Team"}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {course.instructor.bio ??
                    course.instructor.title ??
                    "A focused operator-teacher combining curriculum, positioning, and launch systems."}
                </p>
              </div>
            ) : null}
          </aside>
        </div>
      </main>

      {/* Mobile Sticky CTA */}
      <div className="fixed right-0 bottom-0 left-0 z-40 border-t border-border/60 bg-background/95 px-5 py-3 backdrop-blur-lg lg:hidden">
        <div className="mx-auto flex items-center justify-between gap-4">
          <div>
            <span className="text-xs text-muted-foreground">Price</span>
            <p className="text-lg font-semibold tracking-tight">
              {formatPrice(course.price, course.currency)}
            </p>
          </div>
          <Button
            size="lg"
            render={
              <Link href={`/signup?next=${encodeURIComponent(checkoutPath)}`} />
            }
          >
            Enroll now
          </Button>
        </div>
      </div>
      <div className="h-20 lg:hidden" />

      <SiteFooter tenant={tenant} />
    </div>
  )
}
