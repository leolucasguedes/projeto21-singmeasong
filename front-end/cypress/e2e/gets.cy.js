//<reference types="cypress" />

import { faker } from "@faker-js/faker";

describe("Top and random music suite", () => {
  it("should show no post at top page", () => {
    cy.visit("http://localhost:3000");
    cy.intercept("GET", "/recommendations/top/10").as("getTop");
    cy.contains("Top").click();
    cy.wait("@getTop").its("response.statusCode").should("eq", 200);
    cy.get('[data-identifier="vote-menu"]').should("not.exist");
  });

  it("should fail get random page cause no posts", () => {
    cy.intercept("GET", "/recommendations/random").as("getRandom");
    cy.visit("http://localhost:3000/random");
    cy.wait("@getRandom").its("response.statusCode").should("eq", 404);
  });

  it("post three posts with different votes, should order by votes in top page", () => {
    const musics = [];
    for (let i = 0; i < 3; i++) {
      const musicData = {
        name: faker.name.findName(),
        youtubeLink: "https://www.youtube.com/watch?v=cw4oJ27GzBg",
      };
      musics.push(musicData);
      cy.createPost(musicData);
    }
    cy.visit("http://localhost:3000");
    for (let i = 0; i < 10; i++) {
      cy.intercept("POST", "/recommendations/2/upvote").as("upvotePost");
      cy.contains(musics[1].name)
        .parent()
        .find('[data-identifier="upvote"]')
        .click();
      cy.wait("@upvotePost");
      if (i % 3 === 0) {
        cy.intercept("POST", "/recommendations/3/downvote").as("downvotePost");
        cy.contains(musics[2].name)
          .parent()
          .find('[data-identifier="downvote"]')
          .click();
        cy.wait("@downvotePost");
      }
    }

    cy.contains("Top").click();
    cy.url().should("equal", "http://localhost:3000/top");
    cy.get("article")
      .first()
      .find('[data-identifier="vote-menu"]')
      .should("have.text", "10");
    cy.get("article")
      .last()
      .find('[data-identifier="vote-menu"]')
      .should("have.text", "-4");
  });

  it("with two post, should update ranking after change the votes", () => {
    const musics = [];
    for (let i = 0; i < 2; i++) {
      const musicData = {
        name: faker.name.findName(),
        youtubeLink: "https://www.youtube.com/watch?v=cw4oJ27GzBg",
      };
      musics.push(musicData);
      cy.createPost(musicData);
    }
    cy.visit("http://localhost:3000");
    for (let i = 0; i < 3; i++) {
      cy.intercept("POST", "/recommendations/2/upvote").as("upvotePost1");
      cy.contains(musics[1].name)
        .parent()
        .find('[data-identifier="upvote"]')
        .click();
      cy.wait("@upvotePost1");
      cy.intercept("POST", "/recommendations/1/upvote").as("upvotePost2");
      cy.contains(musics[0].name)
        .parent()
        .find('[data-identifier="upvote"]')
        .click();
      cy.wait("@upvotePost2");
    }
    cy.intercept("POST", "/recommendations/2/upvote").as("upvotePost1");
    cy.contains(musics[1].name)
      .parent()
      .find('[data-identifier="upvote"]')
      .click();
    cy.wait("@upvotePost1");

    cy.contains("Top").click();
    cy.url().should("equal", "http://localhost:3000/top");
    cy.get("article")
      .should("have.length", 2)
      .first()
      .should("contain", musics[1].name)
      .find('[data-identifier="vote-menu"]')
      .should("have.text", "4");
    cy.get("article")
      .last()
      .find('[data-identifier="vote-menu"]')
      .should("have.text", "3");

    cy.intercept("POST", "/recommendations/1/upvote").as("upvotePost2");
    cy.get("article").last().find('[data-identifier="upvote"]').click();
    cy.wait("@upvotePost2");

    cy.intercept("POST", "/recommendations/1/upvote").as("upvotePost2");
    cy.get("article").last().find('[data-identifier="upvote"]').click();
    cy.wait("@upvotePost2");

    cy.intercept("GET", "/recommendations/top/10").as("reload");
    cy.reload();
    cy.wait("@reload");

    cy.get("article")
      .should("have.length", 2)
      .first()
      .should("contain", musics[0].name)
      .find('[data-identifier="vote-menu"]')
      .should("have.text", "5");
  });

  it("with three posts, should get one post at random page", () => {
    const musics = [];
    for (let i = 0; i < 3; i++) {
      const musicData = {
        name: faker.name.findName(),
        youtubeLink: "https://www.youtube.com/watch?v=cw4oJ27GzBg",
      };
      musics.push(musicData);
      cy.createPost(musicData);
    }
    cy.visit("http://localhost:3000");

    cy.intercept("GET", "http://localhost:5000/recommendations/random").as(
      "random"
    );
    cy.contains("Random").click();
    cy.wait("@random");

    cy.get("article").should("have.length", 1);
  });
});
