"use client";

// src/app/page.tsx
import { URLShortener } from "@/components/main/URLShortener";
import { Link2, BarChart2, Shield, Zap, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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

const features = [
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Lightning Fast",
    description: "Generate short URLs instantly with our optimized infrastructure"
  },
  {
    icon: <BarChart2 className="h-6 w-6" />,
    title: "Detailed Analytics",
    description: "Track clicks, locations, and engagement with real-time analytics"
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Secure by Default",
    description: "All shortened URLs are encrypted and protected against abuse"
  }
];

const stats = [
  {
    title: "Links Shortened",
    value: "1M+",
  },
  {
    title: "Active Users",
    value: "100K+",
  },
  {
    title: "Uptime",
    value: "99.9%",
  },
];

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-4rem)] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-16 sm:py-24">
        {/* Hero Section */}
        <motion.div 
          className="text-center space-y-8 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="flex items-center justify-center mb-8"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <div className="p-4 rounded-2xl bg-primary/10 shadow-xl shadow-primary/20">
              <Link2 className="h-12 w-12 text-primary" />
            </div>
          </motion.div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50">
            Shorten Your URLs
          </h1>

          <p className="max-w-2xl mx-auto text-muted-foreground text-lg sm:text-xl">
            Transform long, unwieldy links into clean, shareable URLs with just one click
          </p>

          <div className="flex items-center justify-center gap-4 pt-4">
            <Link href="/auth/sign-in">
              <Button size="lg" className="group">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/analytics">
              <Button variant="outline" size="lg">
                View Analytics
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* URL Shortener Card */}
        <motion.div 
          className="max-w-2xl mx-auto mb-32"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="glass p-1 rounded-2xl shadow-2xl shadow-primary/10">
            <URLShortener />
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={item}
              className="group relative p-8 rounded-2xl border bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-colors duration-300"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex flex-col items-center text-center space-y-4">
                <div className="p-4 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          className="relative"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute inset-0 -z-10 bg-primary/5 rounded-3xl blur-3xl" />
          <div className="relative px-8 py-16 rounded-3xl border bg-background/50 backdrop-blur-sm">
            <h2 className="text-3xl font-bold text-center mb-12">
              Trusted by thousands of users
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group p-6 rounded-xl bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300"
                >
                  <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">{stat.title}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
