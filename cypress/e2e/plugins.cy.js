describe("plugins register + directive test.", () => {
  it('Should initialize the plugin "test"', () => {
    cy.visit("http://127.0.0.1:5500/index.html");

    cy.window().then((win) => {
      // It's done in the index.html file.
      expect(win.GreenLight.pluginIsRegistered).to.be.eq(1);
    });
  });

  it("Should add a gl-test directive that works.", () => {
    cy.visit("http://127.0.0.1:5500/index.html");

    cy.window().then((win) => {
      cy.get("[gl-test]").should("have.text", "Plugin works");

      cy.wait(300).then(() => {
        const Controller = win.GreenLight.controller("LoginForm");
        Controller.$store.set("plugin", "t3st");
        cy.get("[gl-test]").should("have.text", "t3st");
      });

      cy.wait(300).then(() => {
        const globalStoreVal = win.GreenLight.$globalStore.get(
          "cy-plugin-directive"
        );

        expect(globalStoreVal).to.be.eq(1);
      });
    });
  });
});
