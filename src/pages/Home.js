import React, { useState, useContext } from 'react';
import { Box, Container, Typography, Grid, TextField, Button, CircularProgress, Alert } from '@mui/material';
import MovieCard from '../components/MovieCard';
import { MovieContext } from '../context/MovieContext';

const Home = () => {
  const { movies, trending, loading, error, hasMore, lastSearch, searchMovies } = useContext(MovieContext);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    searchQuery.trim() && searchMovies(searchQuery);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        <form onSubmit={handleSearch}>
          <Box display="flex" alignItems="center" mb={4}>
            <TextField
              fullWidth
              variant="outlined"
              label="Search for movies"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ mr: 2 }}
            />
            <Button type="submit" variant="contained" disabled={loading}>
              Search
            </Button>
          </Box>
        </form>

        {error && <Alert severity="error">{error}</Alert>}

        {loading && movies.length === 0 && (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        )}

        {movies.length > 0 ? (
          <>
            <Typography variant="h4" gutterBottom>
              Search Results for "{lastSearch}"
            </Typography>
            <Grid container spacing={2}>
              {movies.map((movie) => (
                <Grid item key={movie.id} xs={12} sm={6} md={4} lg={3}>
                  <MovieCard movie={movie} />
                </Grid>
              ))}
            </Grid>
            {hasMore && (
              <Box display="flex" justifyContent="center" my={4}>
                <Button 
                  variant="outlined" 
                  onClick={() => searchMovies(lastSearch, false)}
                  disabled={loading}
                >
                  Load More
                </Button>
              </Box>
            )}
          </>
        ) : (
          <>
            <Typography variant="h4" gutterBottom>
              Trending Movies
            </Typography>
            <Grid container spacing={2}>
              {trending.map((movie) => (
                <Grid item key={movie.id} xs={12} sm={6} md={4} lg={3}>
                  <MovieCard movie={movie} />
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Box>
    </Container>
  );
};

export default Home;