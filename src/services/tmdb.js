import axios from 'axios';

const API_KEY = '0ebc0c8eadc497e51adcf0cfb108fd5c'; // Replace with your actual key
const BASE_URL = 'https://api.themoviedb.org/3';

// Helper function to make API requests
const tmdbRequest = async (endpoint, params = {}) => {
  try {
    const response = await axios.get(`${BASE_URL}${endpoint}`, {
      params: {
        api_key: API_KEY,
        ...params
      }
    });
    return response.data;
  } catch (error) {
    console.error('TMDB API Error:', error);
    throw error;
  }
};

// API functions
export const tmdb = {
  // Get trending movies
  getTrending: async (timeWindow = 'week') => {
    return await tmdbRequest(`/trending/movie/${timeWindow}`);
  },

  // Search movies
  searchMovies: async (query, page = 1) => {
    return await tmdbRequest('/search/movie', { query, page });
  },

  // Get movie details
  getMovieDetails: async (id) => {
    return await tmdbRequest(`/movie/${id}`, {
      append_to_response: 'videos,credits,similar'
    });
  },

  // Get movie poster URL
  getPosterUrl: (path, size = 'w500') => {
    return path 
      ? `https://image.tmdb.org/t/p/${size}${path}`
      : null;
  },

  // Get YouTube trailer URL
  getTrailerUrl: (videos) => {
    const trailer = videos?.results?.find(v => v.type === 'Trailer');
    return trailer 
      ? `https://www.youtube.com/watch?v=${trailer.key}`
      : null;
  }
};