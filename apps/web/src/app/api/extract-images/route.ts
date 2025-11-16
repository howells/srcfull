import { generateText } from 'ai';
import { z } from 'zod';
import { model, systemPrompt } from '@/lib/agent/config';
import { tools } from '@/lib/agent/tools';

const RequestSchema = z.object({
  url: z.string().url(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url } = RequestSchema.parse(body);

    const result = await generateText({
      model,
      system: systemPrompt,
      prompt: `Extract all main images from this URL: ${url}`,
      tools,
      maxSteps: 10,
    });

    // Parse the response to extract image URLs
    const text = result.text;

    // Try to extract URLs from the response
    const urlRegex = /https?:\/\/[^\s<>"{}|\\^`\[\]]+/g;
    const urls = text.match(urlRegex) || [];

    // Deduplicate
    const uniqueUrls = [...new Set(urls)];

    return Response.json({
      images: uniqueUrls,
      message: result.text,
    });
  } catch (error) {
    console.error('Extract images error:', error);

    if (error instanceof z.ZodError) {
      return Response.json(
        { error: 'Invalid request', details: error.issues },
        { status: 400 }
      );
    }

    return Response.json(
      { error: 'Failed to extract images' },
      { status: 500 }
    );
  }
}
