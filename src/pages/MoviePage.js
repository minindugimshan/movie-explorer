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
  IconButton
} from '@mui/material';
import { MovieContext } from '../context/MovieContext';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import YouTube from 'react-youtube';

const MoviePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { favorites, addToFavorites, removeFromFavorites, getMovieDetails } = useContext(MovieContext);
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isFavorite = favorites.some(fav => fav.id === Number(id));

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        const data = await getMovieDetails(id);
        setMovie(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id, getMovieDetails]);

  const handleFavoriteClick = () => {
    if (isFavorite) {
      removeFromFavorites(Number(id));
    } else if (movie) {
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
    if (!movie || !movie.videos || !movie.videos.results) return null;
    const trailer = movie.videos.results.find(vid => vid.type === 'Trailer');
    return trailer ? trailer.key : null;
  };

  const trailerId = getTrailerId();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!movie) {
    return (
      <Container>
        <Alert severity="warning">Movie not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Back
        </Button>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : '/no-poster.jpg'
                }
                alt={movie.title}
                style={{ width: '100%', borderRadius: '8px' }}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={8}>
            <Box mb={2}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="h3" component="h1">
                  {movie.title}
                </Typography>
                <IconButton onClick={handleFavoriteClick} size="large">
                  {isFavorite ? (
                    <FavoriteIcon color="error" fontSize="large" />
                  ) : (
                    <FavoriteBorderIcon fontSize="large" />
                  )}
                </IconButton>
              </Box>
              <Typography variant="subtitle1" color="text.secondary">
                {movie.release_date} • {movie.runtime} mins
              </Typography>
            </Box>

            <Box display="flex" alignItems="center" mb={2}>
              <Rating 
                value={movie.vote_average / 2} 
                precision={0.1} 
                readOnly 
                size="large"
              />
              <Typography variant="body1" ml={1}>
                {movie.vote_average.toFixed(1)} ({movie.vote_count} votes)
              </Typography>
            </Box>

            <Box mb={3}>
              {movie.genres && movie.genres.map(genre => (
                <Chip 
                  key={genre.id} 
                  label={genre.name} 
                  sx={{ mr: 1, mb: 1 }} 
                />
              ))}
            </Box>

            <Typography variant="h5" gutterBottom>Overview</Typography>
            <Typography paragraph>{movie.overview}</Typography>

            {movie.homepage && (
              <Button 
                variant="contained" 
                href={movie.homepage} 
                target="_blank" 
                rel="noopener noreferrer"
                sx={{ mt: 2 }}
              >
                Official Website
              </Button>
            )}
          </Grid>
        </Grid>

        {trailerId && (
          <>
            <Divider sx={{ my: 4 }} />
            <Typography variant="h5" gutterBottom>Trailer</Typography>
            <Box sx={{ 
              position: 'relative', 
              paddingBottom: '56.25%', // 16:9 aspect ratio
              height: 0,
              overflow: 'hidden',
              borderRadius: '8px',
              my: 2
            }}>
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
                containerClassName="youtube-container"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%'
                }}
              />
            </Box>
          </>
        )}
      </Box>
    </Container>
  );
};

export default MoviePage;