"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const { status } = useSession(); // ✅ Removed unused `session`
  const router = useRouter();

  // Redirect if user is already authenticated
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
      <h2 className="text-2xl font-bold">Sign in to URL Shortener</h2>

      <button
        onClick={() => signIn("google")}
        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
      >
        Sign in with Google
      </button>

      <button
        onClick={() => signIn("discord")}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Sign in with Discord
      </button>
    </div>
  );
}
