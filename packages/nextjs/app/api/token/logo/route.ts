import { logoImageAgent } from '~~/agents/logo-image';
import { env } from '~~/env';
import Jimp from 'jimp';
import { NextRequest, NextResponse } from 'next/server';

export type TLogoInput = {
  description: string;
};

export async function POST(request: NextRequest) {
  const { description } = (await request.json()) as TLogoInput;
  const prompt = await logoImageAgent().invoke({ description });

  const visionResponse = await fetch(
    'https://api-inference.huggingface.co/models/playgroundai/playground-v2.5-1024px-aesthetic',
    {
      headers: { Authorization: `Bearer ${env.HF_API_KEY}` },
      method: 'POST',
      body: prompt.messages[0].content as string
    }
  );

  if (!visionResponse.ok) {
    throw new Error('Failed to fetch image from Hugging Face API');
  }

  const buffer = Buffer.from(await visionResponse.arrayBuffer());

  const image = await Jimp.read(buffer);

  image.resize(256, Jimp.AUTO);

  // Convert the image to a base64 string and crop the prefix
  const base64String = await new Promise<string>((resolve, reject) => {
    image.getBase64(Jimp.MIME_PNG, (err: any, data: string) => {
      if (err) {
        reject(err);
      } else {
        // Remove the MIME type prefix (e.g., "data:image/png;base64,") from the base64 string
        const base64Data = data.split(',')[1];
        resolve(base64Data);
      }
    });
  });
  return NextResponse.json(
    {
      imageBase64: base64String
    },
    { status: 200 }
  );
}
