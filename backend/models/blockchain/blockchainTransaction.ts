import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";

export interface blockchainTransactionAttributes {
  id: string;
  chain: string;
  txHash: string;
  from: string;
  to?: string;
  value: string;
  blockNumber?: number;
  timestamp: Date;
  status: "PENDING" | "CONFIRMED" | "FAILED";
  gasUsed?: string;
  gasPrice?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type blockchainTransactionPk = "id";
export type blockchainTransactionId = blockchainTransaction[blockchainTransactionPk];
export type blockchainTransactionOptionalAttributes =
  | "id"
  | "to"
  | "blockNumber"
  | "gasUsed"
  | "gasPrice"
  | "createdAt"
  | "updatedAt";
export type blockchainTransactionCreationAttributes = Optional<
  blockchainTransactionAttributes,
  blockchainTransactionOptionalAttributes
>;

export default class blockchainTransaction
  extends Model<blockchainTransactionAttributes, blockchainTransactionCreationAttributes>
  implements blockchainTransactionAttributes
{
  id!: string;
  chain!: string;
  txHash!: string;
  from!: string;
  to?: string;
  value!: string;
  blockNumber?: number;
  timestamp!: Date;
  status!: "PENDING" | "CONFIRMED" | "FAILED";
  gasUsed?: string;
  gasPrice?: string;
  createdAt?: Date;
  updatedAt?: Date;

  public static initModel(
    sequelize: Sequelize.Sequelize
  ): typeof blockchainTransaction {
    return blockchainTransaction.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        chain: {
          type: DataTypes.STRING(50),
          allowNull: false,
          comment: "Blockchain network",
        },
        txHash: {
          type: DataTypes.STRING(255),
          allowNull: false,
          unique: true,
          comment: "Transaction hash",
        },
        from: {
          type: DataTypes.STRING(255),
          allowNull: false,
          comment: "Sender address",
        },
        to: {
          type: DataTypes.STRING(255),
          allowNull: true,
          comment: "Receiver address",
        },
        value: {
          type: DataTypes.STRING(255),
          allowNull: false,
          comment: "Transaction value",
        },
        blockNumber: {
          type: DataTypes.INTEGER,
          allowNull: true,
          comment: "Block number",
        },
        timestamp: {
          type: DataTypes.DATE,
          allowNull: false,
          comment: "Transaction timestamp",
        },
        status: {
          type: DataTypes.ENUM("PENDING", "CONFIRMED", "FAILED"),
          allowNull: false,
          defaultValue: "PENDING",
          comment: "Transaction status",
        },
        gasUsed: {
          type: DataTypes.STRING(255),
          allowNull: true,
          comment: "Gas used",
        },
        gasPrice: {
          type: DataTypes.STRING(255),
          allowNull: true,
          comment: "Gas price",
        },
      },
      {
        sequelize,
        modelName: "blockchainTransaction",
        tableName: "blockchain_transaction",
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
            name: "blockchainTransactionTxHashKey",
            unique: true,
            using: "BTREE",
            fields: [{ name: "txHash" }],
          },
        ],
      }
    );
  }
}
