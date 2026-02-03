/**
 * EVM Multi-Chain Wallet Service
 * Supports BSC, Polygon, Avalanche and other EVM compatible chains
 */

import { ethers } from 'ethers';
import { models } from '@b/db';
import { createError } from '@b/utils/error';
import { logger } from '@b/utils/console';
import * as crypto from 'crypto';

// Chain configuration interface
interface ChainConfig {
  chainId: number;
  name: string;
  symbol: string;
  rpcUrl: string;
  explorerUrl: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  isTestnet: boolean;
}

// Supported chains configuration
export const SUPPORTED_CHAINS: Record<string, ChainConfig> = {
  BSC: {
    chainId: 56,
    name: 'Binance Smart Chain',
    symbol: 'BSC',
    rpcUrl: process.env.BSC_MAINNET_RPC || 'https://bsc-dataseed.binance.org',
    explorerUrl: 'https://bscscan.com',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
    isTestnet: false,
  },
  BSC_TESTNET: {
    chainId: 97,
    name: 'BSC Testnet',
    symbol: 'BSC_TEST',
    rpcUrl: process.env.BSC_TESTNET_RPC || 'https://data-seed-prebsc-1-s1.binance.org:8545',
    explorerUrl: 'https://testnet.bscscan.com',
    nativeCurrency: {
      name: 'tBNB',
      symbol: 'tBNB',
      decimals: 18,
    },
    isTestnet: true,
  },
  POLYGON: {
    chainId: 137,
    name: 'Polygon',
    symbol: 'POLYGON',
    rpcUrl: process.env.POLYGON_MATIC_RPC || 'https://polygon-rpc.com',
    explorerUrl: 'https://polygonscan.com',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    isTestnet: false,
  },
  AVALANCHE: {
    chainId: 43114,
    name: 'Avalanche C-Chain',
    symbol: 'AVAX',
    rpcUrl: process.env.AVALANCHE_RPC_URL || 'https://api.avax.network/ext/bc/C/rpc',
    explorerUrl: 'https://snowtrace.io',
    nativeCurrency: {
      name: 'AVAX',
      symbol: 'AVAX',
      decimals: 18,
    },
    isTestnet: false,
  },
};

// ERC20 standard ABI (minimal)
const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function name() view returns (string)',
];

export class EVMMultiChainService {
  private providers: Map<string, ethers.JsonRpcProvider> = new Map();
  
  constructor() {
    this.initializeProviders();
  }

  /**
   * Initialize all chain providers
   */
  private initializeProviders() {
    for (const [chainKey, config] of Object.entries(SUPPORTED_CHAINS)) {
      try {
        const provider = new ethers.JsonRpcProvider(config.rpcUrl, {
          chainId: config.chainId,
          name: config.name,
        });
        this.providers.set(chainKey, provider);
        logger.info('BLOCKCHAIN', `✅ ${config.name} provider initialized`);
      } catch (error) {
        logger.error('BLOCKCHAIN', `❌ Failed to initialize ${config.name}`, error);
      }
    }
  }

  /**
   * Get provider for a specific chain
   */
  getProvider(chain: string): ethers.JsonRpcProvider {
    const provider = this.providers.get(chain);
    if (!provider) {
      throw createError({
        statusCode: 400,
        message: `Unsupported chain: ${chain}`,
      });
    }
    return provider;
  }

  /**
   * Create new wallet address
   */
  async createWallet(chain: string, userId: string) {
    try {
      this.getProvider(chain); // Validate chain
      const wallet = ethers.Wallet.createRandom();
      
      // Save to database
      const walletRecord = await models.evmWallet.create({
        userId,
        chain,
        address: wallet.address,
        encryptedPrivateKey: this.encryptPrivateKey(wallet.privateKey),
        publicKey: wallet.publicKey,
        mnemonic: this.encryptMnemonic(wallet.mnemonic?.phrase),
        balance: '0',
        nonce: 0,
        isActive: true,
      });

      logger.info('BLOCKCHAIN', `New ${chain} wallet created: ${wallet.address}`);
      
      return {
        address: wallet.address,
        chain,
        userId,
      };
    } catch (error) {
      logger.error('BLOCKCHAIN', `Failed to create ${chain} wallet`, error);
      throw error;
    }
  }

  /**
   * Get balance (native or ERC20 token)
   */
  async getBalance(chain: string, address: string, tokenAddress?: string): Promise<string> {
    try {
      const provider = this.getProvider(chain);

      if (tokenAddress) {
        // ERC20 token balance
        const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
        const balance = await contract.balanceOf(address);
        const decimals = await contract.decimals();
        return ethers.formatUnits(balance, decimals);
      } else {
        // Native token balance (BNB, MATIC, AVAX)
        const balance = await provider.getBalance(address);
        return ethers.formatEther(balance);
      }
    } catch (error) {
      logger.error('BLOCKCHAIN', `Failed to get balance for ${address}`, error);
      throw error;
    }
  }

  /**
   * Send transaction
   */
  async sendTransaction(
    chain: string,
    fromAddress: string,
    toAddress: string,
    amount: string,
    tokenAddress?: string,
    gasPrice?: string
  ) {
    try {
      const provider = this.getProvider(chain);
      
      // Get wallet from database
      const walletRecord = await models.evmWallet.findOne({
        where: { chain, address: fromAddress },
      });
      
      if (!walletRecord) {
        throw createError({
          statusCode: 404,
          message: 'Wallet not found',
        });
      }

      // Decrypt private key
      const privateKey = this.decryptPrivateKey(walletRecord.encryptedPrivateKey);
      const wallet = new ethers.Wallet(privateKey, provider);

      let tx;
      
      if (tokenAddress) {
        // ERC20 token transfer
        const contract = new ethers.Contract(tokenAddress, ERC20_ABI, wallet);
        const decimals = await contract.decimals();
        const amountInWei = ethers.parseUnits(amount, decimals);
        
        tx = await contract.transfer(toAddress, amountInWei, {
          gasPrice: gasPrice ? ethers.parseUnits(gasPrice, 'gwei') : undefined,
        });
      } else {
        // Native token transfer
        tx = await wallet.sendTransaction({
          to: toAddress,
          value: ethers.parseEther(amount),
          gasPrice: gasPrice ? ethers.parseUnits(gasPrice, 'gwei') : undefined,
        });
      }

      logger.info('BLOCKCHAIN', `Transaction sent: ${tx.hash}`);
      
      // Wait for confirmation
      const receipt = await tx.wait();
      
      return {
        txHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        status: receipt.status === 1 ? 'SUCCESS' : 'FAILED',
      };
    } catch (error) {
      logger.error('BLOCKCHAIN', 'Transaction failed', error);
      throw error;
    }
  }

  /**
   * Get optimal gas price
   */
  async getOptimalGasPrice(chain: string): Promise<string> {
    try {
      const provider = this.getProvider(chain);
      const feeData = await provider.getFeeData();
      
      // Return recommended gas price in Gwei
      return ethers.formatUnits(feeData.gasPrice || 0n, 'gwei');
    } catch (error) {
      logger.error('BLOCKCHAIN', 'Failed to get gas price', error);
      return '5'; // Default 5 Gwei
    }
  }

  /**
   * Encrypt private key using AES-256-GCM
   */
  private encryptPrivateKey(privateKey: string): string {
    const algorithm = 'aes-256-gcm';
    const key = this.getEncryptionKey();
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    
    let encrypted = cipher.update(privateKey, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag();
    
    return JSON.stringify({
      iv: iv.toString('hex'),
      encryptedData: encrypted,
      authTag: authTag.toString('hex'),
    });
  }

  /**
   * Decrypt private key
   */
  private decryptPrivateKey(encryptedData: string): string {
    const algorithm = 'aes-256-gcm';
    const key = this.getEncryptionKey();
    
    const { iv, encryptedData: encrypted, authTag } = JSON.parse(encryptedData);
    
    const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(iv, 'hex'));
    decipher.setAuthTag(Buffer.from(authTag, 'hex'));
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  /**
   * Encrypt mnemonic
   */
  private encryptMnemonic(mnemonic?: string): string | null {
    if (!mnemonic) return null;
    return this.encryptPrivateKey(mnemonic);
  }

  /**
   * Get encryption key from environment
   */
  private getEncryptionKey(): Buffer {
    const key = process.env.WALLET_ENCRYPTION_KEY || 'default-key-32-chars-long!!!';
    if (key.length !== 32) {
      throw new Error('WALLET_ENCRYPTION_KEY must be 32 characters long');
    }
    return Buffer.from(key, 'utf-8');
  }
}

// Export singleton instance
export const evmMultiChainService = new EVMMultiChainService();
