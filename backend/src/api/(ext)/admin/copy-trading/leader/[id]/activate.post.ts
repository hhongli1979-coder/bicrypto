// Admin reactivate suspended leader
import { models } from "@b/db";
import { createError } from "@b/utils/error";
import { createAuditLog } from "@b/api/(ext)/copy-trading/utils";

export const metadata = {
  summary: "Activate Leader (Admin)",
  description: "Reactivates a suspended leader.",
  operationId: "adminActivateCopyTradingLeader",
  tags: ["Admin", "Copy Trading"],
  requiresAuth: true,
  permission: "access.copy_trading",
  middleware: ["copyTradingAdmin"],
  logModule: "ADMIN_COPY",
  logTitle: "Activate copy trading leader",
  parameters: [
    {
      name: "id",
      in: "path",
      required: true,
      schema: { type: "string" },
    },
  ],
  responses: {
    200: { description: "Leader activated successfully" },
    400: { description: "Bad Request" },
    401: { description: "Unauthorized" },
    403: { description: "Forbidden" },
    404: { description: "Leader not found" },
    500: { description: "Internal Server Error" },
  },
};

export default async (data: Handler) => {
  const { params, user, ctx } = data;
  const { id } = params;

  ctx?.step("Fetching leader");
  const leader = await models.copyTradingLeader.findByPk(id);

  if (!leader) {
    ctx?.fail("Leader not found");
    throw createError({ statusCode: 404, message: "Leader not found" });
  }

  ctx?.step("Validating leader status");
  if (leader.status !== "SUSPENDED") {
    ctx?.fail(`Can only activate suspended leaders. Current status: ${leader.status}`);
    throw createError({
      statusCode: 400,
      message: `Can only activate suspended leaders. Current status: ${leader.status}`,
    });
  }

  ctx?.step("Activating leader");
  const oldStatus = leader.status;
  await leader.update({ status: "ACTIVE" });

  ctx?.step("Creating audit log");
  await createAuditLog({
    entityType: "LEADER",
    entityId: id,
    action: "ACTIVATE",
    oldValue: { status: oldStatus },
    newValue: { status: "ACTIVE" },
    adminId: user?.id,
  });

  // Send notification to leader about activation
  ctx?.step("Sending activation notification to leader");
  try {
    const leaderUser = await models.user.findByPk(leader.userId);
    if (leaderUser) {
      // Create in-app notification
      await models.notification.create({
        userId: leader.userId,
        type: "alert",
        title: "Copy Trading Leader Status Activated",
        message: `Your copy trading leader account has been activated. You can now start accepting followers again.`,
        link: "/user/copy-trading",
        read: false,
      });

      // Send email notification
      try {
        const { sendCopyTradingLeaderApprovedEmail } = await import("@b/utils/emails");
        await sendCopyTradingLeaderApprovedEmail(leaderUser, ctx);
      } catch (emailError) {
        ctx?.fail?.(`Failed to send activation email: ${(emailError as Error).message}`);
      }
    }
  } catch (notifError) {
    ctx?.fail?.(`Failed to send activation notification: ${(notifError as Error).message}`);
  }

  ctx?.success("Leader activated successfully");
  return {
    message: "Leader activated successfully",
    leader: leader.toJSON(),
  };
};
