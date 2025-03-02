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
      signIn(); // Redirect to sign-in page
    }
  }, [status, router]);

  if (status === "loading") {
    return <p className="text-center">Loading...</p>;
  }

  if (!session) return null; 

  return (
    <main className="container mx-auto p-4">
      <div className="py-10">
        <h1 className="text-4xl font-bold text-center mb-8">
          Analytics Dashboard
        </h1>
        <Analytics />
      </div>
    </main>
  );
}
