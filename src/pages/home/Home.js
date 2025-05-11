import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  CircularProgress,
  Alert,
  ButtonGroup,
  Chip
} from '@mui/material';
import MovieCard from '../../components/moviecard/MovieCard';
import MovieFilters from '../../components/moviefilters/MovieFilters';
import { useMovieContext } from '../../context/MovieContext';
import { useInView } from 'react-intersection-observer';
import './Home.css';

const Home = () => {
  const {
    movies,
    filteredMovies,
    trending,
    loading,
    error,
    hasMore,
    lastSearch,
    genres,
    filters,
    searchMovies,
    fetchTrendingMovies,
    applyFilters,
    resetFilters
  } = useMovieContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [timeWindow, setTimeWindow] = useState('week');
  const [ref, inView] = useInView();
  const [activeFilters, setActiveFilters] = useState(false);

  useEffect(() => {
    if (inView && hasMore && !loading && movies.length > 0) {
      searchMovies(lastSearch, false);
    }
  }, [inView, hasMore, loading, lastSearch, searchMovies, movies.length]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      resetFilters();
      setActiveFilters(false);
      searchMovies(searchQuery);
    }
  };

  const handleTimeWindowChange = (window) => {
    setTimeWindow(window);
    fetchTrendingMovies(window);
  };

  const handleFilter = (newFilters) => {
    applyFilters(newFilters);
    setActiveFilters(
      newFilters.genres.length > 0 ||
      newFilters.minYear !== '' ||
      newFilters.maxYear !== '' ||
      newFilters.rating > 0
    );
  };

  const displayMovies = activeFilters ? filteredMovies : movies;
  const showTrending = displayMovies.length === 0 && !loading && !error && !lastSearch;

  return (
    <Container maxWidth="xl" className="home-container">
      {/* Search Section */}
      <Box className="home-search-box">
        <form onSubmit={handleSearch}>
          <Box className="home-search-form">
            <TextField
              fullWidth
              variant="outlined"
              label="Search for movies"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="home-search-input"
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              className="home-search-button"
            >
              {loading ? <CircularProgress size={24} /> : 'Search'}
            </Button>
          </Box>
        </form>
      </Box>

      {/* Filters Section - Now passing genres and current filters */}
      <MovieFilters 
        onFilter={handleFilter} 
        genres={genres} 
        currentFilters={filters}
      />

      {error && (
        <Alert severity="error" className="home-error-alert">
          {error}
        </Alert>
      )}

      {/* Search Results */}
      {displayMovies.length > 0 ? (
        <>
          <Box className="home-results-header">
            <Typography variant="h4" component="h2">
              {activeFilters ? 'Filtered Results' : `Search Results for "${lastSearch}"`}
            </Typography>
            {activeFilters && (
              <Chip
                label="Filters Applied"
                color="primary"
                size="small"
                className="home-filters-chip"
              />
            )}
          </Box>
          <Grid container spacing={3}>
            {displayMovies.map((movie, index) => (
              <Grid
                item
                key={`${movie.id}-${index}`}
                xs={12}
                sm={6}
                md={4}
                lg={3}
                ref={index === displayMovies.length - 1 ? ref : null}
              >
                <MovieCard movie={movie} />
              </Grid>
            ))}
          </Grid>
          {loading && (
            <Box className="home-loader-box">
              <CircularProgress />
            </Box>
          )}
          {!hasMore && displayMovies.length > 0 && (
            <Typography align="center" className="home-end-text">
              You've reached the end of results
            </Typography>
          )}
        </>
      ) : showTrending ? (
        <>
          <Box className="home-trending-header">
            <Typography variant="h4" component="h2">
              Trending {timeWindow === 'day' ? 'Today' : 'This Week'}
            </Typography>
            <ButtonGroup size="small">
              <Button
                onClick={() => handleTimeWindowChange('day')}
                variant={timeWindow === 'day' ? 'contained' : 'outlined'}
              >
                Today
              </Button>
              <Button
                onClick={() => handleTimeWindowChange('week')}
                variant={timeWindow === 'week' ? 'contained' : 'outlined'}
              >
                This Week
              </Button>
            </ButtonGroup>
          </Box>

          {loading ? (
            <Box className="home-loader-box">
              <CircularProgress size={60} />
            </Box>
          ) : (
            <Grid container spacing={3}>
              {trending.map((movie) => (
                <Grid item key={movie.id} xs={12} sm={6} md={4} lg={3}>
                  <MovieCard movie={movie} />
                </Grid>
              ))}
            </Grid>
          )}
        </>
      ) : (
        <Alert severity="info" className="home-info-alert">
          {activeFilters
            ? 'No movies match your filters'
            : 'No results found. Try a different search.'}
        </Alert>
      )}
    </Container>
  );
};

export default Home;