describe("gl-if tests", () => {
  it("should show the div after updating username input with 5 characters", () => {
    cy.visit("http://127.0.0.1:5500/index.html");

    cy.get("#username").type("123456");

    cy.get(".gl-if-test").each((el) => {
      cy.wrap(el).should("be.visible");
    });
  });

  it("should not show the div if the username has less than 5 characters", () => {
    cy.visit("http://127.0.0.1:5500/index.html");

    cy.get(".gl-if-test").each((el) => {
      cy.wrap(el).should("not.be.visible");
    });
  });
});
