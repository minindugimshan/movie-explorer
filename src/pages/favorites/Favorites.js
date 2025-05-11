import React, { useContext } from 'react';
import { Box, Container, Typography, Grid, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import MovieCard from '../../components/moviecard/MovieCard';
import { MovieContext } from '../../context/MovieContext';
import './Favorites.css';

const Favorites = () => {
  const { favorites } = useContext(MovieContext);

  return (
    <Container maxWidth="xl">
      <Box className="favorites-container">
        <Typography variant="h3" gutterBottom>
          Your Favorite Movies
        </Typography>

        {favorites.length === 0 ? (
          <Box className="favorites-empty">
            <Typography variant="h5" gutterBottom>
              You don't have any favorite movies yet.
            </Typography>
            <Button
              variant="contained"
              component={Link}
              to="/"
              size="large"
            >
              Discover Movies
            </Button>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {favorites.map((movie) => (
              <Grid item key={movie.id} xs={12} sm={6} md={4} lg={3}>
                <MovieCard movie={movie} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default Favorites;
