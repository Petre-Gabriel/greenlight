// Import the exported function from the reactivity.js file in the /lib folder
const createReactivityFunction = require("../../lib/reactivity");

describe("reactivity engine test", () => {
  it("should return true for the same variable and false is is not the exact same", () => {
    const shouldReact = createReactivityFunction("testing");

    const shouldBeUpdated = shouldReact("testing");
    expect(shouldBeUpdated).to.be.true;

    const shouldNotBeUpdated = shouldReact("test");
    expect(shouldNotBeUpdated).to.be.false;
  });

  it("should react if the parent object is updated", () => {
    const shouldReact = createReactivityFunction("testing.variable");

    const shouldBeUpdated = shouldReact("testing");
    expect(shouldBeUpdated).to.be.true;

    const shouldNotBeUpdated = shouldReact("test");
    expect(shouldNotBeUpdated).to.be.false;
  });

  it("parent object should not react if the child object is updated", () => {
    const shouldReact = createReactivityFunction("testing");

    const shouldNotBeUpdated = shouldReact("testing.variable");
    expect(shouldNotBeUpdated).to.be.false;
  });

  it("should take into account the array index and change all if no index is provided", () => {
    const shouldReact = createReactivityFunction("testing[0]");

    const test1 = shouldReact("testing[0]");
    expect(test1).to.be.true;

    const test2 = shouldReact("testing[1]");
    expect(test2).to.be.false;

    const test3 = shouldReact("testing");
    expect(test3).to.be.true;
  });

  it("should work with multiple levels of nested objects", () => {
    const shouldReact = createReactivityFunction(
      "testing.variable.nested[0].deeply.nested"
    );

    const test1 = shouldReact("testing.variable.nested[0].deeply.nested");
    expect(test1).to.be.true;

    const test2 = shouldReact("testing.variable.nested[0].deeply");
    expect(test2).to.be.true;

    const test3 = shouldReact("testing.variable.nested[0]");
    expect(test3).to.be.true;

    const test4 = shouldReact("testing.variable.nested");
    expect(test4).to.be.true;

    const test5 = shouldReact("testing.variable");
    expect(test5).to.be.true;

    const test6 = shouldReact("testing");
    expect(test6).to.be.true;

    // Should not update beacuse the array index is different
    const test7 = shouldReact("testing.variable.nested[1]");
    expect(test7).to.be.false;
  });
});
