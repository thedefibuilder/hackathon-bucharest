import { coverImageAgent } from '~~/agents/cover-image';
import { env } from '~~/env';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export type TCoverInput = {
  description: string;
};

export async function POST(request: NextRequest) {
  const { description } = (await request.json()) as TCoverInput;

  const openai = new OpenAI({
    apiKey: env.OPENAI_API_KEY
  });

  const prompt = await coverImageAgent().invoke({ description });

  const visionResponse = await openai.images.generate({
    model: 'dall-e-3',
    prompt: prompt.messages[0].content as string,
    n: 1,
    size: '1792x1024',
    response_format: 'b64_json',
    quality: 'standard',
    style: 'natural'
  });

  return NextResponse.json(
    {
      imageBase64: visionResponse.data[0].b64_json
    },
    { status: 200 }
  );
}
