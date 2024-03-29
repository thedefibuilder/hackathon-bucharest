import { roadmapAgent } from '~~/agents/roadmap';
import { NextRequest, NextResponse } from 'next/server';

export type TRoadmapInput = {
  description: string;
};

export async function POST(request: NextRequest) {
  const { description } = await request.json();

  const roadmap = await roadmapAgent().invoke({ description });

  return NextResponse.json({ roadmap }, { status: 200 });
}
