"use client"

import { useState } from "react"
import { Check, Copy } from "@phosphor-icons/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function DemoCredentials() {
  const [copied, setCopied] = useState(false)

  const email = "demo@launchcraft.academy"
  const password = "Launchcraft123!"

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        `Email: ${email}\nPassword: ${password}`
      )
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy", err)
    }
  }

  return (
    <Card className="atelier-panel relative mt-8 overflow-hidden py-0">
      {/* Subtle background glow to make it stand out beautifully but not extravagantly */}
      <div className="absolute -top-8 -right-8 size-32 rounded-full bg-foreground/5 blur-3xl" />

      <CardHeader className="border-b border-border/55 py-5 sm:py-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="space-y-1.5">
            <div className="section-kicker">Demo student account</div>
            <CardTitle className="text-2xl sm:text-3xl">
              Quick access demo credentials
            </CardTitle>
          </div>
          <Button
            onClick={handleCopy}
            variant="secondary"
            size="sm"
            className="h-10 w-full shrink-0 rounded-full transition-all active:scale-95 sm:w-auto"
          >
            {copied ? (
              <span className="flex items-center gap-2">
                <Check className="size-4 text-green-500" /> Copied!
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Copy className="size-4" /> Copy details
              </span>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-6 py-5 text-sm leading-7 text-muted-foreground sm:flex-row sm:py-6">
        <div className="flex-1 space-y-1">
          <span className="block text-xs tracking-wider text-muted-foreground/70 uppercase">
            Email
          </span>
          <code className="rounded-md border border-border/50 bg-background px-2 py-1 text-[13px] font-medium text-foreground">
            {email}
          </code>
        </div>
        <div className="flex-1 space-y-1">
          <span className="block text-xs tracking-wider text-muted-foreground/70 uppercase">
            Password
          </span>
          <code className="rounded-md border border-border/50 bg-background px-2 py-1 text-[13px] font-medium text-foreground">
            {password}
          </code>
        </div>
      </CardContent>
    </Card>
  )
}
