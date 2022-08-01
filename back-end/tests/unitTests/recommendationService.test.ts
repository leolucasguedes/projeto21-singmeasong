import { jest } from "@jest/globals";
import { response } from "express";
import { recommendationRepository } from "../../src/repositories/recommendationRepository";
import { recommendationService } from "../../src/services/recommendationsService.js";
import * as MF from "./../factories/musicFactory.js";

beforeEach(() => {
  jest.resetAllMocks();
});

describe("Recommendation service suite", () => {
  it("should insert music at database", async () => {
    jest
      .spyOn(recommendationRepository, "findByName")
      .mockImplementationOnce((): any => false);

    jest.spyOn(recommendationRepository, "create").mockResolvedValueOnce();

    const isWrongLink = false;
    const musicInfo = MF.createMusicData(isWrongLink);
    const result = await recommendationService.insert(musicInfo);
    expect(recommendationRepository.findByName).toBeCalledTimes(1);
    expect(recommendationRepository.create).toBeCalledTimes(1);
  });

  it("should fail cause already registered name", async () => {
    jest
      .spyOn(recommendationRepository, "findByName")
      .mockImplementationOnce((): any => true);

    jest.spyOn(recommendationRepository, "create").mockResolvedValueOnce();

    const isWrongLink = false;
    const musicInfo = MF.createMusicData(isWrongLink);
    const result = recommendationService.insert(musicInfo);
    expect(result).rejects.toEqual({
      type: "conflict",
      message: "Recommendations names must be unique",
    });
    expect(recommendationRepository.findByName).toBeCalledTimes(1);
    expect(recommendationRepository.create).not.toBeCalled();
  });

  it("should getById with correct id", async () => {
    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((id): any => ({
        name: `teste ${id}`,
        youtubeLink: `teste ${id}`,
      }));

    const id = 3;
    const result = await recommendationService.getById(id);
    expect(result.name).toBe(`teste ${id}`);
    expect(result.youtubeLink).toBe(`teste ${id}`);
    expect(recommendationRepository.find).toBeCalledTimes(1);
  });

  it("should fail with wrong id", async () => {
    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((id): any => false);

    const id = 3;
    const result = recommendationService.getById(id);
    expect(result).rejects.toEqual({ type: "not_found", message: "" });
    expect(recommendationRepository.find).toBeCalledTimes(1);
  });

  it("should vote correct", async () => {
    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((id): any => true);

    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockImplementationOnce((): any => {});

    const result = recommendationService.upvote(2);
    expect(recommendationRepository.find).toBeCalledTimes(1);
    expect(recommendationRepository.updateScore).toBeCalledTimes(1);
  });

  it("should fail vote cause incorrect id", async () => {
    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((id): any => false);

    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockImplementationOnce((): any => {});

    const result = recommendationService.upvote(2);
    expect(result).rejects.toEqual({ type: "not_found", message: "" });
    expect(recommendationRepository.find).toBeCalledTimes(1);
    expect(recommendationRepository.updateScore).toBeCalledTimes(0);
  });

  it("should downvote correct", async () => {
    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => true);

    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockImplementationOnce((): any => ({ score: 3 }));

    jest
      .spyOn(recommendationRepository, "remove")
      .mockImplementationOnce((): any => {});

    const result = await recommendationService.downvote(2);
    expect(recommendationRepository.find).toBeCalledTimes(1);
    expect(recommendationRepository.updateScore).toBeCalledTimes(1);
    expect(recommendationRepository.remove).toBeCalledTimes(0);
  });

  it("should delete post cause 5 downvotes", async () => {
    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => true);

    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockImplementationOnce((): any => ({ score: -6 }));

    jest
      .spyOn(recommendationRepository, "remove")
      .mockImplementationOnce((): any => {});

    const result = await recommendationService.downvote(2);
    expect(recommendationRepository.find).toBeCalledTimes(1);
    expect(recommendationRepository.updateScore).toBeCalledTimes(1);
    expect(recommendationRepository.remove).toBeCalledTimes(1);
  });

  it("should fail vote cause incorrect id", async () => {
    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => false);

    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockImplementationOnce((): any => {});

    jest
      .spyOn(recommendationRepository, "remove")
      .mockImplementationOnce((): any => {});

    const result = recommendationService.downvote(2);
    expect(result).rejects.toEqual({ type: "not_found", message: "" });
    expect(recommendationRepository.find).toBeCalledTimes(1);
    expect(recommendationRepository.updateScore).toBeCalledTimes(0);
    expect(recommendationRepository.remove).toBeCalledTimes(0);
  });

  it("should get music posts", async () => {
    jest
      .spyOn(recommendationRepository, "findAll")
      .mockImplementationOnce((): any => {
        return "test";
      });

    const result = await recommendationService.get();
    expect(result).toBe("test");
  });

  it("should get top music posts", async () => {
    jest
      .spyOn(recommendationRepository, "getAmountByScore")
      .mockImplementationOnce((): any => "test");

    const result = await recommendationService.getTop(4);
    expect(result).toBe("test");
  });

  it("should get one random music with lte", async () => {
    jest.spyOn(Math, "random").mockReturnValue(0.4);
    jest
      .spyOn(recommendationRepository, "findAll")
      .mockImplementationOnce((): any => {
        return [{ name: "test 1" }, { name: "test 2" }];
      });

    const result = await recommendationService.getRandom();
    expect(recommendationRepository.findAll).toBeCalledTimes(1);
    expect(Math.random).toBeCalledTimes(2);
    expect(result.name).toBe("test 1");
  });

  it("should get one random music with gt", async () => {
    jest.spyOn(Math, "random").mockReturnValue(0.8);
    jest
      .spyOn(recommendationRepository, "findAll")
      .mockImplementationOnce((): any => {
        return [{ name: "test 1" }, { name: "test 2" }];
      });

    const result = await recommendationService.getRandom();
    expect(recommendationRepository.findAll).toBeCalledTimes(1);
    expect(Math.random).toBeCalledTimes(2);
    expect(result.name).toBe("test 2");
  });

  it("should fail get random music cause no music posts", async () => {
    jest
      .spyOn(recommendationRepository, "findAll")
      .mockImplementation((): any => {
        return [];
      });
    const result = recommendationService.getRandom();
    expect(result).rejects.toEqual({ type: "not_found", message: "" });
  });
});
