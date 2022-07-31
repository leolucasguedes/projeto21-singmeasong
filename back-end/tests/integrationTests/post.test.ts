import supertest from "supertest";

import app from "../../src/app";
import prisma from "../../src/database";
import * as MF from "../factories/musicFactory";

const agent = supertest(app);

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE recommendations RESTART IDENTITY`;
});

describe("Music posts suite", () => {
  it("should create a music post", async () => {
    const isWrongLink = false;
    const musicData = MF.createMusicData(isWrongLink);
    const response = await agent.post("/recommendations").send(musicData);
    expect(response.statusCode).toBe(201);

    const music = await prisma.recommendation.findUnique({
      where: { name: musicData.name },
    });
    expect(music).not.toBeNull();
    expect(music.name).toBe(musicData.name);
  });

  it("should fail create cause the same data", async () => {
    const isWrongLink = false;
    const musicData = MF.createMusicData(isWrongLink);
    const music = await MF.createMusicPost(musicData);
    const response = await agent.post("/recommendations").send(musicData);
    expect(response.statusCode).toBe(409);
  });

  it("should fail create cause no data", async () => {
    const isWrongLink = true;
    const musicData = MF.createMusicData(isWrongLink);
    const response = await agent.post("/recommendations").send(musicData);
    expect(response.statusCode).toBe(422);
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
