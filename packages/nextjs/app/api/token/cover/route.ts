import { generateCover } from '~~/agents/cover-image';
import { TCoverInput } from '~~/types/api';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { description } = (await request.json()) as TCoverInput;

  return NextResponse.json(
    {
      imageBase64: await generateCover(description)
    },
    { status: 200 }
  );
}
