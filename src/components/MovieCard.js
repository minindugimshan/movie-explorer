import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardMedia, CardContent, Typography, Rating, Box, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { MovieContext } from '../context/MovieContext';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const { favorites, addToFavorites, removeFromFavorites } = React.useContext(MovieContext);
  const isFavorite = favorites.some(fav => fav.id === movie.id);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (isFavorite) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie);
    }
  };

  return (
    <Card 
      sx={{ 
        maxWidth: 300, 
        m: 2, 
        cursor: 'pointer',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.05)'
        }
      }}
      onClick={() => navigate(`/movie/${movie.id}`)}
    >
      <CardMedia
        component="img"
        height="450"
        image={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/no-poster.jpg'}
        alt={movie.title}
      />
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" component="div" noWrap>
            {movie.title}
          </Typography>
          <IconButton onClick={handleFavoriteClick} aria-label="add to favorites">
            {isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
          </IconButton>
        </Box>
        <Box display="flex" justifyContent="space-between" mt={1}>
          <Typography variant="body2" color="text.secondary">
            {movie.release_date ? movie.release_date.substring(0, 4) : 'N/A'}
          </Typography>
          <Box display="flex" alignItems="center">
            <Rating 
              name="read-only" 
              value={movie.vote_average / 2} 
              precision={0.5} 
              readOnly 
              size="small"
            />
            <Typography variant="body2" ml={1}>
              {movie.vote_average.toFixed(1)}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MovieCard;