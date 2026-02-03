import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";

export interface webhookLogAttributes {
  id: string;
  userId: string;
  event: string;
  url: string;
  payload?: string;
  response?: string;
  statusCode: number;
  success: boolean;
  createdAt?: Date;
}

export type webhookLogPk = "id";
export type webhookLogId = webhookLog[webhookLogPk];
export type webhookLogOptionalAttributes =
  | "id"
  | "payload"
  | "response"
  | "createdAt";
export type webhookLogCreationAttributes = Optional<
  webhookLogAttributes,
  webhookLogOptionalAttributes
>;

export default class webhookLog
  extends Model<webhookLogAttributes, webhookLogCreationAttributes>
  implements webhookLogAttributes
{
  id!: string;
  userId!: string;
  event!: string;
  url!: string;
  payload?: string;
  response?: string;
  statusCode!: number;
  success!: boolean;
  createdAt?: Date;

  public static initModel(sequelize: Sequelize.Sequelize): typeof webhookLog {
    return webhookLog.init(
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
          comment: "ID of the user",
        },
        event: {
          type: DataTypes.STRING(100),
          allowNull: false,
          comment: "Event type",
        },
        url: {
          type: DataTypes.STRING(500),
          allowNull: false,
          comment: "Webhook URL",
        },
        payload: {
          type: DataTypes.TEXT,
          allowNull: true,
          comment: "Request payload",
        },
        response: {
          type: DataTypes.TEXT,
          allowNull: true,
          comment: "Response data",
        },
        statusCode: {
          type: DataTypes.INTEGER,
          allowNull: false,
          comment: "HTTP status code",
        },
        success: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          comment: "Whether webhook was successful",
        },
      },
      {
        sequelize,
        modelName: "webhookLog",
        tableName: "webhook_log",
        timestamps: true,
        updatedAt: false,
        paranoid: false,
        indexes: [
          {
            name: "PRIMARY",
            unique: true,
            using: "BTREE",
            fields: [{ name: "id" }],
          },
          {
            name: "webhookLogUserIdKey",
            using: "BTREE",
            fields: [{ name: "userId" }],
          },
        ],
      }
    );
  }
}
