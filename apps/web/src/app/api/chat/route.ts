import { streamText } from 'ai';
import { z } from 'zod';
import { model, systemPrompt } from '@/lib/agent/config';
import { tools } from '@/lib/agent/tools';
import { extractImagesFromUrl } from '@/lib/server/extract-images';

const ChatRequestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })),
});

export async function POST(request: Request) {
  console.log('POST /api/chat - Starting streamText');
  console.log('Environment check:', {
    hasOpenRouterKey: !!process.env.OPENROUTER_API_KEY,
    hasScrapingBeeKey: !!process.env.SCRAPINGBEE_API_KEY,
  });

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

    // Run server-side extraction (scrape + extract + analyze)
    // This avoids sending large HTML to the AI model
    const extractionResult = await extractImagesFromUrl(targetUrl);

    if (!extractionResult.success || !extractionResult.candidates) {
      return Response.json(
        { error: extractionResult.error || 'Failed to extract images' },
        { status: 500 }
      );
    }

    // Limit to first 10 candidates for more reliable processing
    const candidates = extractionResult.candidates.slice(0, 10);
    console.log(`Found ${extractionResult.candidates.length} candidates, using first ${candidates.length}`);

    // Create a modified prompt with just the candidates (small payload)
    // Agent will use tools to resolve clean URLs
    const agentPrompt = `I have extracted ${candidates.length} main image candidates from ${targetUrl}.

Image candidates:
${candidates.map((c, i) => `${i + 1}. ${c.url}${c.srcset ? ` (srcset: ${c.srcset.join(', ')})` : ''}`).join('\n')}

TASK: Process ALL ${candidates.length} images above. For EACH image:
1. Use matchKnownPatterns to check for CDN patterns
2. Use findSourceUrl to generate clean candidates
3. Use validateImageUrl to verify the URL works
4. Use learnPattern when you find a working clean URL

After validating ALL images, return ONLY the validated URLs, one per line, with NO other text.`;

    console.log('Starting streamText with tools:', Object.keys(tools));

    const result = await streamText({
      model,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: agentPrompt,
        },
      ],
      tools,
      maxSteps: 50, // Increased to allow agent to process all images and complete final response
      onStepFinish: (step) => {
        console.log('Step finished:', {
          stepType: step.stepType,
          toolCalls: step.toolCalls?.length || 0,
          toolResults: step.toolResults?.length || 0,
        });

        // Log any tool errors
        if (step.toolResults) {
          step.toolResults.forEach((result, idx) => {
            if ('error' in result && result.error) {
              console.error(`Tool result ${idx} error:`, result.error);
            }
          });
        }
      },
      onFinish: (result) => {
        console.log('Stream finished:', {
          finishReason: result.finishReason,
          usage: result.usage,
          text: result.text?.substring(0, 200),
        });
      },
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);
    console.error('Stream error:', { error });

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
