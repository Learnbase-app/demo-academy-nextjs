import Link from "next/link"

import { Logo } from "@/components/academy/logo"
import { MobileMenu } from "@/components/academy/mobile-menu"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Tenant } from "@/lib/learnbase/types"

type PublicHeaderProps = {
  tenant: Tenant
  className?: string
}

export function PublicHeader({ tenant, className }: PublicHeaderProps) {
  const navItems = [
    { label: "Courses", url: "/courses" },
    ...(tenant.navLinks ?? []),
  ]

  return (
    <header
      className={cn(
        "sticky top-0 z-30 border-b border-border/60 bg-background/78 backdrop-blur-xl",
        className
      )}
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex items-center justify-between gap-6 py-4">
          <Link href="/" className="shrink-0">
            <Logo compact={!tenant.showHeaderName} />
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            {navItems.map((link) => (
              <Link
                key={`${link.label}-${link.url}`}
                href={link.url}
                target={link.openInNewTab ? "_blank" : undefined}
                rel={link.openInNewTab ? "noreferrer" : undefined}
                className="transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 sm:flex">
            <Button variant="ghost" size="sm" render={<Link href="/login" />}>
              Log in
            </Button>
            <Button size="sm" render={<Link href="/signup" />}>
              Get started
            </Button>
          </div>

          <MobileMenu navItems={navItems} />
        </div>

        <div className="hidden items-center justify-between gap-4 border-t border-border/50 py-3 md:flex">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className="text-[0.64rem] tracking-[0.22em] uppercase"
            >
              {tenant.heroCta ?? "Cohort admissions open"}
            </Badge>
            <Badge
              variant="secondary"
              className="text-[0.64rem] tracking-[0.22em] text-foreground/80 uppercase"
            >
              Server-first Next.js storefront
            </Badge>
          </div>

          <div className="text-[0.68rem] tracking-[0.24em] text-muted-foreground uppercase">
            Premium academy demo
          </div>
        </div>
      </div>
    </header>
  )
}
