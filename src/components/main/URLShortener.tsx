// src/components/URLShortener.tsx
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Check, Copy, Link as LinkIcon } from "lucide-react"

export function URLShortener() {
  const [url, setUrl] = useState("")
  const [shortUrl, setShortUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setShortUrl("")

    try {
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to shorten URL")
      }

      setShortUrl(data.shortUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      setError("Failed to copy to clipboard")
    }
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>URL Shortener</CardTitle>
        <CardDescription>Enter a long URL to get a shorter version</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="url"
              placeholder="Enter your URL..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="flex-1"
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Shortening..." : "Shorten"}
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {shortUrl && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <LinkIcon className="h-4 w-4 text-muted-foreground" />
                <span className="flex-1 text-sm font-medium">{shortUrl}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={copyToClipboard}
                  className="h-8"
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  <span className="sr-only">Copy to clipboard</span>
                </Button>
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}