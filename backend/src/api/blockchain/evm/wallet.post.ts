import { evmMultiChainService } from '@b/utils/blockchain/evm-multi-chain';
import { createError } from '@b/utils/error';

export const metadata = {
  summary: 'Create EVM wallet',
  operationId: 'createEVMWallet',
  tags: ['Blockchain', 'EVM'],
  requiresAuth: true,
  requestBody: {
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          required: ['chain'],
          properties: {
            chain: {
              type: 'string',
              enum: ['BSC', 'BSC_TESTNET', 'POLYGON', 'AVALANCHE'],
              description: 'EVM compatible blockchain',
            },
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Wallet created successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              wallet: {
                type: 'object',
                properties: {
                  address: { type: 'string' },
                  chain: { type: 'string' },
                  userId: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
  },
};

export default async (data) => {
  const { body, user } = data;
  const { chain } = body;

  if (!user || !user.id) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    });
  }

  const wallet = await evmMultiChainService.createWallet(chain, user.id);

  return {
    success: true,
    wallet,
  };
};
