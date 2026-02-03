import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";

export interface coldWalletTransferAttributes {
  id: string;
  currency: string;
  amount: string;
  referenceId: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED" | "FAILED";
  fromAddress?: string;
  toAddress?: string;
  txHash?: string;
  initiatedAt: Date;
  approvedAt?: Date;
  completedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export type coldWalletTransferPk = "id";
export type coldWalletTransferId = coldWalletTransfer[coldWalletTransferPk];
export type coldWalletTransferOptionalAttributes =
  | "id"
  | "fromAddress"
  | "toAddress"
  | "txHash"
  | "approvedAt"
  | "completedAt"
  | "createdAt"
  | "updatedAt";
export type coldWalletTransferCreationAttributes = Optional<
  coldWalletTransferAttributes,
  coldWalletTransferOptionalAttributes
>;

export default class coldWalletTransfer
  extends Model<coldWalletTransferAttributes, coldWalletTransferCreationAttributes>
  implements coldWalletTransferAttributes
{
  id!: string;
  currency!: string;
  amount!: string;
  referenceId!: string;
  status!: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED" | "FAILED";
  fromAddress?: string;
  toAddress?: string;
  txHash?: string;
  initiatedAt!: Date;
  approvedAt?: Date;
  completedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;

  public static initModel(
    sequelize: Sequelize.Sequelize
  ): typeof coldWalletTransfer {
    return coldWalletTransfer.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        currency: {
          type: DataTypes.STRING(50),
          allowNull: false,
          comment: "Currency being transferred",
        },
        amount: {
          type: DataTypes.STRING(255),
          allowNull: false,
          comment: "Amount to transfer",
        },
        referenceId: {
          type: DataTypes.UUID,
          allowNull: false,
          comment: "Reference to related transaction",
        },
        status: {
          type: DataTypes.ENUM(
            "PENDING",
            "APPROVED",
            "REJECTED",
            "COMPLETED",
            "FAILED"
          ),
          allowNull: false,
          defaultValue: "PENDING",
          comment: "Transfer status",
        },
        fromAddress: {
          type: DataTypes.STRING(255),
          allowNull: true,
          comment: "Source wallet address",
        },
        toAddress: {
          type: DataTypes.STRING(255),
          allowNull: true,
          comment: "Destination wallet address",
        },
        txHash: {
          type: DataTypes.STRING(255),
          allowNull: true,
          comment: "Transaction hash",
        },
        initiatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          comment: "When transfer was initiated",
        },
        approvedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          comment: "When transfer was approved",
        },
        completedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          comment: "When transfer was completed",
        },
      },
      {
        sequelize,
        modelName: "coldWalletTransfer",
        tableName: "cold_wallet_transfer",
        timestamps: true,
        paranoid: false,
        indexes: [
          {
            name: "PRIMARY",
            unique: true,
            using: "BTREE",
            fields: [{ name: "id" }],
          },
        ],
      }
    );
  }
}
