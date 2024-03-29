import { coverImageAgent } from '~~/agents/cover-image';
import { env } from '~~/env';
import Jimp from 'jimp';
import { NextRequest, NextResponse } from 'next/server';

export type TCoverInput = {
  description: string;
};

export async function generateCover(description: string) {
  const prompt = await coverImageAgent().invoke({ description });
  const visionResponse = await fetch(
    'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0',
    {
      headers: { Authorization: `Bearer ${env.HF_API_KEY}` },
      method: 'POST',
      body: prompt.messages[0].content as string
    }
  );
  if (!visionResponse.ok) {
    return NextResponse.json(new Error('Failed to fetch vision API'), {
      status: visionResponse.status
    });
  }

  const blob = await visionResponse.blob();
  const buffer = Buffer.from(await blob.arrayBuffer());
  const image = await Jimp.read(buffer);
  image.resize(1024, 576);

  // Convert the image to a base64 string and crop the prefix
  const base64String = await new Promise<string>((resolve, reject) => {
    image.getBase64(Jimp.AUTO, (err: any, data: string) => {
      if (err) {
        reject(err);
      } else {
        const base64Data = data.split(',')[1];
        resolve(base64Data);
      }
    });
  });

  return 'data:image/jpeg;base64,' + base64String;
}

export async function POST(request: NextRequest) {
  const { description } = (await request.json()) as TCoverInput;

  return NextResponse.json(
    {
      imageBase64: await generateCover(description)
    },
    { status: 200 }
  );
}
