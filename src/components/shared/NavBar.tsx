"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Home, Link as LinkIcon, BarChart, Menu, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function NavBar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Analytics", href: "/analytics", icon: BarChart },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="p-1 rounded-lg bg-primary/5 group-hover:bg-primary/10"
            >
              <LinkIcon className="h-6 w-6 text-primary" />
            </motion.div>
            <span className="hidden font-bold sm:inline-block text-lg tracking-tight">
              URL Shortener
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 transition-all duration-200 hover:text-primary ${
                    isActive 
                      ? "text-primary relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex-1" />

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-accent"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        {/* Authentication UI */}
        <div className="hidden md:flex items-center space-x-4 ml-4">
          {session ? (
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {session.user?.image && (
                <div className="relative group">
                  <Image
                    src={session.user.image}
                    alt="User Avatar"
                    width={36}
                    height={36}
                    className="rounded-full ring-2 ring-primary/20 transition-all duration-200 group-hover:ring-primary/40"
                  />
                  <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-background" />
                </div>
              )}
              <span className="text-sm font-medium">{session.user?.name}</span>
              <Button 
                onClick={() => signOut()} 
                variant="ghost" 
                size="sm"
                className="hover:bg-destructive/10 hover:text-destructive"
              >
                Sign Out
              </Button>
            </motion.div>
          ) : (
            <Link href="/auth/sign-in">
              <Button 
                variant="default" 
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t"
          >
            <nav className="flex flex-col space-y-4 p-4">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-2 p-2 rounded-lg transition-colors ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              {session ? (
                <div className="flex items-center justify-between p-2">
                  <div className="flex items-center space-x-3">
                    {session.user?.image && (
                      <Image
                        src={session.user.image}
                        alt="User Avatar"
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    )}
                    <span className="text-sm font-medium">{session.user?.name}</span>
                  </div>
                  <Button 
                    onClick={() => signOut()} 
                    variant="ghost" 
                    size="sm"
                    className="hover:bg-destructive/10 hover:text-destructive"
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Link href="/auth/sign-in" className="p-2">
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Sign In
                  </Button>
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
