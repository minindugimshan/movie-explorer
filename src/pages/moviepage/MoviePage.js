import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Paper,
  Rating,
  IconButton,
  Tooltip
} from '@mui/material';
import { MovieContext } from '../../context/MovieContext';
import { tmdb } from '../../services/tmdb';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import YouTube from 'react-youtube';
import './MoviePage.css';

const MoviePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    favorites,
    addToFavorites,
    removeFromFavorites,
    getMovieDetails,
    loading: contextLoading,
    error: contextError
  } = useContext(MovieContext);

  const [movie, setMovie] = useState(null);
  const [localLoading, setLocalLoading] = useState(true);
  const [localError, setLocalError] = useState(null);

  const isFavorite = favorites.some(fav => fav.id === Number(id));

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchMovie = async () => {
      try {
        if (!id) throw new Error('No movie ID provided');

        setLocalLoading(true);
        setLocalError(null);

        const data = await getMovieDetails(id);
        if (isMounted) {
          if (!data) throw new Error('No movie data received');
          setMovie(data);
        }
      } catch (err) {
        if (isMounted) setLocalError(err.message || 'Failed to load movie details');
      } finally {
        if (isMounted) setLocalLoading(false);
      }
    };

    fetchMovie();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [id, getMovieDetails]);

  const handleFavoriteClick = () => {
    if (!movie) return;

    if (isFavorite) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
        vote_average: movie.vote_average
      });
    }
  };

  const getTrailerId = () => {
    if (!movie?.videos?.results) return null;
    const trailer = movie.videos.results.find(vid => vid.type === 'Trailer');
    return trailer ? trailer.key : null;
  };

  const trailerId = getTrailerId();
  const isLoading = contextLoading || localLoading;
  const error = contextError || localError;

  if (isLoading) {
    return (
      <Container maxWidth="lg">
        <Box className="loading-container">
          <CircularProgress size={60} />
          <Typography variant="body1" className="loading-text">
            Loading movie details...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" className="error-container">
        <Alert severity="error" className="error-alert">
          {error}
        </Alert>
        <Button
          variant="contained"
          onClick={() => navigate(-1)}
          startIcon={<ArrowBackIcon />}
        >
          Go Back
        </Button>
      </Container>
    );
  }

  if (!movie) {
    return (
      <Container maxWidth="lg" className="error-container">
        <Alert severity="warning" className="error-alert">
          Movie not found
        </Alert>
        <Button variant="contained" onClick={() => navigate('/')}>
          Browse Movies
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className="movie-container">
      <Box>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          className="back-button"
          variant="outlined"
        >
          Back
        </Button>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} className="poster-container">
              <img
                src={
                  movie.poster_path
                    ? tmdb.getPosterUrl(movie.poster_path, 'w500')
                    : '/no-poster.jpg'
                }
                alt={movie.title}
                className="poster-image"
                onError={(e) => {
                  e.target.src = '/no-poster.jpg';
                }}
              />
              <Box className="favorite-button">
                <Tooltip title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
                  <IconButton
                    onClick={handleFavoriteClick}
                    size="large"
                    color={isFavorite ? 'error' : 'default'}
                  >
                    {isFavorite ? <FavoriteIcon fontSize="large" /> : <FavoriteBorderIcon fontSize="large" />}
                  </IconButton>
                </Tooltip>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            <Box className="movie-header">
              <Box className="header-bar">
                <Typography variant="h3" component="h1">
                  {movie.title}
                </Typography>
              </Box>
              <Typography variant="subtitle1" color="text.secondary">
                {movie.release_date} • {movie.runtime} mins
              </Typography>
            </Box>

            <Box className="rating-container">
              <Rating
                value={movie.vote_average / 2}
                precision={0.1}
                readOnly
                size="large"
              />
              <Typography variant="body1" className="rating-text">
                {movie.vote_average.toFixed(1)} ({movie.vote_count} votes)
              </Typography>
            </Box>

            <Box className="genres-container">
              {movie.genres?.map((genre) => (
                <Chip
                  key={genre.id}
                  label={genre.name}
                  variant="outlined"
                  className="genre-chip"
                />
              ))}
            </Box>

            <Typography variant="h5" className="overview-title">Overview</Typography>
            <Typography paragraph className="overview-text">
              {movie.overview || 'No overview available.'}
            </Typography>

            {movie.homepage && (
              <Button
                variant="contained"
                href={movie.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="homepage-button"
              >
                Official Website
              </Button>
            )}
          </Grid>
        </Grid>

        {trailerId && (
          <>
            <Divider className="trailer-divider" />
            <Typography variant="h5" gutterBottom>
              Trailer
            </Typography>
            <Box className="trailer-container">
              <YouTube
                videoId={trailerId}
                opts={{
                  width: '100%',
                  height: '100%',
                  playerVars: {
                    autoplay: 0,
                    modestbranding: 1,
                    rel: 0
                  }
                }}
                className="trailer-iframe"
              />
            </Box>
          </>
        )}
      </Box>
    </Container>
  );
};

export default MoviePage;