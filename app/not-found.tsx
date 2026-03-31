import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function NotFound() {
  return (
    <div className="hero-glow flex min-h-svh items-center justify-center bg-background px-6">
      <Card className="atelier-panel max-w-xl py-0 text-center">
        <CardHeader className="border-b border-border/55 py-8">
          <p className="section-kicker">Not found</p>
          <CardTitle className="mt-4 text-4xl">
            That page doesn&apos;t exist.
          </CardTitle>
        </CardHeader>
        <CardContent className="py-8">
          <p className="text-sm leading-7 text-muted-foreground">
            The route may have moved, or the requested course is no longer
            available.
          </p>
          <Button className="mt-8" render={<Link href="/" />}>
            Back home
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
