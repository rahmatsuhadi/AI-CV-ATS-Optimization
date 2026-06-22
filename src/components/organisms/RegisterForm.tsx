"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { registerWithPassword } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RegisterForm() {
  const router = useRouter();

  const registerAction = async (
    _prevState: { error: string | null } | null,
    formData: FormData,
  ) => {
    const result = await registerWithPassword(formData);
    if (result.error) {
      return { error: result.error };
    }
    // Typically, sign-up requires email verification or auto logs in.
    // Here we redirect to setup/dashboard assuming auto login.
    router.push("/dashboard");
    return { error: null };
  };

  const [state, formAction, isPending] = useActionState(registerAction, {
    error: null,
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5 text-center">
        <h2 className="font-heading text-xl font-bold tracking-tight">
          Buat Akun Baru
        </h2>
        <p className="text-xs text-muted-foreground">
          Mulai kelola lamaran kerja dan CV kamu
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
            Alamat Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="nama@organisasi.com"
            className="h-10 rounded-xl shadow-none"
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password" className="text-xs text-muted-foreground">
            Kata Sandi
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
          {isPending ? "Membuat akun..." : "Daftar Sekarang"}
        </Button>
      </form>

      <div className="text-center text-xs text-muted-foreground">
        Sudah punya akun?{" "}
        <Link
          href="/login"
          className="underline hover:text-primary font-medium"
        >
          Masuk
        </Link>
      </div>
    </div>
  );
}
