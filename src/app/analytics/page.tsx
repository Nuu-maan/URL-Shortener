"use client";

import { Analytics } from "@/components/analytics/analytics";
import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, BarChart2 } from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function AnalyticsPage() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      signIn(undefined, { callbackUrl: "/analytics" });
    }
  }, [status]);

  if (status === "loading") {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-4rem)] gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="p-4 rounded-full bg-primary/10"
        >
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg font-medium text-muted-foreground"
        >
          Loading your analytics...
        </motion.p>
      </div>
    );
  }

  if (!session) return null;

  return (
    <main className="min-h-[calc(100vh-4rem)]">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)] dark:[background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]" />
      
      <div className="container mx-auto p-6">
        <motion.div 
          className="py-10"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div 
            variants={item}
            className="flex flex-col items-center justify-center gap-4 mb-12"
          >
            <div className="p-3 rounded-xl bg-primary/10 shadow-xl shadow-primary/20">
              <BarChart2 className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50">
              Analytics Dashboard
            </h1>
            <p className="text-muted-foreground text-lg text-center max-w-2xl">
              Track the performance of your shortened URLs with detailed analytics and insights
            </p>
          </motion.div>

          <motion.div variants={item}>
            <Analytics />
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
