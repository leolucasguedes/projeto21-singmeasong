import prisma from "../database.js";

export async function resetDatabase() {
  await prisma.recommendation.deleteMany({ where: {} });
}