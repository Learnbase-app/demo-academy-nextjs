import { cn } from "@/lib/utils"

type LogoProps = {
  className?: string
  compact?: boolean
}

export function Logo({ className, compact = false }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative flex size-11 items-center justify-center overflow-hidden rounded-[1.35rem] border border-border/70 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--card)_94%,transparent),color-mix(in_oklab,var(--secondary)_74%,transparent))] shadow-[0_16px_36px_-24px_color-mix(in_oklab,var(--foreground)_55%,transparent)]">
        <div className="absolute inset-[5px] rounded-[1rem] border border-white/55 bg-[radial-gradient(circle_at_top,color-mix(in_oklab,var(--primary)_10%,transparent),transparent_65%)]" />
        <svg
          viewBox="0 0 40 40"
          className="relative z-10 size-5 text-primary"
          aria-hidden="true"
        >
          <path
            d="M8 29.5 20 9l12 20.5h-5.5L20 18.8 13.5 29.5Z"
            fill="currentColor"
            opacity="0.95"
          />
          <path
            d="M20 18.8 24.8 27h-3.6L20 24.9 18.8 27h-3.6Z"
            fill="currentColor"
            opacity="0.45"
          />
        </svg>
      </div>

      {compact ? null : (
        <div>
          <div className="font-heading text-lg leading-none font-semibold tracking-tight">
            Launchcraft Academy
          </div>
          <div className="mt-1 text-[0.66rem] tracking-[0.28em] text-muted-foreground uppercase">
            Premium academy systems
          </div>
        </div>
      )}
    </div>
  )
}
