import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_KEY = 'your-tmdb-api-key'; // Replace with your actual API key
const BASE_URL = 'https://api.themoviedb.org/3';

export const MovieContext = createContext();

export const MovieProvider = ({ children }) => {
  const [movies, setMovies] = useState([]);
  const [trending, setTrending] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [lastSearch, setLastSearch] = useState('');

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('movieFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }

    const savedLastSearch = localStorage.getItem('lastSearch');
    if (savedLastSearch) {
      setLastSearch(savedLastSearch);
    }

    fetchTrendingMovies();
  }, []);

  // Save favorites to localStorage when they change
  useEffect(() => {
    localStorage.setItem('movieFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const fetchTrendingMovies = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`);
      setTrending(response.data.results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const searchMovies = async (query, newSearch = true) => {
    if (!query.trim()) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const currentPage = newSearch ? 1 : page;
      const response = await axios.get(
        `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}&page=${currentPage}`
      );

      if (newSearch) {
        setMovies(response.data.results);
        setPage(1);
        setLastSearch(query);
        localStorage.setItem('lastSearch', query);
      } else {
        setMovies(prev => [...prev, ...response.data.results]);
      }

      setHasMore(response.data.page < response.data.total_pages);
      if (!newSearch) setPage(prev => prev + 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (lastSearch) {
      searchMovies(lastSearch, false);
    }
  };

  const getMovieDetails = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=videos`);
      return response.data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = (movie) => {
    if (!favorites.some(fav => fav.id === movie.id)) {
      setFavorites(prev => [...prev, movie]);
    }
  };

  const removeFromFavorites = (id) => {
    setFavorites(prev => prev.filter(movie => movie.id !== id));
  };

  return (
    <MovieContext.Provider
      value={{
        movies,
        trending,
        favorites,
        loading,
        error,
        hasMore,
        lastSearch,
        searchMovies,
        loadMore,
        getMovieDetails,
        addToFavorites,
        removeFromFavorites,
        fetchTrendingMovies
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};