// import React, { createContext, useState, useEffect } from 'react';
// import { tmdb } from '../services/tmdb';
// import axios from 'axios';

// const API_KEY ='0ebc0c8eadc497e51adcf0cfb108fd5c'; // Replace with your actual API key
// const BASE_URL = 'https://api.themoviedb.org/3';

// export const MovieContext = createContext();

// export const MovieProvider = ({ children }) => {
//   const [movies, setMovies] = useState([]);
//   const [trending, setTrending] = useState([]);
//   const [favorites, setFavorites] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [lastSearch, setLastSearch] = useState('');

//   // Load favorites from localStorage
//   useEffect(() => {
//     const savedFavorites = localStorage.getItem('movieFavorites');
//     if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
//     fetchTrendingMovies();
//   }, []);

//   // Save favorites to localStorage
//   useEffect(() => {
//     localStorage.setItem('movieFavorites', JSON.stringify(favorites));
//   }, [favorites]);

//   // const fetchTrendingMovies = async () => {
//   //   try {
//   //     setLoading(true);
//   //     const data = await tmdb.getTrending();
//   //     setTrending(data.results);
//   //   } catch (err) {
//   //     setError(err.message);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };
//   const fetchTrendingMovies = async (timeWindow = 'week') => {
//   try {
//     setLoading(true);
//     const response = await axios.get(
//       `${BASE_URL}/trending/movie/${timeWindow}?api_key=${API_KEY}`
//     );
//     setTrending(response.data.results);
//   } catch (err) {
//     setError(err.message);
//   } finally {
//     setLoading(false);
//   }
// };

// // Search movies
//   const searchMovies = async (query, newSearch = true) => {
//     if (!query.trim()) return;
    
//     try {
//       setLoading(true);
//       setError(null);
//       const currentPage = newSearch ? 1 : page;
//       const data = await tmdb.searchMovies(query, currentPage);

//       if (newSearch) {
//         setMovies(data.results);
//         setPage(1);
//         setLastSearch(query);
//         localStorage.setItem('lastSearch', query);
//       } else {
//         setMovies(prev => [...prev, ...data.results]);
//       }

//       setHasMore(data.page < data.total_pages);
//       if (!newSearch) setPage(prev => prev + 1);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getMovieDetails = async (id) => {
//     try {
//       setLoading(true);
//       const data = await tmdb.getMovieDetails(id);
//       return data;
//     } catch (err) {
//       setError(err.message);
//       return null;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const addToFavorites = (movie) => {
//     if (!favorites.some(fav => fav.id === movie.id)) {
//       setFavorites(prev => [...prev, movie]);
//     }
//   };

//   const removeFromFavorites = (id) => {
//     setFavorites(prev => prev.filter(movie => movie.id !== id));
//   };

//   return (
//     <MovieContext.Provider
//       value={{
//         movies,
//         trending,
//         favorites,
//         loading,
//         error,
//         hasMore,
//         lastSearch,
//         searchMovies,
//         getMovieDetails,
//         addToFavorites,
//         removeFromFavorites,
//         fetchTrendingMovies
//       }}
//     >
//       {children}
//     </MovieContext.Provider>
//   );
// };


import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_KEY = '0ebc0c8eadc497e51adcf0cfb108fd5c'; // Replace with your actual API key
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

  
  // Load favorites and trending movies on initial render
  useEffect(() => {
    const savedFavorites = localStorage.getItem('movieFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    fetchTrendingMovies();
  }, []);

  // Save favorites to localStorage when they change
  useEffect(() => {
    localStorage.setItem('movieFavorites', JSON.stringify(favorites));
  }, [favorites]);

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
        setPage(1);
        setLastSearch(query);
        localStorage.setItem('lastSearch', query);
      } else {
        setMovies(prev => [...prev, ...response.data.results]);
      }
    //    if (newSearch) {
    //   setMovies(response.data.results);
    //   setPage(2); // Start at page 2 for next load
    // } else {
    //   setMovies(prev => [...prev, ...response.data.results]);
    //   setPage(prev => prev + 1);
    // }

      setHasMore(response.data.page < response.data.total_pages);
      if (!newSearch) setPage(prev => prev + 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
        fetchTrendingMovies,
        getMovieDetails,
        addToFavorites,
        removeFromFavorites,
        loadMore
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};