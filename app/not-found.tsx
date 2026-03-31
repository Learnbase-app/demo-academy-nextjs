import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-5">
      <div className="max-w-md text-center">
        <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
          Not found
        </p>
        <h1 className="font-heading mt-3 text-3xl font-semibold tracking-tight">
          That page doesn&apos;t exist.
        </h1>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          The route may have moved, or the requested course is no longer
          available.
        </p>
        <Button className="mt-6" render={<Link href="/" />}>
          Back home
        </Button>
      </div>
    </div>
  )
}
