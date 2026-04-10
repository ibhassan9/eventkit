"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  attendeeLoginSchema,
  changePasswordSchema,
} from "@eventkit/lib/validators";
import type {
  AttendeeLoginInput,
  ChangePasswordInput,
} from "@eventkit/lib/validators";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@eventkit/ui/dialog";
import { Input } from "@eventkit/ui/input";
import { Label } from "@eventkit/ui/label";
import Link from "next/link";
import { loginAction, changePasswordAction } from "../auth/actions";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slug: string;
  primaryColor: string;
}

type ModalState = "login" | "change-password";

export function LoginModal({
  open,
  onOpenChange,
  slug,
  primaryColor,
}: LoginModalProps) {
  const router = useRouter();
  const [state, setState] = useState<ModalState>("login");
  const [error, setError] = useState<string | null>(null);

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setState("login");
      setError(null);
      loginForm.reset();
      passwordForm.reset();
    }
    onOpenChange(nextOpen);
  }

  const loginForm = useForm<AttendeeLoginInput>({
    resolver: zodResolver(attendeeLoginSchema),
    defaultValues: { email: "", password: "", slug },
  });

  const passwordForm = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  async function onLogin(data: AttendeeLoginInput) {
    setError(null);
    const result = await loginAction({ ...data, slug });
    if (!result.success) {
      setError(result.error);
      return;
    }
    if (result.data.mustChangePassword) {
      setState("change-password");
    } else {
      handleOpenChange(false);
      router.refresh();
    }
  }

  async function onChangePassword(data: ChangePasswordInput) {
    setError(null);
    const result = await changePasswordAction(data);
    if (!result.success) {
      setError(result.error);
      return;
    }
    handleOpenChange(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        {state === "login" ? (
          <>
            <DialogHeader>
              <DialogTitle>Log in</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={loginForm.handleSubmit(onLogin)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="you@example.com"
                  {...loginForm.register("email")}
                />
                {loginForm.formState.errors.email && (
                  <p className="text-xs text-red-600">
                    {loginForm.formState.errors.email.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="Your password"
                  {...loginForm.register("password")}
                />
                {loginForm.formState.errors.password && (
                  <p className="text-xs text-red-600">
                    {loginForm.formState.errors.password.message}
                  </p>
                )}
              </div>
              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}
              <button
                type="submit"
                disabled={loginForm.formState.isSubmitting}
                className="w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: primaryColor }}
              >
                {loginForm.formState.isSubmitting ? "Logging in..." : "Log In"}
              </button>
              <p className="text-center text-sm text-zinc-500">
                Don&apos;t have an account?{" "}
                <Link
                  href={`/${slug}/register`}
                  className="font-medium underline underline-offset-2"
                  style={{ color: primaryColor }}
                  onClick={() => handleOpenChange(false)}
                >
                  Register
                </Link>
              </p>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Set your new password</DialogTitle>
              <DialogDescription>
                You&apos;re using a temporary password. Please set a new one to
                continue.
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={passwordForm.handleSubmit(onChangePassword)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="new-password">New password</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Min. 8 characters"
                  {...passwordForm.register("newPassword")}
                />
                {passwordForm.formState.errors.newPassword && (
                  <p className="text-xs text-red-600">
                    {passwordForm.formState.errors.newPassword.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Re-enter your password"
                  {...passwordForm.register("confirmPassword")}
                />
                {passwordForm.formState.errors.confirmPassword && (
                  <p className="text-xs text-red-600">
                    {passwordForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>
              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}
              <button
                type="submit"
                disabled={passwordForm.formState.isSubmitting}
                className="w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: primaryColor }}
              >
                {passwordForm.formState.isSubmitting
                  ? "Setting password..."
                  : "Set Password & Continue"}
              </button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
