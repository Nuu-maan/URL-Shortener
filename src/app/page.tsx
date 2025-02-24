import { URLShortener } from '@/components/main/URLShortener';

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <div className="py-10">
        <h1 className="text-4xl font-bold text-center mb-8">
          Shorten Your URLs
        </h1>
        <URLShortener />
      </div>
    </main>
  );
}
