import { ChatPromptTemplate, HumanMessagePromptTemplate } from '@langchain/core/prompts';
import { env } from '~~/env';
import Jimp from 'jimp';
import { NextResponse } from 'next/server';

export function coverImageAgent() {
  const userMsg =
    'Given the following crypto token description, please generate me a cover image for the launchpad landing page.' +
    'The image should not contain any text, and should be visually appealing to the users eye.' +
    'Description: {description}';

  return new ChatPromptTemplate({
    promptMessages: [HumanMessagePromptTemplate.fromTemplate(userMsg)],
    inputVariables: ['description']
  });
}

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
  image.resize(1024, 1024);

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
