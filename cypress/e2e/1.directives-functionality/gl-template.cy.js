describe("gl-template tests", () => {
  it("Should create a string as expected", () => {
    cy.visit("http://127.0.0.1:5500/index.html");

    cy.get("#username").type("{gabriel}", {
      parseSpecialCharSequences: false,
    });

    cy.get("#usernameTemplate").should(
      "have.text",
      "{gabriel} is already taken."
    );
  });
});
