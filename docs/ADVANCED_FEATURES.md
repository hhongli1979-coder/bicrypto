# Bicrypto Advanced Features Documentation

This document provides an overview of the advanced features implemented for the Bicrypto exchange platform.

## Overview

The following features have been added:
1. **Multi-Chain Wallet Support (EVM)** - Support for BSC, Polygon, and Avalanche blockchains
2. **Hot/Cold Wallet Separation** - 95% of funds in cold storage, 5% in hot wallets
3. **Trading Bot API** - Automated trading with multiple strategies
4. **Webhook Notification System** - Real-time event notifications
5. **Social Trading (Copy Trading)** - Follow and copy successful traders

---

## 1. Multi-Chain Wallet Support (EVM)

### Supported Chains
- **BSC (Binance Smart Chain)** - Mainnet and Testnet
- **Polygon** - Mainnet
- **Avalanche** - C-Chain Mainnet

### Features
- Create wallets on any supported EVM chain
- Check native token and ERC20 token balances
- Send transactions (native and ERC20 tokens)
- Dynamic gas price optimization
- Encrypted private key storage (AES-256-GCM)

### API Endpoints

#### Create Wallet
```
POST /api/blockchain/evm/wallet
```
Request body:
```json
{
  "chain": "BSC|BSC_TESTNET|POLYGON|AVALANCHE"
}
```

#### Get Balance
```
GET /api/blockchain/evm/balance?chain=BSC&address=0x...&tokenAddress=0x...
```

#### Get Gas Price
```
GET /api/blockchain/evm/gas-price?chain=BSC
```

### Environment Variables
```env
BSC_RPC_URL=https://bsc-dataseed.binance.org
BSC_TESTNET_RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545
POLYGON_RPC_URL=https://polygon-rpc.com
AVALANCHE_RPC_URL=https://api.avax.network/ext/bc/C/rpc
WALLET_ENCRYPTION_KEY=your-32-char-encryption-key!!
```

---

## 2. Hot/Cold Wallet Separation

### Architecture
- **Hot Wallets**: 5% of funds for daily operations
- **Cold Wallets**: 95% of funds in secure offline storage
- **Multi-signature approval**: Requires 3 admin signatures for cold wallet transfers

### Features
- Automatic fund allocation on deposit
- Multi-signature approval system (3 of N admins)
- Hot wallet balance monitoring
- Automatic cold-to-hot transfer requests when balance is low

### Database Models
- `cold_wallet_transfer` - Transfer records
- `multi_sig_approval` - Multi-signature approval tracking
- `cold_to_hot_request` - Hot wallet refill requests

### Security
- Cold wallet transfers require manual approval
- Multi-signature protection against unauthorized transfers
- 24-hour approval expiration
- Offline signing recommended for cold wallet transactions

---

## 3. Trading Bot API

### Supported Strategies
1. **GRID** - Grid trading strategy
2. **DCA** - Dollar Cost Averaging
3. **ARBITRAGE** - Cross-exchange arbitrage
4. **MARKET_MAKING** - Automated market making

### API Endpoints

#### Create Bot
```
POST /api/trading/bot/create
```
Request body:
```json
{
  "name": "My Grid Bot",
  "strategy": "GRID",
  "symbol": "BTC/USDT",
  "allocation": 1000,
  "config": {
    "gridLevels": 10,
    "priceRange": {
      "min": 40000,
      "max": 50000
    },
    "stopLoss": 5,
    "takeProfit": 10
  }
}
```

#### Get Bots
```
GET /api/trading/bot?status=ACTIVE
```

#### Stop Bot
```
POST /api/trading/bot/[id]/stop
```

### Environment Variables
```env
TRADING_BOT_MAX_ALLOCATION=10000
TRADING_BOT_MIN_BALANCE=100
```

---

## 4. Webhook Notification System

### Supported Events
- `deposit.completed` - Deposit confirmation
- `withdraw.completed` - Withdrawal completion
- `trade.executed` - Trade execution
- `order.filled` - Order filled
- `kyc.approved` - KYC approval
- `balance.updated` - Balance update
- `bot.started` - Trading bot started
- `bot.stopped` - Trading bot stopped
- `copy_trade.opened` - Copy trade started
- `copy_trade.closed` - Copy trade closed

### Features
- HMAC-SHA256 signature verification
- Automatic retry with exponential backoff (up to 3 retries)
- Webhook logs for debugging
- Test webhook endpoint

### Webhook Payload Format
```json
{
  "event": "deposit.completed",
  "data": {
    "userId": "...",
    "amount": "100",
    "currency": "USDT"
  },
  "timestamp": 1234567890,
  "signature": "abc123..."
}
```

### Headers
```
Content-Type: application/json
X-Webhook-Signature: <hmac-sha256 signature>
X-Webhook-Event: <event type>
```

### Environment Variables
```env
WEBHOOK_RETRY_LIMIT=3
WEBHOOK_TIMEOUT=5000
```

---

## 5. Social Trading (Copy Trading)

### Features
- Follow successful traders
- Configurable copy ratio (0.1 - 1.0)
- Stop loss and daily loss limits
- Real-time trade replication
- Trader performance tracking

### API Endpoints

#### Follow Trader
```
POST /api/social-trading/follow
```
Request body:
```json
{
  "traderId": "user-id",
  "allocation": 1000,
  "copyRatio": 0.5,
  "stopLoss": 10,
  "maxDailyLoss": 5
}
```

#### Get Traders
```
GET /api/social-trading/traders?sortBy=profit&limit=20
```

### Trader Metrics
- Total profit
- Win rate
- Total trades
- Number of followers
- Risk score (1-10)

---

## Database Models

### New Tables Created

1. **evm_wallet** - EVM blockchain wallets
2. **blockchain_transaction** - Blockchain transaction records
3. **cold_wallet_transfer** - Cold wallet transfer records
4. **multi_sig_approval** - Multi-signature approvals
5. **cold_to_hot_request** - Hot wallet refill requests
6. **trading_bot** - Trading bot configurations
7. **webhook_config** - User webhook configurations
8. **webhook_log** - Webhook delivery logs
9. **copy_trade** - Copy trading relationships
10. **trader** - Trader profiles

---

## Security Considerations

### Private Key Protection
- All private keys encrypted with AES-256-GCM
- 32-character encryption key required
- Keys never exposed in logs or API responses

### Multi-Signature
- Cold wallet transfers require 3 admin signatures
- 24-hour approval expiration
- Signature verification

### Webhook Security
- HMAC-SHA256 signature verification
- Timing-safe signature comparison
- Rate limiting recommended

### Best Practices
1. Store `WALLET_ENCRYPTION_KEY` securely
2. Use hardware wallets for cold storage
3. Regularly rotate webhook secrets
4. Monitor hot wallet balances
5. Test on testnet before mainnet deployment

---

## Testing

### Prerequisites
1. Configure environment variables in `.env`
2. Ensure database is running
3. Run database migrations

### Test Sequence
1. Create EVM wallet on testnet
2. Check balance
3. Create trading bot
4. Configure webhook
5. Follow a trader

---

## Migration

To apply the database changes:

```bash
# The models will be automatically initialized on first run
# Sequelize will create the tables if they don't exist
npm run dev
```

---

## Support

For issues or questions:
- Check logs in `backend/logs/`
- Review webhook logs in database
- Monitor blockchain transactions

---

## Future Enhancements

Potential future features:
1. Additional blockchain support (Ethereum, Arbitrum, etc.)
2. Advanced bot strategies (sentiment analysis, ML-based)
3. Social trading leaderboards and rankings
4. Mobile app integration
5. Advanced analytics dashboard
6. Cross-chain bridging support
