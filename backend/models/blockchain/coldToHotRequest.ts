import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";

export interface coldToHotRequestAttributes {
  id: string;
  currency: string;
  amount: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  requestedAt: Date;
  approvedAt?: Date;
  completedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export type coldToHotRequestPk = "id";
export type coldToHotRequestId = coldToHotRequest[coldToHotRequestPk];
export type coldToHotRequestOptionalAttributes =
  | "id"
  | "approvedAt"
  | "completedAt"
  | "createdAt"
  | "updatedAt";
export type coldToHotRequestCreationAttributes = Optional<
  coldToHotRequestAttributes,
  coldToHotRequestOptionalAttributes
>;

export default class coldToHotRequest
  extends Model<coldToHotRequestAttributes, coldToHotRequestCreationAttributes>
  implements coldToHotRequestAttributes
{
  id!: string;
  currency!: string;
  amount!: string;
  status!: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";
  priority!: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  requestedAt!: Date;
  approvedAt?: Date;
  completedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;

  public static initModel(
    sequelize: Sequelize.Sequelize
  ): typeof coldToHotRequest {
    return coldToHotRequest.init(
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
          comment: "Currency to transfer",
        },
        amount: {
          type: DataTypes.STRING(255),
          allowNull: false,
          comment: "Amount to transfer",
        },
        status: {
          type: DataTypes.ENUM("PENDING", "APPROVED", "REJECTED", "COMPLETED"),
          allowNull: false,
          defaultValue: "PENDING",
          comment: "Request status",
        },
        priority: {
          type: DataTypes.ENUM("LOW", "MEDIUM", "HIGH", "URGENT"),
          allowNull: false,
          defaultValue: "MEDIUM",
          comment: "Request priority",
        },
        requestedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          comment: "When request was created",
        },
        approvedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          comment: "When request was approved",
        },
        completedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          comment: "When request was completed",
        },
      },
      {
        sequelize,
        modelName: "coldToHotRequest",
        tableName: "cold_to_hot_request",
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
