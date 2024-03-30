/* eslint-disable unicorn/switch-case-braces */
import fs from 'node:fs';
import path from 'node:path';

import lighthouse from '@lighthouse-web3/sdk';
import { generateCover } from '~~/agents/cover-image';
import { descriptionAgent } from '~~/agents/description';
import { generateLogo } from '~~/agents/logo-image';
import { roadmapAgent } from '~~/agents/roadmap';
import { tokenInputAgent, tokenInputSchema } from '~~/agents/token-input';
import { env } from '~~/env';
import { ESteps, TChatInput } from '~~/types/api';
import { StreamingTextResponse } from 'ai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { messages, step } = (await request.json()) as TChatInput;

  const prompt = messages.at(-1)?.content!;
  const tokenDescription = messages.at(1)?.content!;
  switch (step) {
    case ESteps.DESCRIPTION:
      const description = await descriptionAgent().stream({ prompt });
      return new StreamingTextResponse(description);
    case ESteps.ROADMAP:
      const roadmap = await roadmapAgent().stream({
        description: prompt + `Token Description: ${tokenDescription}`
      });
      return new StreamingTextResponse(roadmap);
    case ESteps.LOGO: {
      const logoImage = await generateLogo(prompt + ` ${tokenDescription}`);
      const jsonString = JSON.stringify({ imageBase64: logoImage });
      const filePath = path.join(process.cwd(), 'temporary-logo.json');

      await fs.promises.writeFile(filePath, jsonString);
      const filecoinResponse = await lighthouse.upload(filePath, env.LIGHTHOUSE_API_KEY);
      await fs.promises.rm(filePath);
      const imageURI = 'https://gateway.lighthouse.storage/ipfs/' + filecoinResponse.data.Hash;

      return NextResponse.json({ imageURI: imageURI }, { status: 200 });
    }

    case ESteps.COVER: {
      const coverImage = await generateCover(prompt + ` ${tokenDescription}`);
      const jsonString = JSON.stringify({ imageBase64: coverImage });
      const filePath = path.join(process.cwd(), 'temporary-cover.json');
      await fs.promises.writeFile(filePath, jsonString);
      const filecoinResponse = await lighthouse.upload(filePath, env.LIGHTHOUSE_API_KEY);
      await fs.promises.rm(filePath);
      const imageURI = 'https://gateway.lighthouse.storage/ipfs/' + filecoinResponse.data.Hash;

      return NextResponse.json({ imageURI: imageURI }, { status: 200 });
    }

    case ESteps.TOKEN_INPUTS:
      const tokenInputsJson = await tokenInputAgent().invoke({
        description: prompt + ` ${tokenDescription}`
      });
      return NextResponse.json(tokenInputSchema.parse(tokenInputsJson), { status: 200 });
    default:
      return NextResponse.json({ error: 'Invalid step' }, { status: 400 });
  }
}
