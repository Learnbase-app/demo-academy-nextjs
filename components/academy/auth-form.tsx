"use client"

import { useActionState } from "react"

import { ArrowRight } from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { AuthActionState } from "@/app/actions"

type AuthFormProps = {
  action: (
    state: AuthActionState,
    formData: FormData
  ) => Promise<AuthActionState>
  mode: "login" | "signup"
  nextPath: string
}

const initialState: AuthActionState = {
  error: null,
}

export function AuthForm({ action, mode, nextPath }: AuthFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState)

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="next" value={nextPath} />

      {mode === "signup" ? (
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-foreground">
            Full name
          </span>
          <Input
            name="name"
            required
            className="h-11"
            placeholder="Jane Founder"
          />
        </label>
      ) : null}

      <label className="block space-y-1.5">
        <span className="text-sm font-medium text-foreground">Email</span>
        <Input
          name="email"
          type="email"
          autoComplete="email"
          required
          className="h-11"
          placeholder="you@example.com"
        />
      </label>

      <label className="block space-y-1.5">
        <span className="text-sm font-medium text-foreground">Password</span>
        <Input
          name="password"
          type="password"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          required
          minLength={8}
          className="h-11"
          placeholder="Minimum 8 characters"
        />
      </label>

      {state.error ? (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
          {state.error}
        </div>
      ) : null}

      <Button
        type="submit"
        size="lg"
        disabled={pending}
        className="mt-2 h-11 w-full"
      >
        {pending
          ? mode === "login"
            ? "Signing in..."
            : "Creating account..."
          : mode === "login"
            ? "Log in"
            : "Create account"}
        <ArrowRight className="size-4" />
      </Button>
    </form>
  )
}
