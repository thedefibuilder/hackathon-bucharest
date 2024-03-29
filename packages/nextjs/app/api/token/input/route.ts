import { tokenInputAgent, tokenInputSchema } from '~~/agents/token-input';
import { NextRequest, NextResponse } from 'next/server';

export type TTokenInput = {
  description: string;
};

export async function POST(request: NextRequest) {
  const { description } = (await request.json()) as TTokenInput;

  const tokenInputsJson = await tokenInputAgent().invoke({ description });
  const tokenInput = tokenInputSchema.parse(tokenInputsJson);
  return NextResponse.json(tokenInput);
}
