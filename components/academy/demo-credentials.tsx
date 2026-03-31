"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Copy } from "@phosphor-icons/react"

export function DemoCredentials() {
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const email = "demo@launchcraft.academy"
  const password = "Launchcraft123!"

  const handleCopy = async (value: string, field: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (err) {
      console.error("Failed to copy", err)
    }
  }

  return (
    <div className="rounded-xl border border-border/50 bg-secondary/30 p-4">
      <p className="mb-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
        Demo credentials
      </p>
      <div className="space-y-2">
        <CopyRow
          label="Email"
          value={email}
          copied={copiedField === "email"}
          onCopy={() => handleCopy(email, "email")}
        />
        <CopyRow
          label="Password"
          value={password}
          copied={copiedField === "password"}
          onCopy={() => handleCopy(password, "password")}
        />
      </div>
    </div>
  )
}

function CopyRow({
  label,
  value,
  copied,
  onCopy,
}: {
  label: string
  value: string
  copied: boolean
  onCopy: () => void
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-16 shrink-0 text-xs text-muted-foreground">
        {label}
      </span>
      <code className="flex-1 truncate font-mono text-sm text-foreground">
        {value}
      </code>
      <button
        onClick={onCopy}
        type="button"
        className="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground active:scale-95"
        aria-label={`Copy ${label}`}
      >
        <AnimatePresence mode="wait" initial={false}>
          {copied ? (
            <motion.div
              key="check"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.12 }}
            >
              <Check className="size-3.5 text-green-600 dark:text-green-400" weight="bold" />
            </motion.div>
          ) : (
            <motion.div
              key="copy"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.12 }}
            >
              <Copy className="size-3.5" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </div>
  )
}
