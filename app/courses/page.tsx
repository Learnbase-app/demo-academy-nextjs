import { PublicHeader } from "@/components/academy/public-header"
import { CourseCard } from "@/components/academy/course-card"
import { SiteFooter } from "@/components/academy/site-footer"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getCategories, getCourses, getTenant } from "@/lib/learnbase/server"

export const revalidate = 300

export default async function CoursesPage() {
  const [tenant, categories, courses] = await Promise.all([
    getTenant(),
    getCategories(),
    getCourses(),
  ])

  return (
    <div className="min-h-svh bg-background">
      <PublicHeader tenant={tenant} />

      <main className="mx-auto max-w-6xl px-6 py-20">
        <section className="hero-glow">
          <div className="grid gap-10 lg:grid-cols-[1fr_20rem] lg:items-end">
            <div className="max-w-3xl">
              <p className="section-kicker">Catalog</p>
              <h1 className="mt-4 font-heading text-5xl leading-[0.96] font-semibold sm:text-6xl">
                Focused training for building a premium academy.
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Start with the flagship course below. It covers positioning,
                curriculum, launch, and retention with a single coherent
                workflow.
              </p>

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
            </div>

            <Card className="atelier-panel py-0">
              <CardHeader className="border-b border-border/55 py-6">
                <div className="section-kicker">Catalog snapshot</div>
                <CardTitle className="text-4xl">{courses.length}</CardTitle>
              </CardHeader>
              <CardContent className="py-6 text-sm leading-7 text-muted-foreground">
                Structured offers built around clear outcomes, fast checkout,
                and a calmer learning flow once students are inside.
              </CardContent>
            </Card>
          </div>
        </section>

        <div className="mt-14 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </main>

      <SiteFooter tenant={tenant} />
    </div>
  )
}
