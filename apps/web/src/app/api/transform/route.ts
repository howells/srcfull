// apps/web/src/app/api/transform/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { resolve } from '@/lib/resolver';

const TransformRequestSchema = z.object({
  url: z.string().url(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url } = TransformRequestSchema.parse(body);

    const result = await resolve(url);

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid URL', code: 'INVALID_URL' },
        { status: 400 }
      );
    }

    console.error('Transform error:', error);
    return NextResponse.json(
      { error: 'Failed to transform URL', code: 'TRANSFORM_FAILED' },
      { status: 500 }
    );
  }
}
