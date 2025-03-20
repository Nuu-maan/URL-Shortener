"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Copy, Link as LinkIcon, Loader2, ExternalLink } from "lucide-react";
import { signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export function URLShortener() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [remainingLinks, setRemainingLinks] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    try {
      setIsLoading(true);
      setError("");
      setShortUrl(""); // Reset previous short URL on new request

      const response = await fetch("/api/url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      let data;
      const text = await response.text();
      try {
        data = text ? JSON.parse(text) : {};
      } catch (error) {
        console.error("JSON Parsing Error:", error);
        throw new Error("Unexpected response from server");
      }

      if (!response.ok) {
        if (data.requiresSignIn) {
          // Show sign in prompt
          const shouldSignIn = window.confirm(
            "You've used all your guest links. Would you like to sign in for unlimited links?"
          );
          if (shouldSignIn) {
            signIn(undefined, { callbackUrl: window.location.href });
            return;
          }
        }
        throw new Error(data.error || "Failed to create short URL");
      }

      setShortUrl(data.shortUrl);
      if (typeof data.remainingLinks === 'number') {
        setRemainingLinks(data.remainingLinks);
      }
      toast.success("URL shortened successfully!");
    } catch (err) {
      console.error("Error creating short URL:", err);
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (navigator.clipboard && shortUrl) {
      navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card className="w-full backdrop-blur-sm bg-background/50">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Input
                type="url"
                placeholder="Enter your long URL here..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                className="pr-10 h-12 text-base"
                disabled={isLoading}
              />
              <LinkIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
            <Button 
              type="submit" 
              disabled={!url.trim() || isLoading}
              size="lg"
              className="min-w-[120px] h-12 text-base font-medium"
            >
              {isLoading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center"
                >
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center"
                >
                  <LinkIcon className="mr-2 h-5 w-5" />
                  Shorten
                </motion.div>
              )}
            </Button>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-sm text-red-500 bg-red-50 dark:bg-red-950/50 rounded-lg p-3 flex items-start"
              >
                <div className="flex-1">{error}</div>
              </motion.div>
            )}

            {remainingLinks !== null && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-sm bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-lg p-3 flex items-center justify-between"
              >
                <span>{remainingLinks} guest links remaining</span>
                <Button 
                  variant="link" 
                  onClick={() => signIn()} 
                  className="text-blue-600 dark:text-blue-400 p-0 h-auto font-medium hover:no-underline"
                >
                  Sign in for unlimited links →
                </Button>
              </motion.div>
            )}

            {shortUrl && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 bg-muted/50 backdrop-blur-sm rounded-lg border"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <label className="text-xs text-muted-foreground mb-1 block">Shortened URL</label>
                    <div className="flex items-center gap-2">
                      <a 
                        href={shortUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-primary font-medium truncate hover:underline flex items-center gap-1"
                      >
                        {shortUrl}
                        <ExternalLink className="h-3 w-3 flex-shrink-0" />
                      </a>
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    onClick={copyToClipboard}
                    className="flex-shrink-0 h-9"
                  >
                    {copied ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center"
                      >
                        <Check className="mr-2 h-4 w-4" />
                        Copied!
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center"
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Copy
                      </motion.div>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </CardContent>
    </Card>
  );
}
