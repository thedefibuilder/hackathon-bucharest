import { descriptionAgent } from '~~/agents/description';
import { TDescriptionInput } from '~~/types/api';
import { StreamingTextResponse } from 'ai';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const { prompt } = (await request.json()) as TDescriptionInput;

  const description = await descriptionAgent().stream({ prompt });

  return new StreamingTextResponse(description);
}
