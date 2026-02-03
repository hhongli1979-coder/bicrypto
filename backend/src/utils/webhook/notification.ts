/**
 * Webhook Notification Service
 * Real-time event notifications with retry mechanism
 */

import axios from 'axios';
import * as crypto from 'crypto';
import { models } from '@b/db';
import { logger } from '@b/utils/console';

interface WebhookPayload {
  event: string;
  data: any;
  timestamp: number;
  signature: string;
}

// Webhook event types
export enum WebhookEvent {
  DEPOSIT_COMPLETED = 'deposit.completed',
  WITHDRAW_COMPLETED = 'withdraw.completed',
  TRADE_EXECUTED = 'trade.executed',
  ORDER_FILLED = 'order.filled',
  KYC_APPROVED = 'kyc.approved',
  BALANCE_UPDATED = 'balance.updated',
  BOT_STARTED = 'bot.started',
  BOT_STOPPED = 'bot.stopped',
  COPY_TRADE_OPENED = 'copy_trade.opened',
  COPY_TRADE_CLOSED = 'copy_trade.closed',
}

export class WebhookService {
  private readonly maxRetries = 3;
  private readonly timeout = 5000;

  /**
   * Send webhook notification
   */
  async sendWebhook(userId: string, event: string, data: any, attempt: number = 0) {
    try {
      // Get user's webhook configuration
      const webhookConfig = await models.webhookConfig.findOne({
        where: { userId, isActive: true },
      });

      if (!webhookConfig || !webhookConfig.url) {
        logger.debug('WEBHOOK', `No webhook configured for user ${userId}`);
        return;
      }

      // Build payload
      const payload: WebhookPayload = {
        event,
        data,
        timestamp: Date.now(),
        signature: '',
      };

      // Generate HMAC signature
      payload.signature = this.generateSignature(payload, webhookConfig.secret);

      // Send HTTP request
      const response = await axios.post(webhookConfig.url, payload, {
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Signature': payload.signature,
          'X-Webhook-Event': event,
          'User-Agent': 'Bicrypto-Webhook/1.0',
        },
        timeout: this.timeout,
      });

      // Log success
      await models.webhookLog.create({
        userId,
        event,
        url: webhookConfig.url,
        payload: JSON.stringify(payload),
        response: JSON.stringify(response.data),
        statusCode: response.status,
        success: true,
      });

      logger.info('WEBHOOK', `✅ Webhook sent: ${event} to ${userId}`);
      
      return { success: true, statusCode: response.status };
    } catch (error: any) {
      logger.error('WEBHOOK', `❌ Webhook failed: ${event}`, error.message);

      // Log failure
      if (error.config) {
        await models.webhookLog.create({
          userId,
          event,
          url: error.config.url || '',
          payload: JSON.stringify(data),
          response: error.message,
          statusCode: error.response?.status || 0,
          success: false,
        });
      }

      // Retry with exponential backoff (only if not already at max retries)
      if (attempt < this.maxRetries) {
        await this.retryWebhook(userId, event, data, attempt + 1);
      }
      
      return { success: false, error: error.message };
    }
  }

  /**
   * Retry webhook with exponential backoff
   */
  private async retryWebhook(
    userId: string,
    event: string,
    data: any,
    attempt: number
  ) {
    if (attempt > this.maxRetries) {
      logger.warn('WEBHOOK', `Max retries (${this.maxRetries}) reached for ${event}`);
      return;
    }

    // Exponential backoff: 2^attempt seconds
    const delay = Math.pow(2, attempt) * 1000;
    logger.info('WEBHOOK', `Retrying webhook in ${delay}ms (attempt ${attempt})`);

    setTimeout(() => {
      this.sendWebhook(userId, event, data);
    }, delay);
  }

  /**
   * Generate HMAC-SHA256 signature
   */
  private generateSignature(payload: Omit<WebhookPayload, 'signature'>, secret: string): string {
    const data = JSON.stringify({
      event: payload.event,
      data: payload.data,
      timestamp: payload.timestamp,
    });
    
    return crypto
      .createHmac('sha256', secret)
      .update(data)
      .digest('hex');
  }

  /**
   * Verify webhook signature
   */
  verifySignature(payload: string, signature: string, secret: string): boolean {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
    
    // Use timing-safe comparison
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  }

  /**
   * Test webhook endpoint
   */
  async testWebhook(userId: string, url: string, secret: string): Promise<boolean> {
    try {
      const testPayload: WebhookPayload = {
        event: 'test.webhook',
        data: { message: 'This is a test webhook from Bicrypto' },
        timestamp: Date.now(),
        signature: '',
      };

      testPayload.signature = this.generateSignature(testPayload, secret);

      const response = await axios.post(url, testPayload, {
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Signature': testPayload.signature,
          'X-Webhook-Event': 'test.webhook',
        },
        timeout: this.timeout,
      });

      logger.info('WEBHOOK', `Test webhook successful: ${url}`);
      return response.status >= 200 && response.status < 300;
    } catch (error: any) {
      logger.error('WEBHOOK', `Test webhook failed: ${url}`, error.message);
      return false;
    }
  }

  /**
   * Get webhook logs for a user
   */
  async getWebhookLogs(userId: string, limit: number = 50) {
    try {
      return await models.webhookLog.findAll({
        where: { userId },
        order: [['createdAt', 'DESC']],
        limit,
      });
    } catch (error) {
      logger.error('WEBHOOK', 'Failed to get webhook logs', error);
      return [];
    }
  }
}

export const webhookService = new WebhookService();
