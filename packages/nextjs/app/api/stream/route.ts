import fs from 'node:fs';

import FormData from 'form-data';
import { NextRequest, NextResponse } from 'next/server';
import fetch from 'node-fetch';

type TStreamInput = {
  csv: string;
};

export async function POST(request: NextRequest) {
  const { csv } = (await request.json()) as TStreamInput;

  fs.writeFileSync('test.csv', csv, 'utf-8');

  const formData = new FormData();
  formData.append('data', fs.createReadStream('test.csv'));

  const response = await fetch('https://v2-services.vercel.app/api/create?decimals=18', {
    method: 'POST',
    body: formData,
    headers: formData.getHeaders()
  });

  await fs.promises.rm('test.csv');

  const result = await response.json();
  return NextResponse.json(result, { status: 200 });
}
