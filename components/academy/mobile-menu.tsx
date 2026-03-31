"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { List, X } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

type MobileMenuProps = {
  navItems: { label: string; url: string; openInNewTab?: boolean }[]
}

export function MobileMenu({ navItems }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(true)}
        className="transition-active flex h-10 items-center gap-2 rounded-full border border-border/70 bg-background/80 px-4 text-sm font-medium text-foreground shadow-sm shadow-black/5 active:scale-95"
      >
        Menu <List className="size-4 text-muted-foreground" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%", opacity: 0.5 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0.5 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-[20rem] border-l border-border/50 bg-background shadow-2xl sm:max-w-sm"
            >
              <div className="flex h-full flex-col p-6">
                <div className="flex items-center justify-between pb-6">
                  <span className="text-sm font-medium tracking-widest text-muted-foreground uppercase">
                    Navigation
                  </span>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="flex size-10 items-center justify-center rounded-full bg-secondary/50 text-foreground transition-colors hover:bg-secondary active:scale-95"
                  >
                    <X className="size-4" />
                  </button>
                </div>

                <div className="flex-1 space-y-2 overflow-y-auto">
                  {navItems.map((link, i) => (
                    <motion.div
                      key={`${link.label}-${link.url}-mobile`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                    >
                      <Link
                        href={link.url}
                        onClick={() => setIsOpen(false)}
                        target={link.openInNewTab ? "_blank" : undefined}
                        rel={link.openInNewTab ? "noreferrer" : undefined}
                        className="block rounded-2xl p-4 text-2xl font-medium text-muted-foreground transition hover:bg-secondary/40 hover:text-foreground active:scale-95"
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-auto pt-6"
                >
                  <Separator className="mb-6" />
                  <div className="grid gap-3">
                    <Button
                      variant="outline"
                      size="lg"
                      className="h-12 w-full rounded-full text-base"
                      render={
                        <Link href="/login" onClick={() => setIsOpen(false)} />
                      }
                    >
                      Log in
                    </Button>
                    <Button
                      size="lg"
                      className="h-12 w-full rounded-full text-base"
                      render={
                        <Link href="/signup" onClick={() => setIsOpen(false)} />
                      }
                    >
                      Get started
                    </Button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
