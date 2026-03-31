import Link from "next/link"

import { Logo } from "@/components/academy/logo"
import { MobileMenu } from "@/components/academy/mobile-menu"
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
        "sticky top-0 z-30 border-b border-border/40 bg-background/80 backdrop-blur-lg",
        className
      )}
    >
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <div className="flex h-16 items-center justify-between gap-8">
          <Link href="/" className="shrink-0">
            <Logo compact={!tenant.showHeaderName} />
          </Link>

          <nav className="hidden items-center gap-8 text-[0.84rem] text-muted-foreground md:flex">
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

          <div className="hidden items-center gap-3 md:flex">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              render={<Link href="/login" />}
            >
              Log in
            </Button>
            <Button size="sm" render={<Link href="/signup" />}>
              Get started
            </Button>
          </div>

          <MobileMenu navItems={navItems} />
        </div>
      </div>
    </header>
  )
}
