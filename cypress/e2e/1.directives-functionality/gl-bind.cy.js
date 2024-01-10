describe("gl-bind test", () => {
  it("Should update the input value and the store value", () => {
    cy.visit("http://127.0.0.1:5500/index.html");

    cy.get("#username").type("gabriel");
    cy.window().then((win) => {
      // Get the username value in the store
      const Controller = win.GreenLight.controller("LoginForm");

      const UsernameStoreValue = Controller.$store.get("user.name");
      // Check if it has changed to gabriel.
      expect(UsernameStoreValue).to.eq("gabriel");

      // Update and check if the input value changes as well
      Controller.$store.set("user.name", "petre");
      cy.get("#username").should("have.value", "petre");
    });
  });

  it("Should update all the elements binded to it.", () => {
    cy.visit("http://127.0.0.1:5500/index.html");

    cy.get("#username").type("gabriel");

    cy.get("[gl-bind=user\\.name]:not(input)").each((bindedEl) => {
      cy.wrap(bindedEl).should("have.text", "gabriel");
    });
  });
});
