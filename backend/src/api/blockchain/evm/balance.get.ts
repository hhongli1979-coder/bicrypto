import { evmMultiChainService } from '@b/utils/blockchain/evm-multi-chain';

export const metadata = {
  summary: 'Get EVM wallet balance',
  operationId: 'getEVMBalance',
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
    {
      name: 'address',
      in: 'query',
      required: true,
      schema: { type: 'string' },
      description: 'Wallet address',
    },
    {
      name: 'tokenAddress',
      in: 'query',
      required: false,
      schema: { type: 'string' },
      description: 'ERC20 token contract address (optional)',
    },
  ],
  responses: {
    200: {
      description: 'Balance retrieved successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              chain: { type: 'string' },
              address: { type: 'string' },
              balance: { type: 'string' },
              tokenAddress: { type: 'string' },
            },
          },
        },
      },
    },
  },
};

export default async (data) => {
  const { query } = data;
  const { chain, address, tokenAddress } = query;

  const balance = await evmMultiChainService.getBalance(chain, address, tokenAddress);

  return {
    chain,
    address,
    balance,
    tokenAddress: tokenAddress || 'native',
  };
};
