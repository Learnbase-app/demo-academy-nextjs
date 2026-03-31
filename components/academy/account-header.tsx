import Link from "next/link"

import { logoutAction } from "@/app/actions"
import { Logo } from "@/components/academy/logo"
import { Button } from "@/components/ui/button"
import type { Student } from "@/lib/learnbase/types"

type AccountHeaderProps = {
  student: Student
}

export function AccountHeader({ student }: AccountHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-6 px-5 sm:px-8">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Logo compact />
          </Link>
          <div className="hidden text-sm sm:block">
            <span className="text-muted-foreground">{student.name}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" render={<Link href="/account" />}>
            Dashboard
          </Button>
          <form action={logoutAction}>
            <Button variant="outline" size="sm" type="submit">
              Log out
            </Button>
          </form>
        </div>
      </div>
    </header>
  )
}
