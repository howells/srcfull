import { z } from 'zod';
import { extractImagesFromUrl } from '@/lib/server/extract-images';

const ChatRequestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })),
});

export async function POST(request: Request) {
  console.log('POST /api/chat - Starting extraction');

  try {
    const body = await request.json();
    const { messages } = ChatRequestSchema.parse(body);

    // Extract URL from the user's message
    const lastUserMessage = messages.filter(m => m.role === 'user').pop();
    const urlMatch = lastUserMessage?.content.match(/https?:\/\/[^\s]+/);

    if (!urlMatch) {
      return Response.json(
        { error: 'No URL found in message' },
        { status: 400 }
      );
    }

    const targetUrl = urlMatch[0];
    console.log('Extracting images from:', targetUrl);

    // Run server-side extraction (full pipeline)
    const result = await extractImagesFromUrl(targetUrl);

    if (!result.success) {
      return Response.json(
        { error: result.error || 'Failed to extract images' },
        { status: 500 }
      );
    }

    const images = result.images || [];
    console.log(`Returning ${images.length} validated images`);

    // Return in a format the UI can parse
    // The UI looks for URLs in the assistant message content
    return Response.json({
      role: 'assistant',
      content: images.length > 0
        ? images.join('\n')
        : 'No images found on this page.',
      images,
    });
  } catch (error) {
    console.error('Chat API error:', error);

    if (error instanceof z.ZodError) {
      return Response.json(
        { error: 'Invalid request', details: error.issues },
        { status: 400 }
      );
    }

    return Response.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
