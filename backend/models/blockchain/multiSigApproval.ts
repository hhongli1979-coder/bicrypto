import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";

export interface multiSigApprovalAttributes {
  id: string;
  transferId: string;
  requiredSignatures: number;
  currentSignatures: number;
  signatures?: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "EXPIRED";
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export type multiSigApprovalPk = "id";
export type multiSigApprovalId = multiSigApproval[multiSigApprovalPk];
export type multiSigApprovalOptionalAttributes =
  | "id"
  | "signatures"
  | "createdAt"
  | "updatedAt";
export type multiSigApprovalCreationAttributes = Optional<
  multiSigApprovalAttributes,
  multiSigApprovalOptionalAttributes
>;

export default class multiSigApproval
  extends Model<multiSigApprovalAttributes, multiSigApprovalCreationAttributes>
  implements multiSigApprovalAttributes
{
  id!: string;
  transferId!: string;
  requiredSignatures!: number;
  currentSignatures!: number;
  signatures?: string;
  status!: "PENDING" | "APPROVED" | "REJECTED" | "EXPIRED";
  expiresAt!: Date;
  createdAt?: Date;
  updatedAt?: Date;

  public static initModel(
    sequelize: Sequelize.Sequelize
  ): typeof multiSigApproval {
    return multiSigApproval.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        transferId: {
          type: DataTypes.UUID,
          allowNull: false,
          unique: true,
          comment: "Reference to cold wallet transfer",
        },
        requiredSignatures: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 3,
          comment: "Number of signatures required",
        },
        currentSignatures: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          comment: "Current number of signatures",
        },
        signatures: {
          type: DataTypes.TEXT,
          allowNull: true,
          comment: "JSON array of signatures",
        },
        status: {
          type: DataTypes.ENUM("PENDING", "APPROVED", "REJECTED", "EXPIRED"),
          allowNull: false,
          defaultValue: "PENDING",
          comment: "Approval status",
        },
        expiresAt: {
          type: DataTypes.DATE,
          allowNull: false,
          comment: "When approval expires",
        },
      },
      {
        sequelize,
        modelName: "multiSigApproval",
        tableName: "multi_sig_approval",
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
            name: "multiSigApprovalTransferIdKey",
            unique: true,
            using: "BTREE",
            fields: [{ name: "transferId" }],
          },
        ],
      }
    );
  }
}
