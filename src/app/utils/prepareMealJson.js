export function splitLines(str) {
  if (!str) return [];
  return str
    .split('\n')
    .map((s) => s.replace(/^\d+\.\s*/, '').trim())
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

export function getMealImage(type) {
  switch (type) {
    case 'breakfast':
      return (
        <img
          src="https://images.unsplash.com/photo-1465014925804-7b9ede58d0d7?q=80&w=776&auto=format&fit=crop"
          alt="Breakfast"
          className="h-full w-full rounded-lg object-cover"
        />
      );
    case 'lunch':
      return (
        <img
          src="https://images.unsplash.com/photo-1680675706515-fb3eb73116d4?q=80&w=880&auto=format&fit=crop"
          alt="Lunch"
          className="h-full w-full rounded-lg object-cover"
        />
      );
    case 'dinner':
      return (
        <img
          src="https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=687&auto=format&fit=crop"
          alt="Dinner"
          className="h-full w-full rounded-lg object-cover"
        />
      );
    default:
      return (
        <img
          src="https://images.unsplash.com/photo-1592417817038-d13fd7342605?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG1lYWx8ZW58MHx8MHx8fDA%3D"
          alt="Default meal"
          className="h-full w-full rounded-lg object-cover"
        />
      );
  }
}