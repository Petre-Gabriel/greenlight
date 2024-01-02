describe("global store tests", () => {
  it("Should call the onChange function 3 times", () => {
    cy.visit("http://127.0.0.1:5500/index.html");

    cy.window().then((win) => {
      const store = win.GreenLight.$globalStore;

      let callCount = 0;
      store.onChange(() => {
        callCount++;
      });

      store.get().effect = "";
      store.get().effect = "a";
      store.get().effect = "b";

      // We wait for it to take effect
      cy.wait(300).then(() => {
        expect(callCount).to.be.eq(3);
      });
    });
  });

  it("Should be called if any variable from the deps array is called.", () => {
    cy.visit("http://127.0.0.1:5500/index.html");

    cy.window().then((win) => {
      const store = win.GreenLight.$globalStore;

      let callCount = 0;
      store.effect(() => {
        callCount++;
      }, ["effectTest", "effectTest2"]);

      store.get().effectTest = "a";

      // We wait for it to take effect
      cy.wait(300).then(() => {
        expect(callCount).to.eq(1);
      });
    });
  });

  it("Should be called only once if we edit 2 variables from the deps array at the same time.", () => {
    cy.visit("http://127.0.0.1:5500/index.html");

    cy.window().then((win) => {
      const store = win.GreenLight.$globalStore;

      let callCount = 0;
      store.effect(() => {
        callCount++;
      }, ["effectTest", "effectTest2"]);

      store.get().effectTest = "a";
      store.get().effectTest2 = "b";

      // We wait for it to take effect
      cy.wait(300).then(() => {
        expect(callCount).to.eq(1);
      });
    });
  });
});
