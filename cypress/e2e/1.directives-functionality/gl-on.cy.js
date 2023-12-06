describe("gl-on tests", () => {
  it("on the button click, call the event ", () => {
    cy.visit("http://127.0.0.1:5500/index.html");

    cy.window().then((win) => {
      const Controller = win.GreenLight.controller("LoginForm");

      // We need this to spy
      const testObj = {
        test() {},
      };

      const spyFunc = cy.spy(testObj, "test").as("eventFunction");

      function onTestEvent() {
        testObj.test();
        expect(spyFunc).to.be.called;
      }

      Controller.on("testEvent", onTestEvent);

      // On click, it should call the controller event "testEvent"
      cy.get("#onTest").click();
    });
  });
});
