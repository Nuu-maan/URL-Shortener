"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, Link2, BarChart2, Home, Settings } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ModeToggle } from "./mode-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function NavBar() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-primary">
              <Link2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-xl tracking-tight">URLShort</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link 
              href="/analytics" 
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <BarChart2 className="h-4 w-4" />
              <span>Analytics</span>
            </Link>
            <Link 
              href="/settings" 
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Link>
          </div>

          {/* Desktop Auth & Theme */}
          <div className="hidden md:flex items-center space-x-4">
            <ModeToggle />
            {status === "authenticated" ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {session.user?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{session.user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{session.user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => signIn()} variant="default" size="sm">
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-accent"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t bg-background"
          >
            <div className="container px-4 py-4 space-y-3">
              <Link
                href="/"
                className="flex items-center space-x-2 py-2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
              <Link
                href="/analytics"
                className="flex items-center space-x-2 py-2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <BarChart2 className="h-4 w-4" />
                <span>Analytics</span>
              </Link>
              <Link
                href="/settings"
                className="flex items-center space-x-2 py-2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
              <div className="pt-4 border-t">
                {status === "authenticated" ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                        <AvatarFallback>{session.user?.name?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{session.user?.name}</span>
                        <span className="text-xs text-muted-foreground">{session.user?.email}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => {
                        signOut();
                        setIsOpen(false);
                      }}
                    >
                      Sign out
                    </Button>
                  </div>
                ) : (
                  <Button
                    className="w-full"
                    onClick={() => {
                      signIn();
                      setIsOpen(false);
                    }}
                  >
                    Sign In
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
} 