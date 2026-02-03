import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";

export interface evmWalletAttributes {
  id: string;
  userId: string;
  chain: "BSC" | "BSC_TESTNET" | "POLYGON" | "AVALANCHE";
  address: string;
  encryptedPrivateKey: string;
  publicKey?: string;
  mnemonic?: string;
  balance?: string;
  nonce?: number;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type evmWalletPk = "id";
export type evmWalletId = evmWallet[evmWalletPk];
export type evmWalletOptionalAttributes =
  | "id"
  | "publicKey"
  | "mnemonic"
  | "balance"
  | "nonce"
  | "isActive"
  | "createdAt"
  | "updatedAt";
export type evmWalletCreationAttributes = Optional<
  evmWalletAttributes,
  evmWalletOptionalAttributes
>;

export default class evmWallet
  extends Model<evmWalletAttributes, evmWalletCreationAttributes>
  implements evmWalletAttributes
{
  id!: string;
  userId!: string;
  chain!: "BSC" | "BSC_TESTNET" | "POLYGON" | "AVALANCHE";
  address!: string;
  encryptedPrivateKey!: string;
  publicKey?: string;
  mnemonic?: string;
  balance?: string;
  nonce?: number;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  public static initModel(sequelize: Sequelize.Sequelize): typeof evmWallet {
    return evmWallet.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        userId: {
          type: DataTypes.UUID,
          allowNull: false,
          validate: {
            notNull: { msg: "userId: User ID cannot be null" },
            isUUID: { args: 4, msg: "userId: User ID must be a valid UUID" },
          },
          comment: "ID of the user who owns this wallet",
        },
        chain: {
          type: DataTypes.ENUM("BSC", "BSC_TESTNET", "POLYGON", "AVALANCHE"),
          allowNull: false,
          validate: {
            isIn: {
              args: [["BSC", "BSC_TESTNET", "POLYGON", "AVALANCHE"]],
              msg: "chain: Chain must be one of ['BSC', 'BSC_TESTNET', 'POLYGON', 'AVALANCHE']",
            },
          },
          comment: "EVM compatible blockchain",
        },
        address: {
          type: DataTypes.STRING(255),
          allowNull: false,
          unique: true,
          validate: {
            notEmpty: { msg: "address: Address cannot be empty" },
          },
          comment: "Wallet blockchain address",
        },
        encryptedPrivateKey: {
          type: DataTypes.TEXT,
          allowNull: false,
          comment: "Encrypted private key",
        },
        publicKey: {
          type: DataTypes.TEXT,
          allowNull: true,
          comment: "Public key",
        },
        mnemonic: {
          type: DataTypes.TEXT,
          allowNull: true,
          comment: "Encrypted mnemonic phrase",
        },
        balance: {
          type: DataTypes.STRING(255),
          allowNull: true,
          defaultValue: "0",
          comment: "Wallet balance",
        },
        nonce: {
          type: DataTypes.INTEGER,
          allowNull: true,
          defaultValue: 0,
          comment: "Transaction nonce",
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: true,
          comment: "Whether the wallet is active",
        },
      },
      {
        sequelize,
        modelName: "evmWallet",
        tableName: "evm_wallet",
        timestamps: true,
        paranoid: false,
        indexes: [
          {
            name: "PRIMARY",
            unique: true,
            using: "BTREE",
            fields: [{ name: "id" }],
          },
          {
            name: "evmWalletUserIdChainKey",
            unique: true,
            using: "BTREE",
            fields: [{ name: "userId" }, { name: "chain" }],
          },
          {
            name: "evmWalletAddressKey",
            unique: true,
            using: "BTREE",
            fields: [{ name: "address" }],
          },
        ],
      }
    );
  }
}

export interface walletAttributes {
  id: string;
  userId: string;
  type: "FIAT" | "SPOT" | "ECO" | "FUTURES" | "COPY_TRADING";
  currency: string;
  balance: number;
  inOrder?: number;
  address?: {
    [key: string]: { address: string; network: string; balance: number };
  };
  status: boolean;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;
}

export type walletCreationAttributes = Optional<
  walletAttributes,
  "id" | "inOrder" | "address" | "createdAt" | "deletedAt" | "updatedAt"
>;
