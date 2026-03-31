export type Tenant = {
  id: string
  name: string
  slug: string
  logo: string | null
  favicon: string | null
  theme: string
  seoTitle: string | null
  seoDescription: string | null
  seoKeywords: string | null
  heroTitle: string | null
  heroSubtitle: string | null
  heroCta: string | null
  footerText: string | null
  showHeaderName: boolean
  socialLinks: {
    twitter?: string
    linkedin?: string
    youtube?: string
    facebook?: string
    instagram?: string
    github?: string
  } | null
  contactEmail: string | null
  landingLayout: {
    showHero?: boolean
    showCourseGrid?: boolean
    showLiveSessions?: boolean
    courseGridTitle?: string
    courseGridDescription?: string
    courseGridLimit?: number
  } | null
  navLinks: Array<{
    label: string
    url: string
    openInNewTab?: boolean
  }> | null
  footerLayout: {
    showLogo?: boolean
    showSocialLinks?: boolean
    showContactEmail?: boolean
    showPoweredBy?: boolean
  } | null
}

export type Category = {
  id: string
  name: string
  slug: string
  description: string | null
}

export type CourseListItem = {
  id: string
  slug: string
  title: string
  shortDescription: string
  description: string
  thumbnail: string | null
  previewVideoUrl: string | null
  price: number
  originalPrice: number | null
  currency: string
  level: "beginner" | "intermediate" | "advanced"
  language: string
  tags: string[]
  features: string[]
  requirements: string[]
  objectives: string[]
  modulesCount: number
  studentsCount: number
  rating: number
  reviewsCount: number
  purchaseEnabled: boolean
  categories: Array<{ slug: string; name: string }>
  prices: Array<{
    currency: string
    price: number
    originalPrice: number | null
  }>
  instructor: {
    name: string | null
    avatar: string | null
    title: string | null
    bio: string | null
    website?: string | null
  } | null
}

export type CourseDetail = CourseListItem & {
  itemsCount: number
  videoCount: number
  documentCount: number
  quizCount: number
  includeCertificate: boolean
  modules: Array<{
    id: string
    title: string
    description: string | null
    itemsCount: number
    order: number
    releasedAt: string | null
  }>
}

export type Student = {
  id: string
  email: string
  name: string
  avatar: string | null
  locale: string
  role: "student"
  tenantId: string
  emailVerified: boolean
  createdAt: string
  updatedAt: string
  tenantSlug: string
}

export type AuthResponse = {
  user: Student
  accessToken: string
  refreshToken: string
}

export type Enrollment = {
  id: string
  status: "active" | "completed" | "cancelled"
  progress: number
  enrolledAt: string
  completedAt: string | null
  accessExpiresAt: string | null
  course: {
    id: string
    slug: string
    title: string
    shortDescription: string
    thumbnail: string | null
    level: string
    modulesCount: number
  }
}

export type LearnItemStatus = "not_started" | "in_progress" | "completed"

export type LearnDocumentContent = {
  id: string
  title: string
  description: string | null
  url: string | null
  mimeType: string | null
  fileName: string | null
  embedUrl: string | null
}

export type LearnVideoContent = {
  id: string
  title: string
  description: string | null
  url: string | null
  duration: number | null
  videoProgress: number
  transcript: string | null
}

export type LearnQuizContent = {
  id: string
  title: string
  description: string | null
  questions: Array<{
    id: string
    type: "multiple_choice" | "multiple_select" | "true_false"
    questionText: string
    explanation: string | null
    order: number
    options: Array<{
      id: string
      optionText: string
      order: number
    }>
  }>
}

export type LearnItem = {
  id: string
  title: string
  contentType: "document" | "quiz" | "video"
  order: number
  isPreview: boolean
  status: LearnItemStatus
  videoProgress: number
  quizBestScore: number | null
  locked: boolean
  content: LearnDocumentContent | LearnVideoContent | LearnQuizContent | null
}

export type LearnModule = {
  id: string
  title: string
  description: string | null
  order: number
  releasedAt: string | null
  locked: boolean
  items: LearnItem[]
}

export type LearnCourse = {
  course: {
    id: string
    slug: string
    title: string
    description: string | null
    thumbnail: string | null
  }
  enrollment: {
    id: string
    progress: number
    status: "active" | "completed" | "cancelled"
    completedAt: string | null
    accessExpiresAt: string | null
  }
  resumeItemId: string | null
  modules: LearnModule[]
}

export type PublicModuleItem = {
  id: string
  title: string
  contentType: "document" | "quiz" | "video"
  isPreview: boolean
  order: number
  mimeType: string | null
}

export type CheckoutSessionResponse =
  | {
      type: "free"
      message: string
    }
  | {
      type: "checkout"
      checkoutUrl?: string
      provider?: string
      paymentId?: string
      sessionId?: string
    }

export type QuizSubmissionResult = {
  score: number
  totalQuestions: number
  percentage: number
  results: Array<{
    questionId: string
    correct: boolean
    correctOptionIds: string[]
    explanation: string | null
  }>
  itemCompleted: boolean
  progress: number
  bestScore: number
}
