/**
 * Hot/Cold Wallet Separation Service
 * 95% of funds in cold storage, 5% in hot wallets for daily operations
 */

import { models } from '@b/db';
import { createError } from '@b/utils/error';
import { logger } from '@b/utils/console';

interface WalletConfig {
  hotWalletThreshold: number; // Hot wallet threshold (5%)
  coldWalletPercentage: number; // Cold wallet percentage (95%)
  rebalanceInterval: number; // Auto-rebalance interval (hours)
  minTransferAmount: number; // Minimum transfer amount (USD)
}

export class HotColdWalletService {
  private config: WalletConfig = {
    hotWalletThreshold: 0.05,
    coldWalletPercentage: 0.95,
    rebalanceInterval: 24,
    minTransferAmount: 100,
  };

  /**
   * Automatic fund allocation after deposit
   * 95% to cold wallet, 5% to hot wallet
   */
  async autoAllocateFunds(depositTxId: string) {
    try {
      const deposit = await models.transaction.findByPk(depositTxId);
      if (!deposit) {
        throw new Error('Deposit not found');
      }

      const amount = parseFloat(deposit.amount);
      const hotAmount = amount * this.config.hotWalletThreshold;
      const coldAmount = amount * this.config.coldWalletPercentage;

      // Only allocate if above minimum threshold
      if (coldAmount >= this.config.minTransferAmount) {
        // Transfer to cold wallet
        await this.transferToColdWallet({
          currency: deposit.currency,
          amount: coldAmount.toString(),
          referenceId: depositTxId,
        });

        logger.info('WALLET', `Allocated ${coldAmount} to cold, ${hotAmount} to hot wallet`);
      } else {
        logger.info('WALLET', `Deposit below threshold, keeping in hot wallet`);
      }
    } catch (error) {
      logger.error('WALLET', 'Auto allocation failed', error);
      throw error;
    }
  }

  /**
   * Transfer funds to cold wallet
   * Requires multi-signature approval
   */
  async transferToColdWallet(params: {
    currency: string;
    amount: string;
    referenceId: string;
  }) {
    try {
      // Create transfer record
      const transfer = await models.coldWalletTransfer.create({
        currency: params.currency,
        amount: params.amount,
        referenceId: params.referenceId,
        status: 'PENDING',
        initiatedAt: new Date(),
      });

      // Request multi-sig approval
      await this.requestMultiSigApproval(transfer.id);

      logger.info('WALLET', `Cold wallet transfer initiated: ${transfer.id}`);
      return transfer;
    } catch (error) {
      logger.error('WALLET', 'Cold wallet transfer failed', error);
      throw error;
    }
  }

  /**
   * Create multi-signature approval request
   */
  async requestMultiSigApproval(transferId: string) {
    try {
      await models.multiSigApproval.create({
        transferId,
        requiredSignatures: 3, // Requires 3 admin signatures
        currentSignatures: 0,
        status: 'PENDING',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours expiry
      });

      logger.info('WALLET', `Multi-sig approval requested for transfer: ${transferId}`);
    } catch (error) {
      logger.error('WALLET', 'Failed to create multi-sig approval', error);
      throw error;
    }
  }

  /**
   * Admin signs a transfer
   */
  async signTransfer(transferId: string, adminId: string, signature: string) {
    try {
      const approval = await models.multiSigApproval.findOne({
        where: { transferId },
      });

      if (!approval) {
        throw createError({
          statusCode: 404,
          message: 'Approval not found',
        });
      }

      if (approval.status !== 'PENDING') {
        throw createError({
          statusCode: 400,
          message: 'Approval is not pending',
        });
      }

      // Verify signature
      const isValid = await this.verifySignature(signature, adminId);
      if (!isValid) {
        throw createError({
          statusCode: 400,
          message: 'Invalid signature',
        });
      }

      // Parse existing signatures
      const signatures = approval.signatures ? JSON.parse(approval.signatures) : [];
      
      // Check if admin already signed
      if (signatures.some((sig: any) => sig.adminId === adminId)) {
        throw createError({
          statusCode: 400,
          message: 'Admin has already signed',
        });
      }

      // Add signature
      signatures.push({
        adminId,
        signature,
        timestamp: new Date(),
      });

      approval.signatures = JSON.stringify(signatures);
      approval.currentSignatures += 1;
      await approval.save();

      logger.info('WALLET', `Signature added by admin ${adminId} for transfer ${transferId}`);

      // Check if we have enough signatures
      if (approval.currentSignatures >= approval.requiredSignatures) {
        approval.status = 'APPROVED';
        await approval.save();
        await this.executeColdWalletTransfer(transferId);
      }

      return approval;
    } catch (error) {
      logger.error('WALLET', 'Signature failed', error);
      throw error;
    }
  }

  /**
   * Execute approved cold wallet transfer
   */
  private async executeColdWalletTransfer(transferId: string) {
    try {
      const transfer = await models.coldWalletTransfer.findByPk(transferId);
      if (!transfer) {
        throw new Error('Transfer not found');
      }

      // Update transfer status
      transfer.status = 'APPROVED';
      transfer.approvedAt = new Date();
      await transfer.save();

      logger.info('WALLET', `Cold wallet transfer approved: ${transferId}`);
      
      // Note: Actual blockchain transaction should be done manually with offline signing
      // This is intentional for security - cold wallets should not be connected online
    } catch (error) {
      logger.error('WALLET', 'Cold wallet transfer execution failed', error);
    }
  }

  /**
   * Monitor hot wallet balance
   * Alert if balance is too low
   */
  async monitorHotWalletBalance() {
    try {
      const hotWallets = await models.wallet.findAll({
        where: { status: true },
      });

      for (const wallet of hotWallets) {
        const balance = parseFloat(wallet.balance.toString());
        const totalSupply = await this.getTotalSupply(wallet.currency);
        const threshold = totalSupply * this.config.hotWalletThreshold;

        if (balance < threshold * 0.3) {
          // Hot wallet balance is below 30% of threshold
          logger.warn('WALLET', `Hot wallet ${wallet.currency} balance low: ${balance}`);
          await this.requestColdToHotTransfer(
            wallet.currency,
            threshold - balance
          );
        }
      }
    } catch (error) {
      logger.error('WALLET', 'Hot wallet monitoring failed', error);
    }
  }

  /**
   * Request transfer from cold to hot wallet
   */
  private async requestColdToHotTransfer(currency: string, amount: number) {
    try {
      await models.coldToHotRequest.create({
        currency,
        amount: amount.toString(),
        status: 'PENDING',
        priority: amount > 10000 ? 'HIGH' : 'MEDIUM',
        requestedAt: new Date(),
      });

      logger.warn('WALLET', `Cold-to-hot transfer requested: ${amount} ${currency}`);
    } catch (error) {
      logger.error('WALLET', 'Cold-to-hot request failed', error);
    }
  }

  /**
   * Get total supply of a currency in the platform
   */
  private async getTotalSupply(currency: string): Promise<number> {
    try {
      const result = await models.wallet.sum('balance', {
        where: { currency },
      });
      return result || 0;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Verify admin signature
   * TODO: Implement proper cryptographic signature verification
   * This should verify a signature created with the admin's private key
   * against a known public key for that admin
   */
  private async verifySignature(signature: string, adminId: string): Promise<boolean> {
    // Placeholder - MUST be replaced with proper cryptographic verification
    // Example: Use ECDSA signature verification with secp256k1 or Ed25519
    // throw new Error('Signature verification not implemented - DO NOT USE IN PRODUCTION');
    
    // Temporary basic validation (NOT SECURE - for development only)
    if (!signature || signature.length < 64) {
      return false;
    }
    if (!adminId || adminId.length === 0) {
      return false;
    }
    
    // TODO: Implement actual signature verification:
    // 1. Get admin's public key from database
    // 2. Verify signature using crypto library (e.g., ethers, elliptic)
    // 3. Ensure signature is for the correct transfer data
    
    return true;
  }
}

export const hotColdWalletService = new HotColdWalletService();
