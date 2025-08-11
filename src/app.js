
import { fetchPopular, searchMovies } from './api.js';
import { debounce } from './debounce.js';
import { loadFavorites, toggleFavorite } from './favorites.js';

const state = {
  status: 'idle',        
  items: [],
  errorMessage: '',
  favorites: [],
  mode: 'popular',       
  lastQuery: ''
};

const searchInput = document.getElementById('search-input');
const resultsHeading = document.getElementById('results-heading');
const resultsContent = document.getElementById('results-content');
const favoritesContent = document.getElementById('favorites-content');

function setState(patch) {
  Object.assign(state, patch);
  render();
}

async function loadPopular() {
  setState({ status: 'loading', mode: 'popular', lastQuery: '' });
  try {
    const movies = await fetchPopular(20);
    setState({
      status: movies.length ? 'success' : 'empty',
      items: movies,
      errorMessage: ''
    });
  } catch (err) {
    setState({ status: 'error', errorMessage: err.message });
  }
}

async function performSearch(query) {
  setState({ status: 'loading', mode: 'search', lastQuery: query });
  try {
    const movies = await searchMovies(query, 20);
    setState({
      status: movies.length ? 'success' : 'empty',
      items: movies,
      errorMessage: ''
    });
  } catch (err) {
    setState({ status: 'error', errorMessage: err.message });
  }
}

function render() {
  resultsHeading.textContent =
    state.mode === 'popular'
      ? 'Popular Movies'
      : `Results for: "${state.lastQuery}"`;

 
  resultsContent.innerHTML = '';
  if (state.status === 'loading') {
    resultsContent.textContent = 'Loading...';
  } else if (state.status === 'error') {
    resultsContent.textContent = `Error: ${state.errorMessage}`;
  } else if (state.status === 'empty') {
    resultsContent.textContent = 'No results found.';
  } else if (state.status === 'success') {
    const grid = document.createElement('div');
    grid.className = 'grid';
    state.items.forEach(movie => {
      grid.appendChild(renderCard(movie));
    });
    resultsContent.appendChild(grid);
  }

  
  favoritesContent.innerHTML = '';
  if (!state.favorites.length) {
    favoritesContent.textContent = 'No favorites yet.';
  } else {
    const grid = document.createElement('div');
    grid.className = 'grid';
    state.favorites.forEach(movie => {
      grid.appendChild(renderCard(movie, true));
    });
    favoritesContent.appendChild(grid);
  }
}

function renderCard(movie, isFavoriteList = false) {
  const card = document.createElement('div');
  card.className = 'card';

  const img = document.createElement('img');
  img.src = movie.poster || 'https://via.placeholder.com/342x513?text=No+Image';
  img.alt = movie.title;
  card.appendChild(img);

  const title = document.createElement('div');
  title.textContent = `${movie.title} (${movie.year})`;
  card.appendChild(title);

  const btn = document.createElement('button');
  btn.textContent = state.favorites.some(f => f.id === movie.id)
    ? 'Remove Favorite'
    : 'Add Favorite';
  btn.addEventListener('click', () => {
    const updatedFavs = toggleFavorite(movie);
    setState({ favorites: updatedFavs });
  });
  card.appendChild(btn);

  return card;
}


searchInput.addEventListener(
  'input',
  debounce(e => {
    const q = e.target.value.trim();
    if (q) {
      performSearch(q);
    } else {
      loadPopular();
    }
  }, 400)
);


state.favorites = loadFavorites();
loadPopular();
