describe("gl-ref tests", () => {
  it("Should update the element referenced.", () => {
    cy.visit("http://127.0.0.1:5500/index.html");

    cy.window().then((win) => {
      // Get the ref
      const Controller = win.GreenLight.controller("LoginForm");
      const contentRef = Controller.$refs.get("contentRef");

      // Updated the referenced element content
      contentRef.innerHTML = "abcd";

      // Check if it was updated
      cy.get("[gl-ref=contentRef]").should("have.text", "abcd");
    });
  });

  it("Should be null if the ref was not found", () => {
    cy.visit("http://127.0.0.1:5500/index.html");

    cy.window().then((win) => {
      // Get the ref
      const Controller = win.GreenLight.controller("LoginForm");
      const contentRef = Controller.$refs.get("contentRef2"); // This doesn't exits

      expect(contentRef).to.be.eq(null);
    });
  });
});
