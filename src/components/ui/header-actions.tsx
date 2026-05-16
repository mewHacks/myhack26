"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import { getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase";

function getAuthErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Sign in failed. Please try again.";
}

export function HeaderActions() {
  const router = useRouter();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignIn() {
    setError(null);

    if (!isFirebaseConfigured()) {
      setError("Firebase is not configured. Add the NEXT_PUBLIC_FIREBASE_* environment variables.");
      return;
    }

    setIsSigningIn(true);

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });

      await signInWithPopup(getFirebaseAuth(), provider);
      router.push("/dashboard");
    } catch (signInError) {
      setError(getAuthErrorMessage(signInError));
    } finally {
      setIsSigningIn(false);
    }
  }

  return (
    <div className="flex items-center justify-self-end gap-3">
      <Link
        href="/dashboard"
        className="rounded-full border border-line px-4 py-1.5 text-sm font-medium text-foreground transition hover:bg-black/4"
      >
        Dashboard
      </Link>
      <div className="relative flex items-center">
        <button
          type="button"
          onClick={handleSignIn}
          disabled={isSigningIn}
          className="text-sm font-medium text-muted transition hover:text-foreground disabled:cursor-wait disabled:opacity-60"
        >
          {isSigningIn ? "Signing in..." : "Sign in"}
        </button>
        {error ? (
          <p className="absolute right-0 top-full z-20 mt-2 w-64 rounded-xl border border-line bg-white p-3 text-xs text-red-600 shadow-lg">
            {error}
          </p>
        ) : null}
      </div>
    </div>
  );
}
