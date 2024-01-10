describe("gl-for tests", () => {
  it("Should react to changes", () => {
    cy.visit("http://127.0.0.1:5500/index.html");

    cy.window().then((win) => {
      const Controller = win.GreenLight.controller("LoginForm");

      // It starts with a length of 3
      cy.get("li.cy-test").should("have.length", 3);

      // We wait because it updates faster than cypress processes it.
      cy.wait(100).then(() => {
        Controller.$store.set("names", [1, 2, 3, 4]);

        cy.get("li.cy-test").should("have.length", 4);
      });
    });
  });

  it("Should remove on length 0", () => {
    cy.visit("http://127.0.0.1:5500/index.html");

    cy.window().then((win) => {
      const Controller = win.GreenLight.controller("LoginForm");

      // It starts with a length of 3
      cy.get("li.cy-test").should("have.length", 3);

      // We wait because it updates faster than cypress processes it.
      cy.wait(100).then(() => {
        Controller.$store.set("names", []);

        cy.get("li.cy-test").should("have.length", 0);
      });
    });
  });
});
