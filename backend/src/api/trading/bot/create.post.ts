/**
 * Create Trading Bot API
 */

import { models } from '@b/db';
import { createError } from '@b/utils/error';
import { webhookService, WebhookEvent } from '@b/utils/webhook/notification';

export const metadata = {
  summary: 'Create trading bot',
  operationId: 'createTradingBot',
  tags: ['Trading', 'Bot'],
  requiresAuth: true,
  requestBody: {
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          required: ['name', 'strategy', 'symbol', 'allocation'],
          properties: {
            name: { 
              type: 'string',
              description: 'Bot name',
            },
            strategy: { 
              type: 'string', 
              enum: ['GRID', 'DCA', 'ARBITRAGE', 'MARKET_MAKING'],
              description: 'Trading strategy',
            },
            symbol: { 
              type: 'string', 
              example: 'BTC/USDT',
              description: 'Trading pair',
            },
            allocation: { 
              type: 'number',
              description: 'Amount to allocate (USDT)',
            },
            config: {
              type: 'object',
              description: 'Strategy configuration',
              properties: {
                gridLevels: { type: 'number', description: 'Number of grid levels' },
                priceRange: { 
                  type: 'object',
                  properties: {
                    min: { type: 'number' },
                    max: { type: 'number' },
                  },
                },
                stopLoss: { type: 'number', description: 'Stop loss percentage' },
                takeProfit: { type: 'number', description: 'Take profit percentage' },
                interval: { type: 'string', description: 'DCA interval (daily, weekly)' },
              },
            },
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Bot created successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              bot: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  strategy: { type: 'string' },
                  status: { type: 'string' },
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
  const { name, strategy, symbol, allocation, config } = body;

  if (!user || !user.id) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    });
  }

  // Check user balance
  const wallet = await models.wallet.findOne({
    where: { userId: user.id, currency: 'USDT', type: 'SPOT' },
  });

  if (!wallet || parseFloat(wallet.balance.toString()) < allocation) {
    throw createError({
      statusCode: 400,
      message: 'Insufficient balance',
    });
  }

  // Create trading bot
  const bot = await models.tradingBot.create({
    userId: user.id,
    name,
    strategy,
    symbol,
    allocation: allocation.toString(),
    config: config ? JSON.stringify(config) : null,
    status: 'ACTIVE',
    totalProfit: '0',
    totalTrades: 0,
    winRate: 0,
  });

  // Freeze allocated funds
  await models.wallet.update(
    {
      balance: parseFloat(wallet.balance.toString()) - allocation,
      inOrder: (parseFloat(wallet.inOrder?.toString() || '0') + allocation),
    },
    { where: { id: wallet.id } }
  );

  // Send webhook notification
  await webhookService.sendWebhook(user.id, WebhookEvent.BOT_STARTED, {
    botId: bot.id,
    name: bot.name,
    strategy: bot.strategy,
    allocation: bot.allocation,
  });

  return {
    success: true,
    bot: {
      id: bot.id,
      name: bot.name,
      strategy: bot.strategy,
      status: bot.status,
      symbol: bot.symbol,
      allocation: bot.allocation,
    },
  };
};
