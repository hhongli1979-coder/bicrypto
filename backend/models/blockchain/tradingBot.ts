import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";

export interface tradingBotAttributes {
  id: string;
  userId: string;
  name: string;
  strategy: "GRID" | "DCA" | "ARBITRAGE" | "MARKET_MAKING";
  symbol: string;
  allocation: string;
  config?: string;
  status: "ACTIVE" | "PAUSED" | "STOPPED" | "ERROR";
  totalProfit: string;
  totalTrades: number;
  winRate: number;
  lastExecutedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export type tradingBotPk = "id";
export type tradingBotId = tradingBot[tradingBotPk];
export type tradingBotOptionalAttributes =
  | "id"
  | "config"
  | "lastExecutedAt"
  | "createdAt"
  | "updatedAt";
export type tradingBotCreationAttributes = Optional<
  tradingBotAttributes,
  tradingBotOptionalAttributes
>;

export default class tradingBot
  extends Model<tradingBotAttributes, tradingBotCreationAttributes>
  implements tradingBotAttributes
{
  id!: string;
  userId!: string;
  name!: string;
  strategy!: "GRID" | "DCA" | "ARBITRAGE" | "MARKET_MAKING";
  symbol!: string;
  allocation!: string;
  config?: string;
  status!: "ACTIVE" | "PAUSED" | "STOPPED" | "ERROR";
  totalProfit!: string;
  totalTrades!: number;
  winRate!: number;
  lastExecutedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;

  public static initModel(sequelize: Sequelize.Sequelize): typeof tradingBot {
    return tradingBot.init(
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
          comment: "ID of the user who owns this bot",
        },
        name: {
          type: DataTypes.STRING(255),
          allowNull: false,
          comment: "Bot name",
        },
        strategy: {
          type: DataTypes.ENUM("GRID", "DCA", "ARBITRAGE", "MARKET_MAKING"),
          allowNull: false,
          comment: "Trading strategy",
        },
        symbol: {
          type: DataTypes.STRING(50),
          allowNull: false,
          comment: "Trading pair symbol",
        },
        allocation: {
          type: DataTypes.STRING(255),
          allowNull: false,
          comment: "Amount allocated to bot",
        },
        config: {
          type: DataTypes.TEXT,
          allowNull: true,
          comment: "Bot configuration JSON",
        },
        status: {
          type: DataTypes.ENUM("ACTIVE", "PAUSED", "STOPPED", "ERROR"),
          allowNull: false,
          defaultValue: "ACTIVE",
          comment: "Bot status",
        },
        totalProfit: {
          type: DataTypes.STRING(255),
          allowNull: false,
          defaultValue: "0",
          comment: "Total profit",
        },
        totalTrades: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          comment: "Total number of trades",
        },
        winRate: {
          type: DataTypes.FLOAT,
          allowNull: false,
          defaultValue: 0,
          comment: "Win rate percentage",
        },
        lastExecutedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          comment: "Last execution time",
        },
      },
      {
        sequelize,
        modelName: "tradingBot",
        tableName: "trading_bot",
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
            name: "tradingBotUserIdKey",
            using: "BTREE",
            fields: [{ name: "userId" }],
          },
        ],
      }
    );
  }
}
