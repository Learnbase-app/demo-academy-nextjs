import { PublicHeader } from "@/components/academy/public-header"
import { CourseCard } from "@/components/academy/course-card"
import { SiteFooter } from "@/components/academy/site-footer"
import { Badge } from "@/components/ui/badge"
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

      <main className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="max-w-2xl">
          <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            Course catalog
          </h1>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Start with the flagship course below. It covers positioning,
            curriculum, launch, and retention with a single coherent workflow.
          </p>

          <div className="mt-5 flex flex-wrap gap-1.5">
            {categories.map((category) => (
              <Badge key={category.id} variant="outline" className="text-xs">
                {category.name}
              </Badge>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </main>

      <SiteFooter tenant={tenant} />
    </div>
  )
}
