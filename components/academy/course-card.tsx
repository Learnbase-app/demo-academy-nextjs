import Link from "next/link"

import { ArrowUpRight, Star } from "@phosphor-icons/react/dist/ssr"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatPrice } from "@/lib/learnbase/ui"
import type { CourseListItem } from "@/lib/learnbase/types"

type CourseCardProps = {
  course: CourseListItem
}

export function CourseCard({ course }: CourseCardProps) {
  const originalPrice = course.originalPrice
    ? formatPrice(course.originalPrice, course.currency)
    : null

  return (
    <article className="group h-full">
      <Card className="atelier-panel h-full py-0 transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_75px_-42px_color-mix(in_oklab,var(--foreground)_65%,transparent)]">
        <CardHeader className="border-b border-border/55 py-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className="text-[0.64rem] tracking-[0.22em] uppercase"
                >
                  {course.level}
                </Badge>
                {course.tags[0] ? (
                  <Badge
                    variant="secondary"
                    className="text-[0.64rem] tracking-[0.18em] text-foreground/80 uppercase"
                  >
                    {course.tags[0]}
                  </Badge>
                ) : null}
              </div>
              <CardTitle className="mt-4">{course.title}</CardTitle>
            </div>

            <div className="stat-chip min-w-24 text-right">
              <div className="text-[0.64rem] tracking-[0.18em] text-muted-foreground uppercase">
                Modules
              </div>
              <div className="mt-1 text-lg font-semibold text-foreground">
                {course.modulesCount}
              </div>
            </div>
          </div>

          <p className="max-w-xl text-sm leading-7 text-muted-foreground">
            {course.shortDescription}
          </p>
        </CardHeader>

        <CardContent className="py-6">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[1.3rem] border border-border/60 bg-background/72 px-4 py-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Star className="size-3.5 text-primary" weight="fill" />
                <span className="text-xs tracking-[0.16em] uppercase">
                  Rating
                </span>
              </div>
              <div className="mt-2 text-lg font-semibold">
                {course.rating.toFixed(1)}
              </div>
              <div className="text-xs text-muted-foreground">
                {course.reviewsCount} reviews
              </div>
            </div>

            <div className="rounded-[1.3rem] border border-border/60 bg-background/72 px-4 py-3">
              <div className="text-xs tracking-[0.16em] text-muted-foreground uppercase">
                Students
              </div>
              <div className="mt-2 text-lg font-semibold">
                {course.studentsCount}+
              </div>
              <div className="text-xs text-muted-foreground">
                Active learners
              </div>
            </div>

            <div className="rounded-[1.3rem] border border-border/60 bg-background/72 px-4 py-3">
              <div className="text-xs tracking-[0.16em] text-muted-foreground uppercase">
                Language
              </div>
              <div className="mt-2 text-lg font-semibold uppercase">
                {course.language}
              </div>
              <div className="text-xs text-muted-foreground">
                Structured lessons
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          <ul className="space-y-3 text-sm text-foreground/90">
            {course.features.slice(0, 3).map((feature) => (
              <li key={feature} className="flex gap-3">
                <span className="mt-2 size-2 rounded-full bg-primary" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>

        <CardFooter className="mt-auto justify-between gap-4 border-t border-border/55 py-6">
          <div>
            <div className="text-[0.68rem] tracking-[0.2em] text-muted-foreground uppercase">
              Launch price
            </div>
            <div className="mt-2 flex items-end gap-3">
              <div className="text-3xl font-semibold tracking-tight">
                {formatPrice(course.price, course.currency)}
              </div>
              {originalPrice ? (
                <div className="pb-1 text-sm text-muted-foreground line-through">
                  {originalPrice}
                </div>
              ) : null}
            </div>
          </div>

          <Button
            variant="outline"
            render={<Link href={`/courses/${course.slug}`} />}
          >
            View syllabus <ArrowUpRight />
          </Button>
        </CardFooter>
      </Card>
    </article>
  )
}
