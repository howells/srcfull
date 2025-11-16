import { streamText } from 'ai';
import { model, systemPrompt } from '@/lib/agent/config';
import { tools } from '@/lib/agent/tools';

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

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
    return Response.json(
      { error: 'Failed to process chat' },
      { status: 500 }
    );
  }
}
