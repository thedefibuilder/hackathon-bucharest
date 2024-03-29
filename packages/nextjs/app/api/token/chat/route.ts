/* eslint-disable unicorn/switch-case-braces */
import { descriptionAgent } from '~~/agents/description';
import { roadmapAgent } from '~~/agents/roadmap';
import { tokenInputAgent, tokenInputSchema } from '~~/agents/token-input';
import { Message, StreamingTextResponse } from 'ai';
import { NextRequest, NextResponse } from 'next/server';

import { generateCover } from '../cover/route';
import { generateLogo } from '../logo/route';

export enum ESteps {
  DESCRIPTION,
  ROADMAP,
  LOGO,
  COVER,
  TOKEN_INPUTS
}

export type TChatInput = {
  messages: Message[];
  step: ESteps;
};

export async function POST(request: NextRequest) {
  const { messages, step } = (await request.json()) as TChatInput;

  const prompt = messages.at(-1)?.content!;
  switch (step) {
    case ESteps.DESCRIPTION:
      const description = await descriptionAgent().stream({ prompt });
      return new StreamingTextResponse(description);
    case ESteps.ROADMAP:
      const roadmap = await roadmapAgent().stream({ description: prompt });
      return new StreamingTextResponse(roadmap);
    case ESteps.LOGO:
      const logoImage = await generateLogo(prompt);
      return NextResponse.json({ imageBase64: logoImage }, { status: 200 });
    case ESteps.COVER:
      const coverImage = await generateCover(prompt);
      return NextResponse.json({ imageBase64: coverImage }, { status: 200 });
    case ESteps.TOKEN_INPUTS:
      const tokenInputsJson = await tokenInputAgent().invoke({ description: prompt });
      return NextResponse.json(tokenInputSchema.parse(tokenInputsJson), { status: 200 });
    default:
      return NextResponse.json({ error: 'Invalid step' }, { status: 400 });
  }
}
