Cypress.Commands.add("createPost", (post) => {
    cy.request("POST", "http://localhost:5000/recommendations", post).then(
      (res) => {
        cy.log(res);
      }
    );
  });