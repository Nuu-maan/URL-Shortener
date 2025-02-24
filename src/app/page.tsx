// src/app/page.tsx
import { URLShortener } from '@/components/main/URLShortener';
import { Link2 } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-16 sm:py-24">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="p-3 rounded-2xl bg-primary/10 animate-in fade-in duration-500">
              <Link2 className="h-10 w-10 text-primary" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            Shorten Your URLs
          </h1>
          
          <p className="max-w-2xl mx-auto text-muted-foreground text-lg sm:text-xl animate-in fade-in slide-in-from-bottom-6 duration-1000">
            Transform long, unwieldy links into clean, shareable URLs with just one click
          </p>
        </div>

        {/* URL Shortener Card */}
        <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <URLShortener />
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-20">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="p-6 rounded-xl border bg-card text-card-foreground hover:shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom-12"
              style={{ animationDelay: `${(index + 4) * 100}ms` }}
            >
              <div className="flex items-center gap-4 mb-2">
                {feature.icon}
                <h3 className="font-semibold text-lg">{feature.title}</h3>
              </div>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

const features = [
  {
    title: 'Quick & Easy',
    description: 'Shorten any URL instantly with our straightforward interface',
    icon: <Link2 className="h-5 w-5 text-primary" />,
  },
  {
    title: 'Analytics Ready',
    description: 'Track clicks and engagement with built-in analytics',
    icon: <Link2 className="h-5 w-5 text-primary" />,
  },
  {
    title: 'Secure Links',
    description: 'All shortened URLs are encrypted and secure by default',
    icon: <Link2 className="h-5 w-5 text-primary" />,
  },
];