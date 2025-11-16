import { streamText } from 'ai';
import { z } from 'zod';
import { model, systemPrompt } from '@/lib/agent/config';
import { tools } from '@/lib/agent/tools';

const ChatRequestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messages } = ChatRequestSchema.parse(body);

    const result = streamText({
      model,
      system: systemPrompt,
      messages,
      tools,
      maxSteps: 10,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Chat error:', error);

    if (error instanceof z.ZodError) {
      return Response.json(
        { error: 'Invalid request', details: error.issues },
        { status: 400 }
      );
    }

    return Response.json(
      { error: 'Failed to process chat' },
      { status: 500 }
    );
  }
}
