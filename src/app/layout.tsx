import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { NavBar } from "@/components/NavBar";
import { SessionProvider } from "@/components/SessionProvider";
import { Toaster } from "sonner";
import { Link2, Twitter, Github, Linkedin } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            {/* Background */}
            <div className="fixed inset-0 -z-10 h-full w-full bg-background">
              <div className="absolute inset-0 bg-grid-small-black/[0.05] dark:bg-grid-small-white/[0.05]" />
              <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/5 to-background" />
            </div>
            
            <div className="flex flex-col min-h-screen">
              <NavBar />
              <main className="flex-grow">
                {children}
              </main>
              
              {/* Footer */}
              <footer className="border-t bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto px-4 py-12">
                  {/* Top section with logo and description */}
                  <div className="flex flex-col items-center text-center mb-12 space-y-4">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 rounded-lg bg-primary">
                        <Link2 className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <span className="text-2xl font-semibold tracking-tight">URLShort</span>
                    </div>
                    <p className="text-muted-foreground max-w-md">
                      Professional URL shortening service with advanced analytics and secure link management.
                    </p>
                  </div>

                  {/* Main footer content */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                    <div>
                      <h4 className="font-semibold mb-4">Product</h4>
                      <ul className="space-y-3 text-sm">
                        <li>
                          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
                        </li>
                        <li>
                          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Analytics</a>
                        </li>
                        <li>
                          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Security</a>
                        </li>
                        <li>
                          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-4">Resources</h4>
                      <ul className="space-y-3 text-sm">
                        <li>
                          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Documentation</a>
                        </li>
                        <li>
                          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">API Reference</a>
                        </li>
                        <li>
                          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Blog</a>
                        </li>
                        <li>
                          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Support</a>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-4">Company</h4>
                      <ul className="space-y-3 text-sm">
                        <li>
                          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">About</a>
                        </li>
                        <li>
                          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Careers</a>
                        </li>
                        <li>
                          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a>
                        </li>
                        <li>
                          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Partners</a>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-4">Legal</h4>
                      <ul className="space-y-3 text-sm">
                        <li>
                          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
                        </li>
                        <li>
                          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms</a>
                        </li>
                        <li>
                          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Cookie Policy</a>
                        </li>
                        <li>
                          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Licenses</a>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Bottom section with social links and copyright */}
                  <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t">
                    <p className="text-sm text-muted-foreground mb-4 md:mb-0">
                      &copy; {new Date().getFullYear()} URLShort. All rights reserved.
                    </p>
                    <div className="flex items-center space-x-4">
                      <a href="#" className="p-2 rounded-full hover:bg-accent transition-colors">
                        <Twitter className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                      </a>
                      <a href="#" className="p-2 rounded-full hover:bg-accent transition-colors">
                        <Github className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                      </a>
                      <a href="#" className="p-2 rounded-full hover:bg-accent transition-colors">
                        <Linkedin className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                      </a>
                    </div>
                  </div>
                </div>
              </footer>
            </div>
            
            <Toaster />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
