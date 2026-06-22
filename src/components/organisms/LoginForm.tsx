"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { loginWithPassword } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// FormAction using React 19 useActionState approach
export function LoginForm() {
  const router = useRouter();

  const loginAction = async (
    _prevState: { error: string | null } | null,
    formData: FormData,
  ) => {
    const result = await loginWithPassword(formData);
    if (result.error) {
      return { error: result.error };
    }
    router.push("/dashboard");
    return { error: null };
  };

  const [state, formAction, isPending] = useActionState(loginAction, {
    error: null,
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5 text-center">
        <h2 className="font-heading text-xl font-bold tracking-tight">
          Sign In
        </h2>
        <p className="text-xs text-muted-foreground">
          Enter credentials to access CV workspace
        </p>
      </div>

      <form action={formAction} className="flex flex-col gap-4">
        {state.error && (
          <div className="rounded-xl bg-danger/15 p-3 text-xs text-danger font-medium">
            {state.error}
          </div>
        )}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email" className="text-xs text-muted-foreground">
            Email address
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="workspace@org.com"
            className="h-10 rounded-xl shadow-none"
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password" className="text-xs text-muted-foreground">
            Password
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            className="h-10 rounded-xl shadow-none"
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full h-10 rounded-xl mt-2"
          disabled={isPending}
        >
          {isPending ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <div className="text-center text-xs text-muted-foreground">
        Need an account?{" "}
        <Link
          href="/register"
          className="underline hover:text-primary font-medium"
        >
          Register
        </Link>
      </div>
    </div>
  );
}
