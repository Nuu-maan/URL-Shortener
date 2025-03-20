"use client";

import { Analytics } from "@/components/analytics/analytics";
import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AnalyticsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      signIn(undefined, { callbackUrl: "/analytics" }); // Redirects back after login
    }
  }, [status]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  if (!session) return null; // Prevents rendering issues

  return (
    <main className="container mx-auto p-6">
      <div className="py-10">
        <h1 className="text-4xl font-bold text-center mb-8">
          Analytics Dashboard
        </h1>
        <Analytics />
      </div>
    </main>
  );
}
