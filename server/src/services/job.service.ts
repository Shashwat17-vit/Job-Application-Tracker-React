import { prisma } from "../lib/prisma.js";
import { ApiError } from "../utils/ApiError.js";
import type { CreateJobDto, UpdateJobDto, ReorderDto, JobStatus } from "@tracker/shared";

export async function getJobs(userId: string, status?: string) {
  const where: Record<string, unknown> = { userId };
  if (status) {
    where.status = status;
  }

  return prisma.jobApplication.findMany({
    where,
    orderBy: [{ status: "asc" }, { order: "asc" }, { createdAt: "desc" }],
    include: {
      _count: { select: { activities: true } },
    },
  });
}

export async function getJob(id: string, userId: string) {
  const job = await prisma.jobApplication.findUnique({
    where: { id },
    include: {
      activities: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!job) {
    throw ApiError.notFound("Job application not found");
  }

  if (job.userId !== userId) {
    throw ApiError.forbidden("Access denied");
  }

  return job;
}

export async function createJob(userId: string, data: CreateJobDto) {
  const maxOrder = await prisma.jobApplication.aggregate({
    where: { userId, status: (data.status as JobStatus) || "WISHLIST" },
    _max: { order: true },
  });

  return prisma.jobApplication.create({
    data: {
      userId,
      company: data.company,
      role: data.role,
      url: data.url,
      salary: data.salary,
      location: data.location,
      notes: data.notes,
      status: (data.status as JobStatus) || "WISHLIST",
      order: (maxOrder._max.order ?? -1) + 1,
    },
  });
}

export async function updateJob(id: string, userId: string, data: UpdateJobDto) {
  const job = await prisma.jobApplication.findUnique({ where: { id } });

  if (!job) {
    throw ApiError.notFound("Job application not found");
  }

  if (job.userId !== userId) {
    throw ApiError.forbidden("Access denied");
  }

  return prisma.jobApplication.update({
    where: { id },
    data: {
      ...(data.company !== undefined && { company: data.company }),
      ...(data.role !== undefined && { role: data.role }),
      ...(data.url !== undefined && { url: data.url }),
      ...(data.salary !== undefined && { salary: data.salary }),
      ...(data.location !== undefined && { location: data.location }),
      ...(data.notes !== undefined && { notes: data.notes }),
      ...(data.status !== undefined && { status: data.status as JobStatus }),
      ...(data.appliedAt !== undefined && {
        appliedAt: data.appliedAt ? new Date(data.appliedAt) : null,
      }),
    },
  });
}

export async function deleteJob(id: string, userId: string) {
  const job = await prisma.jobApplication.findUnique({ where: { id } });

  if (!job) {
    throw ApiError.notFound("Job application not found");
  }

  if (job.userId !== userId) {
    throw ApiError.forbidden("Access denied");
  }

  await prisma.jobApplication.delete({ where: { id } });
}

export async function updateStatus(id: string, userId: string, status: string) {
  const job = await prisma.jobApplication.findUnique({ where: { id } });

  if (!job) {
    throw ApiError.notFound("Job application not found");
  }

  if (job.userId !== userId) {
    throw ApiError.forbidden("Access denied");
  }

  const maxOrder = await prisma.jobApplication.aggregate({
    where: { userId, status: status as JobStatus },
    _max: { order: true },
  });

  return prisma.jobApplication.update({
    where: { id },
    data: {
      status: status as JobStatus,
      order: (maxOrder._max.order ?? -1) + 1,
      ...(status === "APPLIED" && !job.appliedAt && { appliedAt: new Date() }),
    },
  });
}

export async function reorder(userId: string, data: ReorderDto) {
  const jobIds = data.items.map((item) => item.id);
  const jobs = await prisma.jobApplication.findMany({
    where: { id: { in: jobIds }, userId },
    select: { id: true },
  });

  if (jobs.length !== jobIds.length) {
    throw ApiError.badRequest("Some job applications not found or access denied");
  }

  await prisma.$transaction(
    data.items.map((item) =>
      prisma.jobApplication.update({
        where: { id: item.id },
        data: { status: item.status as JobStatus, order: item.order },
      })
    )
  );
}

export async function getDashboardStats(userId: string) {
  const [statusCounts, totalApplications, recentActivity] = await Promise.all([
    prisma.jobApplication.groupBy({
      by: ["status"],
      where: { userId },
      _count: { _all: true },
    }),
    prisma.jobApplication.count({ where: { userId } }),
    prisma.activityLog.findMany({
      where: { job: { userId } },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        job: { select: { id: true, company: true, role: true } },
      },
    }),
  ]);

  const statusCountMap: Record<string, number> = {};
  for (const entry of statusCounts) {
    statusCountMap[entry.status] = entry._count._all;
  }

  return {
    totalApplications,
    statusCounts: statusCountMap,
    recentActivity,
  };
}
