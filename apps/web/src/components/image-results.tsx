'use client';

interface ImageResultsProps {
  images: string[];
}

export function ImageResults({ images }: ImageResultsProps) {
  if (images.length === 0) {
    return null;
  }

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
  };

  return (
    <div className="w-full max-w-2xl mt-8">
      <h2 className="text-xl font-semibold mb-4">
        Found {images.length} {images.length === 1 ? 'image' : 'images'}
      </h2>
      <div className="space-y-2">
        {images.map((url, index) => (
          <div
            key={index}
            className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <code className="flex-1 text-sm text-gray-700 break-all">
              {url}
            </code>
            <button
              onClick={() => copyToClipboard(url)}
              className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded transition-colors"
              title="Copy to clipboard"
            >
              Copy
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
