import { evmMultiChainService } from '@b/utils/blockchain/evm-multi-chain';

export const metadata = {
  summary: 'Get optimal gas price',
  operationId: 'getGasPrice',
  tags: ['Blockchain', 'EVM'],
  requiresAuth: true,
  parameters: [
    {
      name: 'chain',
      in: 'query',
      required: true,
      schema: { 
        type: 'string', 
        enum: ['BSC', 'BSC_TESTNET', 'POLYGON', 'AVALANCHE'] 
      },
      description: 'EVM compatible blockchain',
    },
  ],
  responses: {
    200: {
      description: 'Gas price retrieved successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              chain: { type: 'string' },
              gasPrice: { type: 'string', description: 'Gas price in Gwei' },
            },
          },
        },
      },
    },
  },
};

export default async (data) => {
  const { query } = data;
  const { chain } = query;

  const gasPrice = await evmMultiChainService.getOptimalGasPrice(chain);

  return {
    chain,
    gasPrice,
  };
};
