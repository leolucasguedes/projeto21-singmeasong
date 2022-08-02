//<reference types="cypress" />

import { faker } from "@faker-js/faker";

before(() => {
  cy.request("POST", "http://localhost:5000/reset", {});
  const musicData = {
    name: faker.name.findName(),
    youtubeLink: "https://www.youtube.com/watch?v=RVUMByhuOC8",
  };
  cy.createPost(musicData);
});

describe("Vote music suite", () => {
  it("should upvote a music post", () => {
    cy.visit("http://localhost:3000");

    cy.contains("0").as("votes");
    cy.intercept("POST", "/recommendations/1/upvote").as("upvotePost");
    cy.get('[data-identifier="upvote"]').click();
    cy.wait(1000);

    cy.get("@votes").should("have.text", "1");
  });

  it("should upvote a music 3 times", () => {
    cy.visit("http://localhost:3000");
    cy.contains("1").as("votes");

    for (let i = 0; i < 3; i++) {
      cy.intercept("POST", "/recommendations/1/upvote").as("upvotePost");
      cy.get('[data-identifier="upvote"]').click();
      cy.wait(1000);
    }

    cy.get("@votes").should("have.text", "4");
  });

  it("should downvote a music 2 times", () => {
    cy.visit("http://localhost:3000");
    cy.contains("4").as("votes");

    for (let i = 0; i < 2; i++) {
      cy.intercept("POST", "/recommendations/1/downvote").as("downvotePost");
      cy.get('[data-identifier="downvote"]').click();
      cy.wait(1000);
      cy.get("@votes").should("have.text", `${4 - 1 - i}`);
    }
  });

  it("should delete post cause downvote -5", () => {
    cy.visit("http://localhost:3000");
    cy.contains("2").as("votes");
    for (let i = 0; i < 7; i++) {
      cy.get("@votes").should("have.text", `${2 - i}`);
      cy.intercept("POST", "/recommendations/1/downvote").as("downvotePost");
      cy.get('[data-identifier="downvote"]').click();
      cy.wait(1000);
    }

    cy.contains('[data-identifier="vote-menu"]').should("not.exist");
  });
});
