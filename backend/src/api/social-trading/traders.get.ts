/**
 * Get Available Traders List
 */

import { models } from '@b/db';

export const metadata = {
  summary: 'Get available traders',
  operationId: 'getTraders',
  tags: ['Social Trading'],
  requiresAuth: true,
  parameters: [
    {
      name: 'sortBy',
      in: 'query',
      required: false,
      schema: {
        type: 'string',
        enum: ['profit', 'winRate', 'followers', 'trades'],
      },
      description: 'Sort traders by field',
    },
    {
      name: 'limit',
      in: 'query',
      required: false,
      schema: {
        type: 'number',
        default: 20,
      },
      description: 'Number of traders to return',
    },
  ],
  responses: {
    200: {
      description: 'Traders retrieved successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              traders: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    userId: { type: 'string' },
                    name: { type: 'string' },
                    bio: { type: 'string' },
                    totalFollowers: { type: 'number' },
                    totalProfit: { type: 'string' },
                    totalTrades: { type: 'number' },
                    winRate: { type: 'number' },
                    riskScore: { type: 'number' },
                  },
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
  const { query } = data;
  const { sortBy = 'profit', limit = 20 } = query;

  // Build order clause
  let orderClause: any[] = [['createdAt', 'DESC']];
  
  switch (sortBy) {
    case 'profit':
      orderClause = [['totalProfit', 'DESC']];
      break;
    case 'winRate':
      orderClause = [['winRate', 'DESC']];
      break;
    case 'followers':
      orderClause = [['totalFollowers', 'DESC']];
      break;
    case 'trades':
      orderClause = [['totalTrades', 'DESC']];
      break;
  }

  const traders = await models.trader.findAll({
    where: { isPublic: true },
    order: orderClause,
    limit: parseInt(limit.toString()),
  });

  return {
    traders: traders.map(trader => ({
      id: trader.id,
      userId: trader.userId,
      name: trader.name,
      bio: trader.bio,
      totalFollowers: trader.totalFollowers,
      totalProfit: trader.totalProfit,
      totalTrades: trader.totalTrades,
      winRate: trader.winRate,
      riskScore: trader.riskScore,
    })),
  };
};
