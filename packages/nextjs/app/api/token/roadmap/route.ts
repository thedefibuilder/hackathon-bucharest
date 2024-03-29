import { roadmapAgent } from '~~/agents/roadmap';
import { StreamingTextResponse } from 'ai';
import { NextRequest } from 'next/server';

export type TRoadmapInput = {
  description: string;
};

export async function POST(request: NextRequest) {
  const { description } = (await request.json()) as TRoadmapInput;
  const roadmap = await roadmapAgent().stream({ description });
  return new StreamingTextResponse(roadmap);
}
