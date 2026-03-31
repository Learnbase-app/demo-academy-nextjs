import Link from "next/link"

import { ArrowRight } from "@phosphor-icons/react/dist/ssr"

import { CourseCard } from "@/components/academy/course-card"
import { PublicHeader } from "@/components/academy/public-header"
import { SiteFooter } from "@/components/academy/site-footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { getCategories, getCourses, getTenant } from "@/lib/learnbase/server"
import { formatPrice, getCourseStats } from "@/lib/learnbase/ui"

export const revalidate = 300
export const metadata = {
  title: "Launchcraft Academy | Premium digital academy demo",
  description:
    "Explore a premium academy storefront demo with focused offers, fast enrollment, and a calm learner experience.",
}

export default async function HomePage() {
  const [tenant, courses, categories] = await Promise.all([
    getTenant(),
    getCourses(),
    getCategories(),
  ])

  const flagshipCourse = courses[0]
  const heroTitle =
    tenant.heroTitle ??
    "Build a premium digital academy with a storefront that feels sharp from day one."
  const heroSubtitle =
    tenant.heroSubtitle ??
    "Launchcraft packages positioning, curriculum, operations, and student experience into a storefront that feels focused instead of bloated."
  const courseGridTitle =
    tenant.landingLayout?.courseGridTitle ?? "Learn the Launchcraft way."
  const courseGridDescription =
    tenant.landingLayout?.courseGridDescription ??
    "A catalog designed around one narrow promise: move from expertise to a launch-ready academy without dragging students through clutter."
  const originalPrice = flagshipCourse.originalPrice
    ? formatPrice(flagshipCourse.originalPrice, flagshipCourse.currency)
    : null

  return (
    <div className="min-h-svh bg-background">
      <PublicHeader tenant={tenant} />

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-5xl px-5 pb-20 pt-16 sm:px-8 sm:pt-24">
          <div className="max-w-3xl">
            <Badge variant="outline" className="text-xs">
              {categories[0]?.name ?? "Flagship course"}
            </Badge>

            <h1 className="font-heading mt-6 text-4xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              {heroTitle}
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {heroSubtitle}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" render={<Link href="/courses" />}>
                Explore the catalog
              </Button>
              <Button
                variant="outline"
                size="lg"
                render={<Link href="/signup" />}
              >
                Create an account
              </Button>
            </div>
          </div>

          <div className="mt-14 flex flex-wrap gap-8 text-sm text-muted-foreground">
            <div>
              <span className="text-2xl font-semibold tracking-tight text-foreground">
                {flagshipCourse.studentsCount}+
              </span>
              <p className="mt-0.5">learners</p>
            </div>
            <Separator orientation="vertical" className="h-12" />
            <div>
              <span className="text-2xl font-semibold tracking-tight text-foreground">
                {String(flagshipCourse.modulesCount).padStart(2, "0")}
              </span>
              <p className="mt-0.5">modules</p>
            </div>
            <Separator orientation="vertical" className="h-12" />
            <div>
              <span className="text-2xl font-semibold tracking-tight text-foreground">
                {String(courses.length).padStart(2, "0")}
              </span>
              <p className="mt-0.5">courses</p>
            </div>
          </div>
        </section>

        {/* Flagship Course */}
        <section className="border-y border-border/40 bg-secondary/20">
          <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-20">
            <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start">
              <div>
                <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                  Flagship training
                </p>
                <h2 className="font-heading mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                  {flagshipCourse.title}
                </h2>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  {flagshipCourse.shortDescription}
                </p>

                <div className="mt-6 flex items-baseline gap-3">
                  <span className="font-heading text-3xl font-semibold tracking-tight">
                    {formatPrice(flagshipCourse.price, flagshipCourse.currency)}
                  </span>
                  {originalPrice ? (
                    <span className="text-sm text-muted-foreground line-through">
                      {originalPrice}
                    </span>
                  ) : null}
                </div>

                <Button
                  size="lg"
                  className="mt-6"
                  render={
                    <Link href={`/courses/${flagshipCourse.slug}`} />
                  }
                >
                  View course <ArrowRight className="size-4" />
                </Button>
              </div>

              <div className="space-y-3">
                {getCourseStats(flagshipCourse).map((stat) => (
                  <div
                    key={stat}
                    className="rounded-lg border border-border/50 bg-background px-4 py-3 text-sm"
                  >
                    {stat}
                  </div>
                ))}
                <Separator className="my-1" />
                {flagshipCourse.features.slice(0, 4).map((feature, i) => (
                  <div
                    key={feature}
                    className="flex items-start gap-3 text-sm text-muted-foreground"
                  >
                    <span className="mt-0.5 font-mono text-xs text-muted-foreground/60">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Course Catalog */}
        <section className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
              <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                Course catalog
              </p>
              <h2 className="font-heading mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                {courseGridTitle}
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {courseGridDescription}
              </p>
            </div>
            <Button
              variant="ghost"
              className="hidden sm:inline-flex"
              render={<Link href="/courses" />}
            >
              All courses <ArrowRight className="size-3.5" />
            </Button>
          </div>

          <div className="mt-5 flex flex-wrap gap-1.5">
            {categories.map((category) => (
              <Badge key={category.id} variant="outline" className="text-xs">
                {category.name}
              </Badge>
            ))}
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section className="border-t border-border/40">
          <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-20">
            <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start">
              <div>
                <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                  Pricing
                </p>
                <h2 className="font-heading mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                  Premium curriculum, free demo enrollment.
                </h2>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  In a real academy this would be a paid launch offer. For the
                  demo, the full flow stays open so you can experience
                  onboarding, checkout, and learning without friction.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="rounded-xl border border-border/50 bg-card p-5">
                  <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                    Demo access
                  </p>
                  <p className="font-heading mt-2 text-4xl font-semibold tracking-tight">
                    $0
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Enroll instantly and explore the full learning flow.
                  </p>
                  <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                    <li>Full course access</li>
                    <li>Learning dashboard</li>
                    <li>Progress tracking</li>
                    <li>Certificate path</li>
                  </ul>
                  <Button
                    size="lg"
                    className="mt-6 w-full"
                    render={
                      <Link href="/courses/how-to-build-an-online-academy" />
                    }
                  >
                    Start the demo
                  </Button>
                </div>

                <div className="rounded-xl border border-border/50 bg-card p-5">
                  <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                    Included systems
                  </p>
                  <p className="font-heading mt-2 text-lg font-semibold tracking-tight">
                    Everything to validate the storefront.
                  </p>
                  <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
                    <li>Conversion-focused storefront</li>
                    <li>SSR-first data loading</li>
                    <li>Secure session handling</li>
                    <li>Authenticated learning flow</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-5xl px-5 pb-16 sm:px-8 sm:pb-20">
          <div className="rounded-xl border border-border/50 bg-secondary/20 px-6 py-10 sm:px-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-xl">
                <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
                  One flagship course, one clean enrollment path.
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Clarity, trust, and immediate progress from the first visit.
                </p>
              </div>
              <Button
                size="lg"
                className="shrink-0"
                render={<Link href="/signup" />}
              >
                Get started <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter tenant={tenant} />
    </div>
  )
}
