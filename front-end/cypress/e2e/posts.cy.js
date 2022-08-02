//<reference types="cypress" />;

import { faker } from "@faker-js/faker";

beforeEach(() => {
  cy.request("POST", "http://localhost:5000/reset", {});
});

describe("Music post suite", () => {
  it("should add new music post", () => {
    const musicData = {
      name: faker.name.findName(),
      youtubeLink: "https://www.youtube.com/watch?v=kVkWt0762To",
    };
    cy.visit("http://localhost:3000/");
    cy.get("input").first().type(musicData.name);
    cy.get("input").last().type(musicData.youtubeLink);

    cy.intercept("POST", "/recommendations").as("addPost");
    cy.get("button").click();
    cy.wait("@addPost");
    cy.contains(musicData.name).should("be.visible");

    cy.url().should("equal", "http://localhost:3000/");
  });

  it("should fail add cause wrong link", () => {
    const musicData = {
      name: faker.name.findName(),
      youtubeLink: "https://wrong.link/ALZHF5UqnU4",
    };
    cy.visit("http://localhost:3000/");
    cy.get("input").first().type(musicData.name);
    cy.get("input").last().type(musicData.youtubeLink);

    cy.intercept("POST", "/recommendations").as("addPost");
    cy.get("button").click();
    cy.wait("@addPost").its("response.statusCode").should("eq", 422);
  });

  it("should faill add cause no input informations", () => {
    cy.visit("http://localhost:3000/");

    cy.intercept("POST", "/recommendations").as("addPost");
    cy.get("button").click();
    cy.wait("@addPost").its("response.statusCode").should("eq", 422);
  });

  it("should add more than ten posts", () => {
    cy.visit("http://localhost:3000/");

    for (let i = 0; i < 15; i++) {
      const musicData = {
        name: faker.name.findName(),
        youtubeLink: "https://www.youtube.com/watch?v=9MwstgQpnw0",
      };
      cy.get("input").first().type(musicData.name);
      cy.get("input").last().type(musicData.youtubeLink);

      cy.intercept("POST", "/recommendations").as("addPost");
      cy.get("button").click();
      cy.wait("@addPost");
      cy.get('[data-identifier="vote-menu"]')
        .should("have.length.gte", 1)
        .and("have.length.lte", 10);
    }
  });
});
