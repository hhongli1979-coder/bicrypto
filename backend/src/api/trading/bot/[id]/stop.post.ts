/**
 * Stop Trading Bot
 */

import { models } from '@b/db';
import { createError } from '@b/utils/error';
import { webhookService, WebhookEvent } from '@b/utils/webhook/notification';

export const metadata = {
  summary: 'Stop trading bot',
  operationId: 'stopTradingBot',
  tags: ['Trading', 'Bot'],
  requiresAuth: true,
  parameters: [
    {
      name: 'id',
      in: 'path',
      required: true,
      schema: { type: 'string' },
      description: 'Bot ID',
    },
  ],
  responses: {
    200: {
      description: 'Bot stopped successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' },
            },
          },
        },
      },
    },
  },
};

export default async (data) => {
  const { params, user } = data;
  const { id } = params;

  if (!user || !user.id) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    });
  }

  const bot = await models.tradingBot.findOne({
    where: { id, userId: user.id },
  });

  if (!bot) {
    throw createError({
      statusCode: 404,
      message: 'Bot not found',
    });
  }

  if (bot.status === 'STOPPED') {
    throw createError({
      statusCode: 400,
      message: 'Bot is already stopped',
    });
  }

  // Update bot status
  bot.status = 'STOPPED';
  await bot.save();

  // Release allocated funds
  const wallet = await models.wallet.findOne({
    where: { userId: user.id, currency: 'USDT', type: 'SPOT' },
  });

  if (wallet) {
    const allocation = parseFloat(bot.allocation);
    await models.wallet.update(
      {
        balance: parseFloat(wallet.balance.toString()) + allocation,
        inOrder: Math.max(0, parseFloat(wallet.inOrder?.toString() || '0') - allocation),
      },
      { where: { id: wallet.id } }
    );
  }

  // Send webhook notification
  await webhookService.sendWebhook(user.id, WebhookEvent.BOT_STOPPED, {
    botId: bot.id,
    name: bot.name,
    totalProfit: bot.totalProfit,
    totalTrades: bot.totalTrades,
  });

  return {
    success: true,
    message: 'Bot stopped successfully',
  };
};
