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
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="next" value={nextPath} />

      {mode === "signup" ? (
        <label className="block space-y-2">
          <span className="section-kicker block">Full name</span>
          <Input
            name="name"
            required
            className="h-14 rounded-[1.45rem] px-5"
            placeholder="Jane Founder"
          />
        </label>
      ) : null}

      <label className="block space-y-2">
        <span className="section-kicker block">Email</span>
        <Input
          name="email"
          type="email"
          autoComplete="email"
          required
          className="h-14 rounded-[1.45rem] px-5"
          placeholder="you@example.com"
        />
      </label>

      <label className="block space-y-2">
        <span className="section-kicker block">Password</span>
        <Input
          name="password"
          type="password"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          required
          minLength={8}
          className="h-14 rounded-[1.45rem] px-5"
          placeholder="Minimum 8 characters"
        />
      </label>

      {state.error ? (
        <div className="rounded-[1.35rem] border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {state.error}
        </div>
      ) : null}

      <Button
        type="submit"
        size="lg"
        disabled={pending}
        className="h-14 w-full justify-between rounded-[1.45rem] px-5 text-sm"
      >
        {pending
          ? mode === "login"
            ? "Signing in..."
            : "Creating your account..."
          : mode === "login"
            ? "Log in"
            : "Create account"}
        <ArrowRight className="size-4" />
      </Button>
    </form>
  )
}
