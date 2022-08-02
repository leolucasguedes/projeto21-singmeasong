import prisma from "../database.js";

export async function reset() {
  await prisma.recommendation.deleteMany();
}

export const testRepository = {
  reset,
};
