describe("gl-if tests", () => {
  it("should show the div after updating username input", () => {
    cy.visit("http://127.0.0.1:5500/index.html");

    cy.get("#username").type("test");

    cy.get("[gl-if=user\\.name]").each((el) => {
      cy.wrap(el).should("be.visible");
    });
  });

  it("should not show the div if the username is empty", () => {
    cy.visit("http://127.0.0.1:5500/index.html");

    cy.get("[gl-if=user\\.name]").each((el) => {
      cy.wrap(el).should("not.be.visible");
    });
  });
});
