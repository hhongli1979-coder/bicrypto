/**
 * Get Trading Bots List
 */

import { models } from '@b/db';
import { createError } from '@b/utils/error';

export const metadata = {
  summary: 'Get user trading bots',
  operationId: 'getTradingBots',
  tags: ['Trading', 'Bot'],
  requiresAuth: true,
  parameters: [
    {
      name: 'status',
      in: 'query',
      required: false,
      schema: {
        type: 'string',
        enum: ['ACTIVE', 'PAUSED', 'STOPPED', 'ERROR'],
      },
      description: 'Filter by bot status',
    },
  ],
  responses: {
    200: {
      description: 'Bots retrieved successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              bots: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    strategy: { type: 'string' },
                    symbol: { type: 'string' },
                    allocation: { type: 'string' },
                    status: { type: 'string' },
                    totalProfit: { type: 'string' },
                    totalTrades: { type: 'number' },
                    winRate: { type: 'number' },
                    lastExecutedAt: { type: 'string' },
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
  const { query, user } = data;
  const { status } = query;

  if (!user || !user.id) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    });
  }

  const whereClause: any = { userId: user.id };
  if (status) {
    whereClause.status = status;
  }

  const bots = await models.tradingBot.findAll({
    where: whereClause,
    order: [['createdAt', 'DESC']],
  });

  return {
    bots: bots.map(bot => ({
      id: bot.id,
      name: bot.name,
      strategy: bot.strategy,
      symbol: bot.symbol,
      allocation: bot.allocation,
      status: bot.status,
      totalProfit: bot.totalProfit,
      totalTrades: bot.totalTrades,
      winRate: bot.winRate,
      lastExecutedAt: bot.lastExecutedAt,
      createdAt: bot.createdAt,
    })),
  };
};
