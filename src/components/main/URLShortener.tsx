"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Check, Copy, Link as LinkIcon } from "lucide-react"

export function URLShortener() {
  const [url, setUrl] = useState("")
  const [shortUrl, setShortUrl] = useState("")
  const [copied, setCopied] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return // Prevent empty submission
    const mockShortUrl = `short.url/${Math.random().toString(36).slice(2, 8)}`
    setShortUrl(mockShortUrl)
  }

  const copyToClipboard = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shortUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

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
            />
            <Button type="submit" disabled={!url.trim()}>
              <LinkIcon className="mr-2 h-4 w-4" />
              Shorten URL
            </Button>
          </div>

          {shortUrl && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium truncate flex-1">
                  {shortUrl}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={copyToClipboard}
                  className="flex-shrink-0"
                  aria-live="polite"
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
  )
}
