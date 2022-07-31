import supertest from "supertest";

import app from "../../src/app";
import prisma from "../../src/database";
import * as MF from "../factories/musicFactory";

const agent = supertest(app);

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE recommendations RESTART IDENTITY`;
});

describe("Votes music post suite", () => {
  it("should increase one music vote", async () => {
    const isWrongLink = false;
    const musicData = MF.createMusicData(isWrongLink);
    const music = await MF.createMusicPost(musicData);
    const response = await agent.post(`/recommendations/${music.id}/upvote`);
    expect(response.status).toBe(200);
    const musicUpdate = await prisma.recommendation.findUnique({
      where: { id: music.id },
    });
    expect(musicUpdate.score).toBe(music.score + 1);
  });

  it("should fail increase vote cause invalid id param", async () => {
    const response = await agent.post(`/recommendations/a/upvote`);
    expect(response.status).toBe(500);
  });

  it("should fail increase vote cause id not found", async () => {
    const response = await agent.post(`/recommendations/3/upvote`);
    expect(response.status).toBe(404);
  });

  it("should decrease one music vote", async () => {
    const isWrongLink = false;
    const musicData = MF.createMusicData(isWrongLink);
    const music = await MF.createMusicPost(musicData);
    const response = await agent.post(`/recommendations/${music.id}/downvote`);
    expect(response.status).toBe(200);
    const musicUpdate = await prisma.recommendation.findUnique({
      where: { id: music.id },
    });
    expect(musicUpdate.score).toBe(music.score - 1);
  });

  it("should delete music cause the negative score", async () => {
    const isWrongLink = false;
    const musicData = MF.createMusicData(isWrongLink);
    const music = await MF.createMusicPostWithNegativeScore(musicData);
    const response = await agent.post(`/recommendations/${music.id}/downvote`);
    expect(response.status).toBe(200);
    const musicUpdate = await prisma.recommendation.findUnique({
      where: { id: music.id },
    });
    expect(musicUpdate).toBeNull();
  });

  it("should fail descrease vote cause invalid id param", async () => {
    const response = await agent.post(`/recommendations/a/downvote`);
    expect(response.status).toBe(500);
  });

  it("should fail decrease vote cause id not found", async () => {
    const response = await agent.post(`/recommendations/3/downvote`);
    expect(response.status).toBe(404);
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
