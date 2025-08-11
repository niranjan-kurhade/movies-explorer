
const API_KEY = '0969f4eb748ebd20b72673ff82005d9b';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p/w342';

async function request(path, params = {}) {
  const url = new URL(BASE_URL + path);
  url.searchParams.set('api_key', API_KEY);
  Object.entries(params).forEach(([k, v]) => {
    if (v != null) url.searchParams.set(k, v);
  });

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('HTTP ' + res.status);

  try {
    return await res.json();
  } catch {
    throw new Error('Invalid JSON');
  }
}


export async function fetchPopular(limit = 20) {
  const data = await request('/movie/popular', { page: 1 });
  return (data.results || []).slice(0, limit).map(mapMovie);
}


export async function searchMovies(query, limit = 20) {
  if (!query) return [];
  const data = await request('/search/movie', { query, page: 1 });
  return (data.results || []).slice(0, limit).map(mapMovie);
}


function mapMovie(m) {
  return {
    id: m.id,
    title: m.title,
    year: m.release_date ? m.release_date.slice(0, 4) : 'N/A',
    poster: m.poster_path ? IMG_BASE + m.poster_path : '',
  };
}
