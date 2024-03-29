import type { NextRequest } from 'next/server';

import { db } from '~~/lib/db';
import { NextResponse } from 'next/server';

export const maxDuration = 300;
export const dynamic = 'force-dynamic';

const notAnounced = 'N / A';

enum ETemplate {
  token = 'TOKEN',
  airstream = 'AIRSTREAM',
  presale = 'PRESALE'
}

export type TInsertToken = {
  walletAddress: string;
  deployment: {
    chainId: number;
    contractAddress: string;
    template: ETemplate;
  };
  token: {
    name: string;
    symbol: string;
    maxSupply: number;
    premintAmount: number;
    burnable: boolean;
    logo: string;
    cover: string;
    description: string;
    roadmap: string;
    socialLinks: {
      website: string | null;
      twitter: string | null;
      telegram: string | null;
      discord: string | null;
    };
  } | null;
};

export async function POST(request: NextRequest) {
  const { walletAddress, deployment, token } = (await request.json()) as TInsertToken;

  const { chainId, contractAddress, template } = deployment;

  try {
    if (token) {
      const {
        name,
        symbol,
        maxSupply,
        premintAmount,
        burnable,
        logo,
        cover,
        description,
        roadmap,
        socialLinks
      } = token;

      await db.user.create({
        data: {
          walletAddress,
          deployments: {
            create: {
              chainId,
              contractAddress,
              template,
              token: {
                create: {
                  name,
                  symbol,
                  maxSupply: Number(maxSupply),
                  premintAmount: Number(premintAmount),
                  burnable,
                  logo: logo as unknown as Buffer,
                  cover: cover as unknown as Buffer,
                  description,
                  roadmap,
                  socialLinks: {
                    create: {
                      website: socialLinks?.website ?? notAnounced,
                      twitter: socialLinks?.twitter ?? notAnounced,
                      telegram: socialLinks?.telegram ?? notAnounced,
                      discord: socialLinks?.discord ?? notAnounced
                    }
                  }
                }
              }
            }
          }
        }
      });
    } else {
      await db.user.create({
        data: {
          walletAddress,
          deployments: {
            create: {
              chainId,
              contractAddress,
              template
            }
          }
        }
      });
    }

    return NextResponse.json({ status: 200 });
  } catch (error: unknown) {
    console.error('ERROR INSERTING TOKEN INTO DB', error);
    return NextResponse.json({ status: 400 });
  }
}
