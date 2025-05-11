import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const API_KEY = '0ebc0c8eadc497e51adcf0cfb108fd5c';
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
  const [genres, setGenres] = useState([]);
  const [filters, setFilters] = useState({
    genres: [],
    minYear: '',
    maxYear: '',
    rating: 0
  });
  const [filteredMovies, setFilteredMovies] = useState([]);

  // Load initial data
  useEffect(() => {
    const init = async () => {
      const savedFavorites = localStorage.getItem('movieFavorites');
      const savedFilters = localStorage.getItem('movieFilters');
      
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
      if (savedFilters) {
        setFilters(JSON.parse(savedFilters));
      }
      
      await fetchTrendingMovies();
      await fetchGenres();
    };
    
    init();
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('movieFavorites', JSON.stringify(favorites));
  }, [favorites]);

  // Save filters to localStorage
  useEffect(() => {
    localStorage.setItem('movieFilters', JSON.stringify(filters));
  }, [filters]);

  // Fetch movie genres
  const fetchGenres = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/genre/movie/list?api_key=${API_KEY}`
      );
      setGenres(response.data.genres);
    } catch (err) {
      console.error('Error fetching genres:', err);
    }
  };

  // Fetch trending movies
  const fetchTrendingMovies = async (timeWindow = 'week') => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BASE_URL}/trending/movie/${timeWindow}?api_key=${API_KEY}`
      );
      setTrending(response.data.results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Search movies
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
        setFilteredMovies(response.data.results);
        setPage(1);
        setLastSearch(query);
        localStorage.setItem('lastSearch', query);
      } else {
        const newMovies = [...movies, ...response.data.results];
        setMovies(newMovies);
        setFilteredMovies(filterMovies(newMovies, filters));
      }

      setHasMore(response.data.page < response.data.total_pages);
      if (!newSearch) setPage(prev => prev + 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter movies function
  const filterMovies = (movieList, filterOptions) => {
    return movieList.filter(movie => {
      // Genre filter (array of genre IDs)
      if (filterOptions.genres?.length > 0 && 
          !filterOptions.genres.some(genreId => movie.genre_ids.includes(genreId))) {
        return false;
      }

      // Year range filter
      const releaseYear = movie.release_date ? parseInt(movie.release_date.split('-')[0]) : null;
      if (filterOptions.minYear && releaseYear < parseInt(filterOptions.minYear)) {
        return false;
      }
      if (filterOptions.maxYear && releaseYear > parseInt(filterOptions.maxYear)) {
        return false;
      }

      // Rating filter
      if (filterOptions.rating && movie.vote_average < filterOptions.rating) {
        return false;
      }

      return true;
    });
  };

  // Apply filters to current movies
  const applyFilters = (newFilters) => {
    setFilters(newFilters);
    const hasActiveFilters = Object.values(newFilters).some(val => {
      if (Array.isArray(val)) return val.length > 0;
      return val !== '' && val !== 0;
    });
    
    if (hasActiveFilters) {
      setFilteredMovies(filterMovies(movies, newFilters));
    } else {
      setFilteredMovies(movies);
    }
  };

  // Get movie details
  const getMovieDetails = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BASE_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=videos,credits,similar`
      );
      return response.data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Add to favorites
  const addToFavorites = (movie) => {
    if (!favorites.some(fav => fav.id === movie.id)) {
      setFavorites(prev => [...prev, movie]);
    }
  };

  // Remove from favorites
  const removeFromFavorites = (id) => {
    setFavorites(prev => prev.filter(movie => movie.id !== id));
  };

  // Load more movies for infinite scroll
  const loadMore = () => {
    if (lastSearch) {
      searchMovies(lastSearch, false);
    }
  };

  // Reset filters
  const resetFilters = () => {
    const defaultFilters = {
      genres: [],
      minYear: '',
      maxYear: '',
      rating: 0
    };
    setFilters(defaultFilters);
    setFilteredMovies(movies);
    localStorage.removeItem('movieFilters');
  };

  return (
    <MovieContext.Provider
      value={{
        movies,
        filteredMovies,
        trending,
        favorites,
        loading,
        error,
        hasMore,
        lastSearch,
        genres,
        filters,
        searchMovies,
        fetchTrendingMovies,
        getMovieDetails,
        addToFavorites,
        removeFromFavorites,
        loadMore,
        applyFilters,
        resetFilters,
        filterMovies
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

export const useMovieContext = () => useContext(MovieContext);