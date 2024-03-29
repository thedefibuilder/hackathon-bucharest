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
    const user = await db.user.findFirst({
      where: {
        walletAddress: {
          equals: walletAddress
        }
      }
    });

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

      if (!user) {
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
                    logo: logo.split(',')[1] as unknown as Buffer,
                    cover: cover.split(',')[1] as unknown as Buffer,
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

        return NextResponse.json({ status: 201 });
      }

      await db.deployment.create({
        data: {
          chainId,
          contractAddress,
          template,
          userId: user.id,
          token: {
            create: {
              name,
              symbol,
              maxSupply: Number(maxSupply),
              premintAmount: Number(premintAmount),
              burnable,
              logo: logo.split(',')[1] as unknown as Buffer,
              cover: cover.split(',')[1] as unknown as Buffer,
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
      });

      return NextResponse.json({ status: 201 });
    } else {
      if (!user) {
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

        return NextResponse.json({ status: 201 });
      }

      await db.deployment.create({
        data: {
          chainId,
          contractAddress,
          template,
          userId: user.id
        }
      });

      return NextResponse.json({ status: 201 });
    }
  } catch (error: unknown) {
    console.error('ERROR INSERTING TOKEN INTO DB', error);
    return NextResponse.json({ status: 400 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const walletAddress = searchParams.get('wallet-address');

  if (!walletAddress) {
    return NextResponse.json({ errorMessage: 'Please provide Wallet Address.' }, { status: 400 });
  }

  console.log('WA', walletAddress);

  const user = await db.user.findFirst({
    where: {
      walletAddress: {
        equals: walletAddress
      }
    }
  });

  if (!user) {
    return NextResponse.json(
      { errorMessage: 'User not found, first you need to deploy an ERC20 Token.' },
      { status: 404 }
    );
  }
  console.log('user', user);

  const deployments = await db.deployment.findMany({
    where: {
      userId: {
        equals: user.id
      }
    },
    include: {
      token: true
    }
  });

  console.log('deployments', deployments);

  return NextResponse.json({ ...deployments }, { status: 200 });
}
