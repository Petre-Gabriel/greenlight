export function isElementInput(el) {
  return el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement;
}

export function setElementTextContent(el, content) {
  const newContentNode = document.createTextNode(content);
  el.innerHTML = "";
  el.appendChild(newContentNode);
}
