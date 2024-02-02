export async function replaceAllAsync(
  stringToBeReplaced,
  regexExpression,
  asyncFn
) {
  const matches =
    stringToBeReplaced.match(new RegExp(regexExpression, "g")) || [];

  const replacements = await Promise.all(
    matches.map(async (matchedString) => {
      const replacement = await asyncFn(matchedString);
      return replacement;
    })
  );

  let currentIndex = 0;
  return stringToBeReplaced.replace(
    new RegExp(regexExpression, "g"),
    () => replacements[currentIndex++]
  );
}
