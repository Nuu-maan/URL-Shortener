"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Copy, Link as LinkIcon, Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";

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
    } catch (err) {
      console.error("Error creating short URL:", err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (navigator.clipboard && shortUrl) {
      navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="url"
              placeholder="Enter URL to shorten"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" disabled={!url.trim() || isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LinkIcon className="mr-2 h-4 w-4" />
              )}
              Shorten
            </Button>
          </div>

          {error && (
            <div className="mt-2 text-sm text-red-500">
              {error}
            </div>
          )}

          {remainingLinks !== null && (
            <div className="mt-2 text-sm text-gray-500">
              {remainingLinks} guest links remaining. <button onClick={() => signIn()} className="text-blue-500 hover:underline">Sign in</button> for unlimited links!
            </div>
          )}

          {shortUrl && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium truncate flex-1">
                  <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {shortUrl}
                  </a>
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={copyToClipboard}
                  className="flex-shrink-0"
                >
                  {copied ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
