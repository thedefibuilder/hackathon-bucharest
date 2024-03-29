import { tokenInputAgent, tokenInputSchema } from '~~/agents/token-input';
import { TTokenInput } from '~~/types/api';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { description } = (await request.json()) as TTokenInput;

  const tokenInputsJson = await tokenInputAgent().invoke({ description });
  const tokenInput = tokenInputSchema.parse(tokenInputsJson);
  return NextResponse.json(tokenInput);
}
