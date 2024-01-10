describe("gl-hook tests", () => {
  it("should say Gabriel03 is taken as we setup in the html file", () => {
    cy.visit("http://127.0.0.1:5500/index.html");

    // We update the username in the store
    cy.get("#username").type("Gabriel03");

    // It should only be visible if Gabriel03 is in the username
    cy.get("#usernameHook").should("have.text", "Username is taken.");
  });

  it("Should display an error if username has less than 5 charactesr", () => {
    cy.visit("http://127.0.0.1:5500/index.html");

    // We update the username in the store
    cy.get("#username").type("123");

    // It should only be visible if Gabriel03 is in the username
    cy.get("#usernameHook").should(
      "have.text",
      "The username should have at least 5 characters"
    );
  });
});
