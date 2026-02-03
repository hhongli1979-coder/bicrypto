/**
 * Social Trading - Follow a Trader
 */

import { models } from '@b/db';
import { createError } from '@b/utils/error';
import { webhookService, WebhookEvent } from '@b/utils/webhook/notification';

export const metadata = {
  summary: 'Follow a trader',
  operationId: 'followTrader',
  tags: ['Social Trading'],
  requiresAuth: true,
  requestBody: {
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          required: ['traderId', 'allocation', 'copyRatio'],
          properties: {
            traderId: { 
              type: 'string',
              description: 'Trader user ID',
            },
            allocation: { 
              type: 'number',
              description: 'Amount to allocate for copying (USDT)',
            },
            copyRatio: { 
              type: 'number',
              description: 'Copy ratio (0.1 - 1.0)',
              minimum: 0.1,
              maximum: 1.0,
              example: 0.5,
            },
            stopLoss: { 
              type: 'number',
              description: 'Stop loss percentage',
              example: 10,
            },
            maxDailyLoss: { 
              type: 'number',
              description: 'Max daily loss percentage',
              example: 5,
            },
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Successfully following trader',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              copyTrade: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  traderId: { type: 'string' },
                  traderName: { type: 'string' },
                  allocation: { type: 'string' },
                  copyRatio: { type: 'number' },
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
  const { traderId, allocation, copyRatio, stopLoss, maxDailyLoss } = body;

  if (!user || !user.id) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    });
  }

  // Check if trader exists and is public
  const trader = await models.trader.findOne({
    where: { userId: traderId },
  });

  if (!trader || !trader.isPublic) {
    throw createError({
      statusCode: 404,
      message: 'Trader not found or not available for copying',
    });
  }

  // Check user balance
  const wallet = await models.wallet.findOne({
    where: { userId: user.id, currency: 'USDT', type: 'COPY_TRADING' },
  });

  if (!wallet || parseFloat(wallet.balance.toString()) < allocation) {
    throw createError({
      statusCode: 400,
      message: 'Insufficient balance in copy trading wallet',
    });
  }

  // Check if already following
  const existingCopyTrade = await models.copyTrade.findOne({
    where: {
      followerId: user.id,
      traderId,
      status: 'ACTIVE',
    },
  });

  if (existingCopyTrade) {
    throw createError({
      statusCode: 400,
      message: 'Already following this trader',
    });
  }

  // Create copy trade relationship
  const copyTrade = await models.copyTrade.create({
    followerId: user.id,
    traderId,
    allocation: allocation.toString(),
    copyRatio,
    stopLoss,
    maxDailyLoss,
    status: 'ACTIVE',
    totalProfit: '0',
    totalCopied: 0,
  });

  // Freeze allocated funds
  await models.wallet.update(
    {
      balance: parseFloat(wallet.balance.toString()) - allocation,
      inOrder: (parseFloat(wallet.inOrder?.toString() || '0') + allocation),
    },
    { where: { id: wallet.id } }
  );

  // Update trader follower count
  await models.trader.update(
    { totalFollowers: trader.totalFollowers + 1 },
    { where: { id: trader.id } }
  );

  // Get trader user info
  const traderUser = await models.user.findByPk(traderId);
  
  // Format trader name safely
  const traderName = traderUser
    ? `${traderUser.firstName || ''} ${traderUser.lastName || ''}`.trim() || 'Unknown'
    : 'Unknown';

  // Send webhook notification
  await webhookService.sendWebhook(user.id, WebhookEvent.COPY_TRADE_OPENED, {
    copyTradeId: copyTrade.id,
    traderId,
    traderName,
    allocation,
    copyRatio,
  });

  return {
    success: true,
    copyTrade: {
      id: copyTrade.id,
      traderId: trader.userId,
      traderName: trader.name,
      allocation: copyTrade.allocation,
      copyRatio: copyTrade.copyRatio,
      status: copyTrade.status,
    },
  };
};
