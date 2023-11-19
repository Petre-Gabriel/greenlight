export function getObjectNestedValueByString(objectReference, accessString) {
  accessString = accessString.replace(/\[(\w+)\]/g, ".$1"); // convert indexes to properties
  accessString = accessString.replace(/^\./, ""); // strip a leading dot
  var splitString = accessString.split(".");

  for (let i = 0, n = splitString.length; i < n; ++i) {
    var currentKey = splitString[i];

    if (currentKey in objectReference) {
      objectReference = objectReference[currentKey];
    } else {
      return;
    }
  }
  return objectReference;
}

export function setObjectNestedValueByString(
  objectReference,
  accessString,
  value
) {
  accessString = accessString.replace(/\[(\w+)\]/g, ".$1"); // convert indexes to properties
  accessString = accessString.replace(/^\./, ""); // strip a leading dot
  var splitString = accessString.split(".");

  for (let i = 0, n = splitString.length; i < n; ++i) {
    var currentKey = splitString[i];

    if (currentKey in objectReference) {
      objectReference = value;
    } else {
      objectReference[currentKey] = value;
    }
  }

  objectReference = value;
}
