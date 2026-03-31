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
import { Separator } from "@/components/ui/separator"
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
    <footer className="border-t border-border/50">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="atelier-panel rounded-[2.2rem] border border-border/70 p-8 md:p-10">
          <div className="grid gap-10 md:grid-cols-[1.25fr_0.75fr_0.85fr]">
            <div>
              <Logo />
              <p className="mt-5 max-w-md text-sm leading-7 text-muted-foreground">
                {tenant.footerText ??
                  "A focused learning business demo powered by LearnBase and a server-first Next.js storefront."}
              </p>
              <p className="mt-6 text-[0.7rem] tracking-[0.24em] text-muted-foreground uppercase">
                Built for creators, operators, and educators
              </p>
            </div>

            <div>
              <h2 className="section-kicker">Explore</h2>
              <div className="mt-5 space-y-3 text-sm text-muted-foreground">
                <div>
                  <Link href="/courses" className="hover:text-foreground">
                    Courses
                  </Link>
                </div>
                <div>
                  <Link href="/login" className="hover:text-foreground">
                    Log in
                  </Link>
                </div>
                <div>
                  <Link href="/signup" className="hover:text-foreground">
                    Sign up
                  </Link>
                </div>
              </div>
            </div>

            <div>
              <h2 className="section-kicker">Contact</h2>
              <div className="mt-5 space-y-3 text-sm text-muted-foreground">
                <div>{tenant.contactEmail ?? "hello@launchcraft.academy"}</div>
                <div>
                  Low-friction enrollment, clean storefronts, premium feel.
                </div>
              </div>

              {socialLinks.length > 0 ? (
                <div className="mt-6 flex flex-wrap gap-2">
                  {socialLinks.map((item) => {
                    const Icon = item.icon

                    return (
                      <Button
                        key={item.key}
                        variant="outline"
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

          <Separator className="my-8" />

          <div className="flex flex-col gap-3 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
            <p>
              Launchcraft is intentionally narrow: one offer, one path, one calm
              learner journey.
            </p>
            <p className="text-[0.72rem] tracking-[0.24em] uppercase">
              LearnBase + Next.js
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
