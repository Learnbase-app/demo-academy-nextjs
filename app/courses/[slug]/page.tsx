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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

      <main className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_24rem]">
          <section>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant="outline"
                className="text-[0.64rem] tracking-[0.22em] uppercase"
              >
                {course.categories[0]?.name ?? "Course"}
              </Badge>
              <Badge
                variant="secondary"
                className="text-[0.64rem] tracking-[0.18em] uppercase"
              >
                {course.level}
              </Badge>
              {course.tags.slice(0, 2).map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-[0.64rem] tracking-[0.18em] uppercase"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            <h1 className="mt-6 max-w-4xl font-heading text-5xl leading-[0.96] font-semibold text-balance sm:text-6xl">
              {course.title}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
              {course.description}
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-[1.5rem] border border-border/70 bg-background/75 px-4 py-4 text-sm shadow-sm shadow-black/5">
                <div className="section-kicker">Modules</div>
                <div className="mt-2 text-2xl font-semibold tracking-tight">
                  {course.modulesCount}
                </div>
              </div>
              <div className="rounded-[1.5rem] border border-border/70 bg-background/75 px-4 py-4 text-sm shadow-sm shadow-black/5">
                <div className="section-kicker">Lessons</div>
                <div className="mt-2 text-2xl font-semibold tracking-tight">
                  {course.itemsCount}
                </div>
              </div>
              <div className="rounded-[1.5rem] border border-border/70 bg-background/75 px-4 py-4 text-sm shadow-sm shadow-black/5">
                <div className="section-kicker">Level</div>
                <div className="mt-2 text-2xl font-semibold capitalize">
                  {course.level}
                </div>
              </div>
              <div className="rounded-[1.5rem] border border-border/70 bg-background/75 px-4 py-4 text-sm shadow-sm shadow-black/5">
                <div className="section-kicker">Certificate</div>
                <div className="mt-2 text-2xl font-semibold tracking-tight">
                  {course.includeCertificate ? "Yes" : "No"}
                </div>
              </div>
            </div>

            <section className="mt-16">
              <h2 className="font-heading text-3xl font-semibold tracking-tight">
                What you will learn
              </h2>
              <div className="mt-6 grid gap-3 md:grid-cols-2">
                {course.objectives.map((objective) => (
                  <div
                    key={objective}
                    className="rounded-[1.45rem] border border-border/65 bg-background/72 px-4 py-4 text-sm leading-7 text-foreground/90"
                  >
                    {objective}
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-16">
              <h2 className="font-heading text-3xl font-semibold tracking-tight">
                Curriculum
              </h2>
              <Accordion
                className="mt-6"
                multiple
                defaultValue={
                  modulesWithItems[0] ? [modulesWithItems[0].id] : []
                }
              >
                {modulesWithItems.map((module, index) => (
                  <AccordionItem key={module.id} value={module.id}>
                    <AccordionTrigger>
                      <div>
                        <div className="section-kicker">Module {index + 1}</div>
                        <h3 className="mt-2 text-2xl font-semibold tracking-tight">
                          {module.title}
                        </h3>
                        <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
                          {module.description}
                        </p>
                      </div>
                      <div className="text-right text-xs text-muted-foreground">
                        {module.itemsCount} lessons
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="border-t border-border/45 pt-4">
                      <div className="space-y-1">
                        {module.items.map((item, itemIndex) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between gap-4 rounded-[1.25rem] bg-background/60 px-3 py-3 text-sm"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-muted-foreground">
                                {String(itemIndex + 1).padStart(2, "0")}
                              </span>
                              <span>{item.title}</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs tracking-[0.18em] text-muted-foreground uppercase">
                              <span>{item.contentType}</span>
                              {item.isPreview ? <span>Preview</span> : null}
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            <section id="faq" className="mt-16">
              <h2 className="font-heading text-3xl font-semibold tracking-tight">
                FAQ
              </h2>
              <Accordion className="mt-6">
                {faqs.map((faq) => (
                  <AccordionItem key={faq.question} value={faq.question}>
                    <AccordionTrigger className="text-lg font-semibold tracking-tight">
                      <span>{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="border-t border-border/40 pt-4 leading-7">
                      <p>{faq.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          </section>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <Card className="atelier-panel py-0">
              <CardHeader className="border-b border-border/55 py-6">
                <div className="section-kicker">Enrollment</div>
                <CardTitle className="text-5xl">
                  {formatPrice(course.price, course.currency)}
                </CardTitle>
                {originalPrice ? (
                  <div className="text-sm text-muted-foreground line-through">
                    {originalPrice}
                  </div>
                ) : null}
              </CardHeader>

              <CardContent className="py-6">
                <p className="text-sm leading-7 text-muted-foreground">
                  {course.shortDescription}
                </p>

                <div className="mt-6 space-y-2 text-sm text-foreground/90">
                  {course.features.map((feature) => (
                    <div key={feature} className="flex gap-3">
                      <span className="mt-2 size-2 rounded-full bg-primary" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <div id="pricing" className="mt-8 space-y-3">
                  <div className="rounded-[1.35rem] border border-border/60 bg-background/72 px-4 py-4 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-muted-foreground">
                        Launch offer
                      </span>
                      <span className="font-medium">
                        {formatPrice(course.price, course.currency)}
                      </span>
                    </div>
                    {originalPrice ? (
                      <div className="mt-2 flex items-center justify-between gap-3">
                        <span className="text-muted-foreground">
                          Regular value
                        </span>
                        <span className="text-muted-foreground line-through">
                          {originalPrice}
                        </span>
                      </div>
                    ) : null}
                  </div>

                  <Button
                    size="lg"
                    className="h-12 w-full"
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
                    size="lg"
                    className="h-12 w-full"
                    render={
                      <Link
                        href={`/login?next=${encodeURIComponent(checkoutPath)}`}
                      />
                    }
                  >
                    I already have an account
                  </Button>
                  <form action={checkoutAction}>
                    <input type="hidden" name="courseId" value={course.id} />
                    <input
                      type="hidden"
                      name="courseSlug"
                      value={course.slug}
                    />
                    <Button type="submit" variant="ghost" className="w-full">
                      Already signed in on this browser? Enroll instantly.
                    </Button>
                  </form>
                </div>

                <Separator className="my-6" />

                <div className="text-sm leading-7 text-muted-foreground">
                  Course access is immediate. Since this demo course is free,
                  enrollment takes a single click once you&apos;re signed in.
                </div>
              </CardContent>
            </Card>

            {course.instructor ? (
              <Card className="mt-6 py-0">
                <CardHeader className="border-b border-border/55 py-6">
                  <div className="section-kicker">Instructor</div>
                  <CardTitle className="text-3xl">
                    {course.instructor.name ?? "Launchcraft Team"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-6">
                  <p className="text-sm leading-7 text-muted-foreground">
                    {course.instructor.bio ??
                      course.instructor.title ??
                      "A focused operator-teacher combining curriculum, positioning, and launch systems."}
                  </p>
                </CardContent>
              </Card>
            ) : null}
          </aside>
        </div>
      </main>

      <SiteFooter tenant={tenant} />
    </div>
  )
}
