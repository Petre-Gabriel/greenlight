export function createReferencesObject(controllerName) {
  const refData = {
    attachedTo: controllerName,
    refMap: new Map(),

    add(refName, el) {
      if (this.refMap.get(refName))
        throw new Error(`The reference ${refName} is already set.`);

      this.refMap.set(refName, el);
    },

    delete(refName) {
      return this.refMap.delete(refName);
    },

    get(refName) {
      return this.refMap.get(refName) ?? null;
    },
  };

  return refData;
}
