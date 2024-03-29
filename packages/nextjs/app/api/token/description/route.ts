import { descriptionAgent } from '~~/agents/description';
import { Message, StreamingTextResponse } from 'ai';
import { NextRequest } from 'next/server';

export type TDescriptionInput = {
  messages: Message[];
};

export async function POST(request: NextRequest) {
  const { messages } = (await request.json()) as TDescriptionInput;
  const prompt = messages.at(-1)?.content;

  const description = await descriptionAgent().stream({ prompt });

  return new StreamingTextResponse(description);
}
