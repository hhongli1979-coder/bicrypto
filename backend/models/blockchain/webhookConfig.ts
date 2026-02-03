import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";

export interface webhookConfigAttributes {
  id: string;
  userId: string;
  url: string;
  secret: string;
  events?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type webhookConfigPk = "id";
export type webhookConfigId = webhookConfig[webhookConfigPk];
export type webhookConfigOptionalAttributes =
  | "id"
  | "events"
  | "isActive"
  | "createdAt"
  | "updatedAt";
export type webhookConfigCreationAttributes = Optional<
  webhookConfigAttributes,
  webhookConfigOptionalAttributes
>;

export default class webhookConfig
  extends Model<webhookConfigAttributes, webhookConfigCreationAttributes>
  implements webhookConfigAttributes
{
  id!: string;
  userId!: string;
  url!: string;
  secret!: string;
  events?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  public static initModel(
    sequelize: Sequelize.Sequelize
  ): typeof webhookConfig {
    return webhookConfig.init(
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
          comment: "ID of the user who owns this webhook",
        },
        url: {
          type: DataTypes.STRING(500),
          allowNull: false,
          comment: "Webhook URL",
        },
        secret: {
          type: DataTypes.STRING(255),
          allowNull: false,
          comment: "Webhook secret for signature verification",
        },
        events: {
          type: DataTypes.TEXT,
          allowNull: true,
          comment: "Comma-separated list of subscribed events",
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: true,
          comment: "Whether webhook is active",
        },
      },
      {
        sequelize,
        modelName: "webhookConfig",
        tableName: "webhook_config",
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
            name: "webhookConfigUserIdKey",
            unique: true,
            using: "BTREE",
            fields: [{ name: "userId" }],
          },
        ],
      }
    );
  }
}
