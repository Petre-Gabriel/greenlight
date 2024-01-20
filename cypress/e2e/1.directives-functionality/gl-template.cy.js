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

  it("Should update the specific bind points.", () => {
    cy.visit("http://127.0.0.1:5500/index.html");

    cy.window().then((win) => {
      // Get the username value in the store
      const Controller = win.GreenLight.controller("LoginForm");

      Controller.$store.set("user.name", "color: red;");

      // We are getting the element by class to check the id change.
      cy.get(".template_bindpoint").should("have.id", "color: red; is cool");
      cy.get(".template_bindpoint").should("have.text", "color: red; is cool");
    });
  });

  it("Should bind the global store value", () => {
    cy.visit("http://127.0.0.1:5500/index.html");

    cy.window().then((win) => {
      win.GreenLight.$globalStore.set("user.name", "color: red;");

      cy.get("#global-template").should("have.text", "color: red; is working");
    });
  });
});
