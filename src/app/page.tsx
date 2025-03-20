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

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-4rem)]">
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
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="glass p-1 rounded-xl">
            <URLShortener />
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-24"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={item}
              className="group p-6 rounded-xl border bg-card/50 backdrop-blur-sm hover:bg-card/80 text-card-foreground hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="p-2.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-lg">{feature.title}</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          className="mt-24 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-12">Trusted by thousands of users</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-xl bg-card/50 backdrop-blur-sm"
              >
                <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  );
}

const features = [
  {
    title: "Lightning Fast",
    description: "Generate short URLs instantly with our optimized infrastructure",
    icon: <Zap className="h-5 w-5 text-primary" />,
  },
  {
    title: "Detailed Analytics",
    description: "Track clicks, locations, and engagement with real-time analytics",
    icon: <BarChart2 className="h-5 w-5 text-primary" />,
  },
  {
    title: "Secure by Default",
    description: "All shortened URLs are encrypted and protected against abuse",
    icon: <Shield className="h-5 w-5 text-primary" />,
  },
];

const stats = [
  {
    value: "1M+",
    label: "Links Shortened"
  },
  {
    value: "100K+",
    label: "Active Users"
  },
  {
    value: "99.9%",
    label: "Uptime"
  }
];
