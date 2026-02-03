import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";

export interface copyTradeAttributes {
  id: string;
  followerId: string;
  traderId: string;
  allocation: string;
  copyRatio: number;
  stopLoss?: number;
  maxDailyLoss?: number;
  status: "ACTIVE" | "PAUSED" | "STOPPED";
  totalProfit: string;
  totalCopied: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type copyTradePk = "id";
export type copyTradeId = copyTrade[copyTradePk];
export type copyTradeOptionalAttributes =
  | "id"
  | "stopLoss"
  | "maxDailyLoss"
  | "createdAt"
  | "updatedAt";
export type copyTradeCreationAttributes = Optional<
  copyTradeAttributes,
  copyTradeOptionalAttributes
>;

export default class copyTrade
  extends Model<copyTradeAttributes, copyTradeCreationAttributes>
  implements copyTradeAttributes
{
  id!: string;
  followerId!: string;
  traderId!: string;
  allocation!: string;
  copyRatio!: number;
  stopLoss?: number;
  maxDailyLoss?: number;
  status!: "ACTIVE" | "PAUSED" | "STOPPED";
  totalProfit!: string;
  totalCopied!: number;
  createdAt?: Date;
  updatedAt?: Date;

  public static initModel(sequelize: Sequelize.Sequelize): typeof copyTrade {
    return copyTrade.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        followerId: {
          type: DataTypes.UUID,
          allowNull: false,
          validate: {
            notNull: { msg: "followerId: Follower ID cannot be null" },
            isUUID: { args: 4, msg: "followerId: Follower ID must be a valid UUID" },
          },
          comment: "ID of the user following",
        },
        traderId: {
          type: DataTypes.UUID,
          allowNull: false,
          validate: {
            notNull: { msg: "traderId: Trader ID cannot be null" },
            isUUID: { args: 4, msg: "traderId: Trader ID must be a valid UUID" },
          },
          comment: "ID of the trader being followed",
        },
        allocation: {
          type: DataTypes.STRING(255),
          allowNull: false,
          comment: "Amount allocated for copying",
        },
        copyRatio: {
          type: DataTypes.FLOAT,
          allowNull: false,
          comment: "Ratio to copy trades (0.1 - 1.0)",
        },
        stopLoss: {
          type: DataTypes.FLOAT,
          allowNull: true,
          comment: "Stop loss percentage",
        },
        maxDailyLoss: {
          type: DataTypes.FLOAT,
          allowNull: true,
          comment: "Maximum daily loss percentage",
        },
        status: {
          type: DataTypes.ENUM("ACTIVE", "PAUSED", "STOPPED"),
          allowNull: false,
          defaultValue: "ACTIVE",
          comment: "Copy trade status",
        },
        totalProfit: {
          type: DataTypes.STRING(255),
          allowNull: false,
          defaultValue: "0",
          comment: "Total profit from copying",
        },
        totalCopied: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          comment: "Total number of copied trades",
        },
      },
      {
        sequelize,
        modelName: "copyTrade",
        tableName: "copy_trade",
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
            name: "copyTradeFollowerIdKey",
            using: "BTREE",
            fields: [{ name: "followerId" }],
          },
          {
            name: "copyTradeTraderIdKey",
            using: "BTREE",
            fields: [{ name: "traderId" }],
          },
        ],
      }
    );
  }
}
