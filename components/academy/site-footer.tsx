import Link from "next/link"

import {
  FacebookLogo,
  InstagramLogo,
  LinkedinLogo,
  XLogo,
  YoutubeLogo,
} from "@phosphor-icons/react/dist/ssr"

import { Logo } from "@/components/academy/logo"
import { Button } from "@/components/ui/button"
import type { Tenant } from "@/lib/learnbase/types"

type SiteFooterProps = {
  tenant: Tenant
}

export function SiteFooter({ tenant }: SiteFooterProps) {
  const socialLinks = [
    {
      key: "twitter",
      href: tenant.socialLinks?.twitter,
      label: "X",
      icon: XLogo,
    },
    {
      key: "linkedin",
      href: tenant.socialLinks?.linkedin,
      label: "LinkedIn",
      icon: LinkedinLogo,
    },
    {
      key: "instagram",
      href: tenant.socialLinks?.instagram,
      label: "Instagram",
      icon: InstagramLogo,
    },
    {
      key: "youtube",
      href: tenant.socialLinks?.youtube,
      label: "YouTube",
      icon: YoutubeLogo,
    },
    {
      key: "facebook",
      href: tenant.socialLinks?.facebook,
      label: "Facebook",
      icon: FacebookLogo,
    },
  ].filter((item) => item.href)

  return (
    <footer className="border-t border-border/40">
      <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {tenant.footerText ??
                "A focused learning business demo powered by LearnBase and a server-first Next.js storefront."}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              Explore
            </p>
            <nav className="mt-4 flex flex-col gap-2.5 text-sm text-muted-foreground">
              <Link href="/courses" className="hover:text-foreground">
                Courses
              </Link>
              <Link href="/login" className="hover:text-foreground">
                Log in
              </Link>
              <Link href="/signup" className="hover:text-foreground">
                Sign up
              </Link>
            </nav>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              Contact
            </p>
            <div className="mt-4 text-sm text-muted-foreground">
              {tenant.contactEmail ?? "hello@launchcraft.academy"}
            </div>

            {socialLinks.length > 0 ? (
              <div className="mt-5 flex gap-1.5">
                {socialLinks.map((item) => {
                  const Icon = item.icon

                  return (
                    <Button
                      key={item.key}
                      variant="ghost"
                      size="icon-sm"
                      render={
                        <a
                          href={item.href!}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={item.label}
                        />
                      }
                    >
                      <Icon />
                    </Button>
                  )
                })}
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border/30 pt-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            One offer, one path, one calm learner journey.
          </p>
          <p className="tracking-widest uppercase">
            LearnBase + Next.js
          </p>
        </div>
      </div>
    </footer>
  )
}
