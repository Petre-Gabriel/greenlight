import { getDirectiveAttr } from "../directive";

export function getBindPointsFromEl(el) {
  const bindingPoints = getDirectiveAttr("bindto", el) ?? "default";

  const separatedPoints = bindingPoints.split(",");
  const processedBindingPoints = separatedPoints.map((point) => point.trim());

  return processedBindingPoints;
}
