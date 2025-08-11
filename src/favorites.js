const KEY = 'movie_favorites';

export function loadFavorites() {
  try {
    const data = localStorage.getItem(KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveFavorites(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function toggleFavorite(movie) {
  let favs = loadFavorites();
  const exists = favs.some(f => f.id === movie.id);
  if (exists) {
    favs = favs.filter(f => f.id !== movie.id);
  } else {
    favs.push(movie);
  }
  saveFavorites(favs);
  return favs;
}
