"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { List, X } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"

type MobileMenuProps = {
  navItems: { label: string; url: string; openInNewTab?: boolean }[]
}

export function MobileMenu({ navItems }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

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
        className="flex size-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary active:scale-95"
        aria-label="Open menu"
      >
        <List className="size-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xs flex-col bg-background shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-border/40 px-5 py-4">
                <span className="text-sm font-medium text-muted-foreground">
                  Menu
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex size-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary active:scale-95"
                >
                  <X className="size-4" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto px-3 py-4">
                {navItems.map((link, i) => (
                  <motion.div
                    key={`${link.label}-${link.url}-mobile`}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.04 }}
                  >
                    <Link
                      href={link.url}
                      onClick={() => setIsOpen(false)}
                      target={link.openInNewTab ? "_blank" : undefined}
                      rel={link.openInNewTab ? "noreferrer" : undefined}
                      className="block rounded-lg px-4 py-3 text-[0.95rem] font-medium text-foreground transition-colors hover:bg-secondary/60"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="border-t border-border/40 p-5"
              >
                <div className="grid gap-2.5">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full"
                    render={
                      <Link href="/login" onClick={() => setIsOpen(false)} />
                    }
                  >
                    Log in
                  </Button>
                  <Button
                    size="lg"
                    className="w-full"
                    render={
                      <Link href="/signup" onClick={() => setIsOpen(false)} />
                    }
                  >
                    Get started
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
