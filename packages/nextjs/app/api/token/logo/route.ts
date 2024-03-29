import { generateLogo } from '~~/agents/logo-image';
import { TLogoInput } from '~~/types/api';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { description } = (await request.json()) as TLogoInput;

  return NextResponse.json(
    {
      imageBase64: await generateLogo(description)
    },
    { status: 200 }
  );
}
