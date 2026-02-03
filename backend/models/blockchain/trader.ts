import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";

export interface traderAttributes {
  id: string;
  userId: string;
  name: string;
  bio?: string;
  isPublic: boolean;
  totalFollowers: number;
  totalProfit: string;
  totalTrades: number;
  winRate: number;
  riskScore: number;
  performanceData?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type traderPk = "id";
export type traderId = trader[traderPk];
export type traderOptionalAttributes =
  | "id"
  | "bio"
  | "performanceData"
  | "createdAt"
  | "updatedAt";
export type traderCreationAttributes = Optional<
  traderAttributes,
  traderOptionalAttributes
>;

export default class trader
  extends Model<traderAttributes, traderCreationAttributes>
  implements traderAttributes
{
  id!: string;
  userId!: string;
  name!: string;
  bio?: string;
  isPublic!: boolean;
  totalFollowers!: number;
  totalProfit!: string;
  totalTrades!: number;
  winRate!: number;
  riskScore!: number;
  performanceData?: string;
  createdAt?: Date;
  updatedAt?: Date;

  public static initModel(sequelize: Sequelize.Sequelize): typeof trader {
    return trader.init(
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
          unique: true,
          validate: {
            notNull: { msg: "userId: User ID cannot be null" },
            isUUID: { args: 4, msg: "userId: User ID must be a valid UUID" },
          },
          comment: "ID of the user who is a trader",
        },
        name: {
          type: DataTypes.STRING(255),
          allowNull: false,
          comment: "Trader display name",
        },
        bio: {
          type: DataTypes.TEXT,
          allowNull: true,
          comment: "Trader biography",
        },
        isPublic: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          comment: "Whether trader profile is public",
        },
        totalFollowers: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          comment: "Total number of followers",
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
        riskScore: {
          type: DataTypes.FLOAT,
          allowNull: false,
          defaultValue: 5,
          comment: "Risk score (1-10)",
        },
        performanceData: {
          type: DataTypes.TEXT,
          allowNull: true,
          comment: "Historical performance data JSON",
        },
      },
      {
        sequelize,
        modelName: "trader",
        tableName: "trader",
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
            name: "traderUserIdKey",
            unique: true,
            using: "BTREE",
            fields: [{ name: "userId" }],
          },
        ],
      }
    );
  }
}
