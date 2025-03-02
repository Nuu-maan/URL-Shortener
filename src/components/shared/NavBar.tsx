"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Home, Link as LinkIcon, BarChart } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button"; // Import ShadCN Button

export function NavBar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Shorten", href: "/shorten", icon: LinkIcon },
    { name: "Analytics", href: "/analytics", icon: BarChart },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <LinkIcon className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">
              URL Shortener
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 transition-colors hover:text-foreground/80 ${
                    isActive ? "text-foreground" : "text-foreground/60"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="hidden sm:inline-block">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex-1" />

        {/* Authentication UI */}
        {session ? (
          <div className="flex items-center space-x-4 ml-4">
            {session.user?.image && (
              <Image
                src={session.user.image}
                alt="User Avatar"
                width={32}
                height={32}
                className="rounded-full"
              />
            )}
            <span className="hidden sm:block">{session.user?.name}</span>
            <Button onClick={() => signOut()} variant="destructive" size="sm">
              Sign Out
            </Button>
          </div>
        ) : (
          <Link href="/auth/sign-in">
            <Button variant="default" size="sm">
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}
