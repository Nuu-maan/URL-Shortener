import { Analytics } from "@/components/analytics/analytics"

export default function AnalyticsPage() {
  return (
    <main className="container mx-auto p-4">
      <div className="py-10">
        <h1 className="text-4xl font-bold text-center mb-8">
          Analytics Dashboard
        </h1>
        <Analytics />
      </div>
    </main>
  )
}
