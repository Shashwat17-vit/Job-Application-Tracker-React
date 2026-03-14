import { prisma } from "../lib/prisma.js";
import { ApiError } from "../utils/ApiError.js";
import type { CreateActivityDto, ActivityType } from "@tracker/shared";

export async function getActivities(jobId: string, userId: string) {
  const job = await prisma.jobApplication.findUnique({
    where: { id: jobId },
    select: { userId: true },
  });

  if (!job) {
    throw ApiError.notFound("Job application not found");
  }

  if (job.userId !== userId) {
    throw ApiError.forbidden("Access denied");
  }

  return prisma.activityLog.findMany({
    where: { jobId },
    orderBy: { createdAt: "desc" },
  });
}

export async function createActivity(
  jobId: string,
  userId: string,
  data: CreateActivityDto
) {
  const job = await prisma.jobApplication.findUnique({
    where: { id: jobId },
    select: { userId: true },
  });

  if (!job) {
    throw ApiError.notFound("Job application not found");
  }

  if (job.userId !== userId) {
    throw ApiError.forbidden("Access denied");
  }

  return prisma.activityLog.create({
    data: {
      jobId,
      note: data.note,
      type: (data.type as ActivityType) || "NOTE",
    },
  });
}

export async function deleteActivity(id: string, userId: string) {
  const activity = await prisma.activityLog.findUnique({
    where: { id },
    include: { job: { select: { userId: true } } },
  });

  if (!activity) {
    throw ApiError.notFound("Activity not found");
  }

  if (activity.job.userId !== userId) {
    throw ApiError.forbidden("Access denied");
  }

  await prisma.activityLog.delete({ where: { id } });
}
