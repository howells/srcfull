import { ImageExtractor } from '@/components/image-extractor';

export default function HomePage() {
  return (
    <>
      {/* Background layers */}
      <div className="hex-grid" aria-hidden="true" />
      <div className="fixed inset-0 bg-gradient-radial pointer-events-none" aria-hidden="true" />

      <main className="relative z-10 min-h-screen px-6 py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <header className="text-center mb-16 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] text-xs text-[var(--text-tertiary)] mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
              AI-powered extraction
            </div>

            <h1
              className="text-5xl md:text-6xl lg:text-7xl font-normal mb-4 tracking-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              <span className="text-[var(--text-primary)]">Bee</span>
              <span className="text-[var(--accent)]">line</span>
            </h1>

            <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-md mx-auto leading-relaxed">
              Extract clean, full-resolution image URLs from any webpage.
              <span className="text-[var(--text-tertiary)]"> No CDN noise. Just the source.</span>
            </p>
          </header>

          {/* Main content */}
          <ImageExtractor />

          {/* Footer hint */}
          <footer className="mt-24 text-center">
            <p className="text-xs text-[var(--text-muted)]">
              Strips resizing parameters from Shopify, Cloudinary, Sanity, imgix & more
            </p>
          </footer>
        </div>
      </main>
    </>
  );
}
