export function isElementInput(el) {
  if (!el || !el.tagName) return false;

  const availableTags = ["input", "textarea", "select"];

  // Check if the availableTags array includes the tag name
  return availableTags.includes(el.tagName.toLowerCase());
}

export function shouldUseOnChangeEvent(el) {
  return (
    el.tagName === "input" && (el.type === "radio" || el.type === "checkbox")
  );
}

export function setElementTextContent(el, content) {
  const newContentNode = document.createTextNode(content);
  el.innerHTML = "";
  el.appendChild(newContentNode);
}
