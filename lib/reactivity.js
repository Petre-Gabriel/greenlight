export const shouldReactToKeyChanged = (updatedKey, matchedVariables) => {
  const splitUpdatedKey = updatedKey.split(".");

  return matchedVariables.some((matchedVar) => {
    const splitMatchedVar = matchedVar.split(".");

    let isMatched = true;

    for (let i = 0; i < splitUpdatedKey.length; i++) {
      const updatedKeyPart = splitUpdatedKey[i];
      const matchedVarPart = splitMatchedVar[i];

      // Here we check if the matched key has an array accessor and if the updated key is the same array
      const indexOfArrayAccessor = matchedVarPart?.indexOf("[") ?? -1;
      if (indexOfArrayAccessor !== -1) {
        // The name without the array accessor
        const arrayVariableName = matchedVarPart.slice(0, indexOfArrayAccessor);

        if (arrayVariableName === updatedKeyPart) break;
      }

      // Here, if they are not the same, just break the loop and return false
      if (updatedKeyPart !== matchedVarPart) {
        isMatched = false;
        break;
      }
    }

    return isMatched;
  });
};

export const createReactivityFunction = (bindProperty) => {
  const variablesMatchRegex = /([\w\d\[\].$]+\w*)/g;
  const matchedVariables = bindProperty.match(variablesMatchRegex);

  return (updatedKey) => shouldReactToKeyChanged(updatedKey, matchedVariables);
};
export default createReactivityFunction;
