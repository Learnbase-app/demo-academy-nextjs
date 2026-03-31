import type {
  CourseDetail,
  CourseListItem,
  LearnCourse,
  LearnItem,
  LearnModule,
} from "@/lib/learnbase/types"

export function formatPrice(price: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(price / 100)
}

export function getCourseStats(course: CourseListItem | CourseDetail) {
  return [
    `${course.modulesCount} modules`,
    `${"itemsCount" in course ? course.itemsCount : course.modulesCount} lessons`,
    `${"quizCount" in course ? course.quizCount : 0} quiz`,
    "includeCertificate" in course && course.includeCertificate
      ? "Certificate included"
      : "Launch-ready workflow",
  ]
}

export function getCourseProgressLabel(progress: number) {
  if (progress >= 100) return "Completed"
  if (progress > 0) return `${progress}% complete`
  return "Not started"
}

export function flattenLearnItems(course: LearnCourse) {
  return course.modules.flatMap((module) =>
    module.items.map((item) => ({
      ...item,
      module,
    }))
  )
}

export function findActiveLearnItem(
  course: LearnCourse,
  preferredItemId: string | null | undefined
): (LearnItem & { module: LearnModule }) | null {
  const items = flattenLearnItems(course)

  if (preferredItemId) {
    const selected = items.find((item) => item.id === preferredItemId)
    if (selected) {
      return selected
    }
  }

  if (course.resumeItemId) {
    const resume = items.find((item) => item.id === course.resumeItemId)
    if (resume) {
      return resume
    }
  }

  return items[0] ?? null
}
