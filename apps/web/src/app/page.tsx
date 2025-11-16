import { ImageExtractor } from '@/components/image-extractor';

export default function HomePage() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">Beeline</h1>
          <p className="text-gray-600">
            AI-powered image extractor - get clean, full-resolution source URLs
          </p>
        </div>

        <ImageExtractor />
      </div>
    </main>
  );
}
