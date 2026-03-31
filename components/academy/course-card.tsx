import Link from "next/link"

import { ArrowUpRight, Star } from "@phosphor-icons/react/dist/ssr"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
      <div className="flex h-full flex-col rounded-xl border border-border/50 bg-card transition-all duration-200 hover:border-border hover:shadow-lg hover:shadow-black/[0.04]">
        <div className="flex-1 p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="secondary" className="text-xs">
                {course.level}
              </Badge>
              {course.tags[0] ? (
                <Badge variant="outline" className="text-xs">
                  {course.tags[0]}
                </Badge>
              ) : null}
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Star className="size-3.5 text-foreground" weight="fill" />
              <span className="font-medium text-foreground">
                {course.rating.toFixed(1)}
              </span>
            </div>
          </div>

          <h3 className="font-heading mt-4 text-xl leading-snug font-semibold tracking-tight">
            {course.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {course.shortDescription}
          </p>

          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
            <span>{course.modulesCount} modules</span>
            <span>{course.studentsCount}+ students</span>
            <span className="uppercase">{course.language}</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-border/40 px-5 py-4 sm:px-6">
          <div>
            <span className="text-lg font-semibold tracking-tight">
              {formatPrice(course.price, course.currency)}
            </span>
            {originalPrice ? (
              <span className="ml-2 text-sm text-muted-foreground line-through">
                {originalPrice}
              </span>
            ) : null}
          </div>

          <Button
            variant="ghost"
            size="sm"
            render={<Link href={`/courses/${course.slug}`} />}
          >
            View <ArrowUpRight className="size-3.5" />
          </Button>
        </div>
      </div>
    </article>
  )
}
