import { descriptionAgent } from '~~/agents/description';
import { NextRequest, NextResponse } from 'next/server';

export type TDescriptionInput = {
  prompt: string;
};

export async function POST(request: NextRequest) {
  const { prompt } = (await request.json()) as TDescriptionInput;

  const description = await descriptionAgent().invoke({ prompt });

  return NextResponse.json({ description }, { status: 200 });
}
