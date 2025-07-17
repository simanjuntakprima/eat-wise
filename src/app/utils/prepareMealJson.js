export function splitLines(str) {
  if (!str) return [];
  return str
    .split("\n")
    .map((s) => s.replace(/^\d+\.\s*/, "").trim())
    .filter(Boolean);
}

export function prepareMealJson(meal) {
  if (!meal) return null;
  return {
    title: meal?.dishName,
    ingredients: splitLines(meal?.ingredients),
    steps: splitLines(meal?.instructions),
  };
}