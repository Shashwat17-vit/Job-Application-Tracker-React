import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  const user = await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: {},
    create: {
      email: "demo@example.com",
      name: "Demo User",
      passwordHash,
    },
  });

  const jobs = await Promise.all([
    prisma.jobApplication.create({
      data: {
        userId: user.id,
        company: "Google",
        role: "Software Engineer",
        url: "https://careers.google.com",
        salary: "$150,000 - $200,000",
        location: "Mountain View, CA",
        status: "APPLIED",
        order: 0,
        appliedAt: new Date("2025-02-15"),
      },
    }),
    prisma.jobApplication.create({
      data: {
        userId: user.id,
        company: "Meta",
        role: "Frontend Engineer",
        url: "https://careers.meta.com",
        salary: "$140,000 - $190,000",
        location: "Menlo Park, CA",
        status: "INTERVIEW",
        order: 0,
        appliedAt: new Date("2025-02-10"),
      },
    }),
    prisma.jobApplication.create({
      data: {
        userId: user.id,
        company: "Stripe",
        role: "Full Stack Developer",
        url: "https://stripe.com/jobs",
        location: "San Francisco, CA",
        status: "WISHLIST",
        order: 0,
      },
    }),
    prisma.jobApplication.create({
      data: {
        userId: user.id,
        company: "Netflix",
        role: "Senior Software Engineer",
        salary: "$200,000 - $300,000",
        location: "Los Gatos, CA",
        status: "PHONE_SCREEN",
        order: 0,
        appliedAt: new Date("2025-02-12"),
      },
    }),
  ]);

  await Promise.all([
    prisma.activityLog.create({
      data: {
        jobId: jobs[0].id,
        note: "Submitted application through careers page",
        type: "STATUS_CHANGE",
      },
    }),
    prisma.activityLog.create({
      data: {
        jobId: jobs[1].id,
        note: "Phone screen with recruiter went well, moving to onsite",
        type: "NOTE",
      },
    }),
    prisma.activityLog.create({
      data: {
        jobId: jobs[3].id,
        note: "Phone screen scheduled for next week",
        type: "INTERVIEW_SCHEDULED",
      },
    }),
  ]);

  console.log("Seed data created successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
