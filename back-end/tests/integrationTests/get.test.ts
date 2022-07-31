import supertest from "supertest";

import app from "../../src/app";
import prisma from "../../src/database";
import * as MF from "../factories/musicFactory";

const agent = supertest(app);

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE recommendations RESTART IDENTITY`;
});

describe("Music gets suite", () => {
  it("should get no music", async () => {
    const response = await agent.get("/recommendations");
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(0);
  });

  it("should get two musics", async () => {
    const musics = await MF.createTwoMusicsPosts();
    const response = await agent.get("/recommendations");
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0].name).toBe("test 2");
    expect(response.body[1].name).toBe("test 1");
  });

  it("should get more than ten musics", async () => {
    const posts = 15;
    const musics = await MF.createMoreThanTenPosts(posts);
    const response = await agent.get("/recommendations");
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(10);
    expect(response.body[0].name).toBe(musics.name);
    expect(response.body[0].youtubeLink).toBe(musics.youtubeLink);
  });

  it("shhould fail cause wrong id", async () => {
    const response = await agent.get("/recommendations/3");
    expect(response.statusCode).toBe(404);
  });

  it("should fail cause char id", async () => {
    const response = await agent.get("/recommendations/a");
    expect(response.statusCode).toBe(500);
  });

  it("should get music by id", async () => {
    const isWrongLink = false;
    const musicData = MF.createMusicData(isWrongLink);
    const music = await MF.createMusicPost(musicData);
    const response = await agent.get(`/recommendations/${music.id}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(music.id);
    expect(response.body.name).toBe(music.name);
    expect(response.body.youtubeLink).toBe(music.youtubeLink);
  });

  it("should get the top two musics by votes", async () => {
    const maxUpvotes = await MF.createThreePostWithVotes();
    const response = await agent.get("/recommendations/top/2");
    expect(response.body).toHaveLength(2);
    expect(response.body[0].score).toBe(maxUpvotes);
  });

  it("should fail cause the wrong param", async () => {
    const response = await agent.get("/recommendations/top/a");
    expect(response.status).toBe(500);
  });

  it("should get all existed musics cause the param is bigger", async () => {
    const musics = await MF.createThreePostWithVotes();
    const response = await agent.get("/recommendations/top/5");
    expect(response.body).toHaveLength(3);
    expect(response.body[0].score).toBe(musics);
  });

  it("should fail cause no param", async () => {
    const musics = await MF.createThreePostWithVotes();
    const response = await agent.get("/recommendations/top");
    expect(response.status).toBe(500);
  });

  it("should get no music cause no posts", async () => {
    const response = await agent.get("/recommendations/top/5");
    expect(response.body).toHaveLength(0);
  });

  it("should fail cause no music posts on random mode", async () => {
    const response = await agent.get("/recommendations/random");
    expect(response.status).toBe(404);
  });

  it("should get three musics on random mode", async () => {
    const musics = await MF.createThreePostWithVotes();
    const response = await agent.get("/recommendations/random");
    expect(response.body.id).not.toBeUndefined();
    expect(response.body.name).not.toBeUndefined();
    expect(response.body.youtubeLink).not.toBeUndefined();
  });

  it("should get one music on random mode", async () => {
    const isWrongLink = false;
    const musicData = MF.createMusicData(isWrongLink);
    const music = await MF.createMusicPost(musicData);
    const response = await agent.get("/recommendations/random");
    expect(response.body.id).toBe(music.id);
    expect(response.body.name).toBe(music.name);
    expect(response.body.youtubeLink).toBe(music.youtubeLink);
    expect(response.body.score).toBe(music.score);
  });
});

afterAll(async () => {
    await prisma.$disconnect();
  });