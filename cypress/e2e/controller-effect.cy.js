describe("controller effect method tests", () => {
  it("Should call the callback function on change", () => {
    cy.visit("http://127.0.0.1:5500/index.html");

    cy.window().then((win) => {
      const Controller = win.GreenLight.controller("LoginForm");

      let callCount = 0;
      Controller.effect(() => {
        callCount++;
      }, ["effect"]);

      cy.get("#effectTest").type("gabriel");

      // We wait for it to take effect
      cy.wait(300).then(() => {
        expect(callCount).to.be.greaterThan(0);
      });
    });
  });

  it("Should be called only once if we edit 2 variables from the deps array at the same time.", () => {
    cy.visit("http://127.0.0.1:5500/index.html");

    cy.window().then((win) => {
      const Controller = win.GreenLight.controller("LoginForm");

      let callCount = 0;
      Controller.effect(() => {
        callCount++;
      }, ["effectTest", "effectTest2"]);

      Controller.$store.set("effectTest", "a");
      Controller.$store.get("effectTest2", "b");

      // We wait for it to take effect
      cy.wait(300).then(() => {
        expect(callCount).to.eq(1);
      });
    });
  });
});
