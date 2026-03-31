import Link from "next/link"

import { logoutAction } from "@/app/actions"
import { Logo } from "@/components/academy/logo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Student } from "@/lib/learnbase/types"

type AccountHeaderProps = {
  student: Student
}

export function AccountHeader({ student }: AccountHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/82 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Logo compact />
          </Link>
          <div className="hidden sm:block">
            <div className="section-kicker">Student workspace</div>
            <p className="mt-1 text-sm text-muted-foreground">
              Signed in as {student.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="hidden text-[0.64rem] tracking-[0.18em] uppercase md:inline-flex"
          >
            {student.email}
          </Badge>
          <Button variant="ghost" size="sm" render={<Link href="/account" />}>
            Account
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
