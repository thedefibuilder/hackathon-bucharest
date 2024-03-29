import { ChatPromptTemplate, HumanMessagePromptTemplate } from '@langchain/core/prompts';
import { env } from '~~/env';
import Jimp from 'jimp';
import { NextResponse } from 'next/server';

export function logoImageAgent() {
  const userMsg =
    'Given the following description, please generate me a logo image for my crypto token.' +
    'The logo should be prefferably round.' +
    'The generated image MUST not contain any text.' +
    'The background color should be white.' +
    'Description: {description}';

  return new ChatPromptTemplate({
    promptMessages: [HumanMessagePromptTemplate.fromTemplate(userMsg)],
    inputVariables: ['description']
  });
}

export async function generateLogo(description: string) {
  const prompt = await logoImageAgent().invoke({ description });

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

  image.resize(512, Jimp.AUTO);

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
