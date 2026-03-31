import Link from "next/link"

import { ArrowRight } from "@phosphor-icons/react/dist/ssr"

import { CourseCard } from "@/components/academy/course-card"
import { PublicHeader } from "@/components/academy/public-header"
import { SiteFooter } from "@/components/academy/site-footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getCategories, getCourses, getTenant } from "@/lib/learnbase/server"
import { formatPrice, getCourseStats } from "@/lib/learnbase/ui"

export const revalidate = 300
export const metadata = {
  title: "Launchcraft Academy | Premium digital academy demo",
  description:
    "Explore a premium academy storefront demo with focused offers, fast enrollment, and a calm learner experience.",
}

const pillars = [
  "Tight positioning for a narrow, buyable promise.",
  "A curriculum shaped around transformation, not information overload.",
  "Lean operations that still feel premium to students.",
]

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
  const studioMetrics = [
    {
      label: "Learners inside the demo",
      value: `${flagshipCourse.studentsCount}+`,
    },
    {
      label: "Structured modules",
      value: String(flagshipCourse.modulesCount).padStart(2, "0"),
    },
    {
      label: "Courses in catalog",
      value: String(courses.length).padStart(2, "0"),
    },
  ]

  return (
    <div className="min-h-svh bg-background">
      <PublicHeader tenant={tenant} />

      <main>
        <section className="border-b border-border/60">
          <div className="hero-glow mx-auto grid max-w-6xl gap-12 px-6 py-18 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-28">
            <div className="max-w-3xl">
              <Badge
                variant="outline"
                className="px-3 py-1 text-[0.64rem] tracking-[0.24em] uppercase"
              >
                {categories[0]?.name ?? "Flagship course"}
              </Badge>

              <h1 className="font-heading mt-8 max-w-5xl text-5xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-6xl lg:text-[4.5rem]">
                {heroTitle}
              </h1>

              <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
                {heroSubtitle}
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Button
                  size="lg"
                  className="h-12 rounded-full px-8 text-base shadow-lg shadow-black/5 transition-all hover:scale-105 active:scale-95 sm:h-14"
                  render={<Link href="/courses" />}
                >
                  Explore the catalog
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 rounded-full bg-background/50 px-8 text-base backdrop-blur-sm transition-all hover:bg-background active:scale-95 sm:h-14"
                  render={<Link href="/signup" />}
                >
                  Create a student account
                </Button>
              </div>

              <div className="mt-14 grid gap-4 sm:grid-cols-3">
                {studioMetrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-[1.75rem] border border-border/60 bg-background/50 px-5 py-5 shadow-sm shadow-black/5 backdrop-blur-xl transition-all hover:bg-background/80"
                  >
                    <div className="text-[0.64rem] tracking-[0.2em] text-muted-foreground/80 uppercase">
                      {metric.label}
                    </div>
                    <div className="mt-3 text-3xl font-semibold tracking-tight">
                      {metric.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Card className="atelier-panel hairline-grid overflow-hidden py-0 shadow-2xl shadow-black/5 transition-transform duration-500 hover:scale-[1.02]">
              <CardHeader className="border-b border-border/55 py-8 pb-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="section-kicker">Flagship training</div>
                    <CardTitle className="mt-4 text-4xl">
                      {flagshipCourse.title}
                    </CardTitle>
                  </div>
                  <Badge
                    variant="secondary"
                    className="text-[0.64rem] tracking-[0.22em] uppercase"
                  >
                    Cohort launch offer
                  </Badge>
                </div>
                <CardDescription className="mt-2">
                  {flagshipCourse.shortDescription}
                </CardDescription>
              </CardHeader>

              <CardContent className="py-8">
                <div className="flex flex-wrap items-end gap-3">
                  <div className="font-heading text-5xl leading-none font-semibold tracking-tight">
                    {formatPrice(flagshipCourse.price, flagshipCourse.currency)}
                  </div>
                  {originalPrice ? (
                    <div className="pb-1 text-sm text-muted-foreground line-through">
                      {originalPrice}
                    </div>
                  ) : null}
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {getCourseStats(flagshipCourse).map((stat) => (
                    <div
                      key={stat}
                      className="rounded-[1.35rem] border border-border/60 bg-background/72 px-4 py-4 text-sm text-foreground/90"
                    >
                      {stat}
                    </div>
                  ))}
                </div>

                <Separator className="my-8" />

                <div className="space-y-3">
                  {flagshipCourse.features.slice(0, 3).map((feature, index) => (
                    <div
                      key={feature}
                      className="flex items-start justify-between gap-4 rounded-[1.25rem] border border-border/55 bg-background/60 px-4 py-3"
                    >
                      <div className="flex items-start gap-3">
                        <span className="font-mono text-xs text-muted-foreground">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="text-sm leading-7 text-foreground/90">
                          {feature}
                        </span>
                      </div>
                      <span className="text-[0.64rem] tracking-[0.16em] text-muted-foreground uppercase">
                        Included
                      </span>
                    </div>
                  ))}
                </div>

                <p className="mt-8 text-sm leading-7 text-muted-foreground">
                  Built on LearnBase with a server-first storefront focused on
                  speed, clarity, and low-friction enrollment.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div className="max-w-xl">
              <p className="section-kicker">What students get</p>
              <h2 className="font-heading mt-4 text-4xl leading-tight font-semibold">
                A tighter path from expertise to academy.
              </h2>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">
                The storefront is intentionally narrow: less noise, clearer
                decisions, stronger momentum from first visit to first lesson.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {pillars.map((pillar, index) => (
                <Card key={pillar} size="sm" className="atelier-panel">
                  <CardHeader>
                    <div className="text-[0.68rem] tracking-[0.24em] text-muted-foreground uppercase">
                      0{index + 1}
                    </div>
                    <CardTitle className="text-2xl">
                      {index === 0
                        ? "Sharper promise"
                        : index === 1
                          ? "Transformation-led curriculum"
                          : "Premium operations"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-7 text-muted-foreground">
                      {pillar}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-border/60">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <p className="section-kicker">Course catalog</p>
                <h2 className="font-heading mt-4 text-4xl leading-tight font-semibold">
                  {courseGridTitle}
                </h2>
                <p className="mt-5 text-lg leading-8 text-muted-foreground">
                  {courseGridDescription}
                </p>
              </div>

              <Button
                variant="ghost"
                className="hidden md:inline-flex"
                render={<Link href="/courses" />}
              >
                See full catalog <ArrowRight />
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category.id}
                  variant="outline"
                  className="text-[0.64rem] tracking-[0.18em] uppercase"
                >
                  {category.name}
                </Badge>
              ))}
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
            <div>
              <p className="section-kicker">Pricing</p>
              <h2 className="font-heading mt-4 text-4xl leading-tight font-semibold">
                Premium curriculum, free demo enrollment.
              </h2>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                In a real academy this would be a paid launch offer. For the
                demo, the full flow stays open so you can experience onboarding,
                checkout, and learning without friction.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="atelier-panel py-0">
                <CardHeader className="border-b border-border/55 py-6">
                  <div className="section-kicker">Demo access</div>
                  <CardTitle className="text-5xl">$0</CardTitle>
                  <CardDescription>
                    Enroll instantly and explore the full learning flow.
                  </CardDescription>
                </CardHeader>
                <CardContent className="py-6">
                  <ul className="space-y-3 text-sm text-foreground/90">
                    <li>Full course access</li>
                    <li>Learning dashboard</li>
                    <li>Progress tracking</li>
                    <li>Final quiz and certificate path</li>
                  </ul>
                  <Button
                    size="lg"
                    className="mt-8 h-12 w-full"
                    render={
                      <Link href="/courses/how-to-build-an-online-academy" />
                    }
                  >
                    Start the demo
                  </Button>
                </CardContent>
              </Card>

              <Card className="py-0">
                <CardHeader className="border-b border-border/55 py-6">
                  <div className="section-kicker">Included systems</div>
                  <CardTitle className="text-3xl">
                    Everything needed to validate the storefront.
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-6">
                  <ul className="space-y-4 text-sm leading-7 text-foreground/90">
                    <li>Conversion-focused storefront structure</li>
                    <li>SSR-first data loading and low JS overhead</li>
                    <li>Session handling with secure cookies</li>
                    <li>Enrollments and authenticated learning flow</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-20">
          <div className="atelier-panel rounded-[2.2rem] border border-border/70 px-8 py-10 md:px-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="section-kicker">Final note</p>
                <h2 className="font-heading mt-4 text-4xl leading-tight font-semibold">
                  One flagship course, one clean enrollment path, one calm
                  learner journey.
                </h2>
                <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
                  Launchcraft is intentionally narrow so every screen pulls in
                  the same direction: clarity, trust, and immediate progress.
                </p>
              </div>

              <Button
                size="lg"
                className="h-12"
                render={<Link href="/signup" />}
              >
                Create your account <ArrowRight />
              </Button>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter tenant={tenant} />
    </div>
  )
}
