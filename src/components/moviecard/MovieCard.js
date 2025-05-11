import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardMedia,
  Box,
  IconButton,
  Tooltip,
  Typography,
  Rating
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { MovieContext } from '../../context/MovieContext';
import { tmdb } from '../../services/tmdb';
import './MovieCard.css';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const { favorites, addToFavorites, removeFromFavorites } = useContext(MovieContext);
  const isFavorite = favorites.some(fav => fav.id === movie.id);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    isFavorite ? removeFromFavorites(movie.id) : addToFavorites(movie);
  };

  return (
    <Card className="movie-card" onClick={() => navigate(`/movie/${movie.id}`)}>
      <Box className="movie-image-container">
        <CardMedia
          component="img"
          height="450"
          image={tmdb.getPosterUrl(movie.poster_path) || '/no-poster.jpg'}
          alt={movie.title}
          className="movie-poster"
        />
        <Box className="movie-hover-info">
          <Box className="movie-header">
            <Typography variant="h6" noWrap>
              {movie.title}
            </Typography>
            <Tooltip title={isFavorite ? "Remove from favorites" : "Add to favorites"}>
              <IconButton onClick={handleFavoriteClick} aria-label="favorite">
                {isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
              </IconButton>
            </Tooltip>
          </Box>
          <Box className="movie-info">
            <Typography variant="body2">
              {movie.release_date ? movie.release_date.substring(0, 4) : 'N/A'}
            </Typography>
            <Box display="flex" alignItems="center">
              <Rating
                name="movie-rating"
                value={movie.vote_average / 2}
                precision={0.5}
                readOnly
                size="small"
              />
              <Typography variant="body2" ml={1}>
                {movie.vote_average?.toFixed(1)}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

export default MovieCard;
