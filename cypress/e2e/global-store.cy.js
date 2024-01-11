describe("global store tests", () => {
  it("Should call the onChange function 3 times", () => {
    cy.visit("http://127.0.0.1:5500/index.html");

    cy.window().then((win) => {
      const store = win.GreenLight.$globalStore;

      let callCount = 0;
      store.onChange(() => {
        callCount++;
      });

      store.set("effect", "");
      store.set("effect", "a");
      store.set("effect", "b");

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

      store.set("effectTest", "a");

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

      store.set("effectTest", "a");
      store.set("effectTest2", "b");

      // We wait for it to take effect
      cy.wait(300).then(() => {
        expect(callCount).to.eq(1);
      });
    });
  });

  it("Should update the value on store change.", () => {
    cy.visit("http://127.0.0.1:5500/index.html");

    cy.window().then((win) => {
      win.GreenLight.$globalStore.set("user.name", "test1");

      cy.get("#global-user").should("have.text", "test1");
      cy.get("#global-template").should("have.text", "test1 is working");

      cy.wait(100).then(() => {
        win.GreenLight.$globalStore.set("user.name", "test2");

        cy.get("#global-user").should("have.text", "test2");
        cy.get("#global-template").should("have.text", "test2 is working");
      });
    });
  });
});
