// import React, { useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { 
//   Card, 
//   CardMedia, 
//   CardContent, 
//   Typography, 
//   Rating, 
//   Box, 
//   IconButton,
//   Tooltip
// } from '@mui/material';
// import FavoriteIcon from '@mui/icons-material/Favorite';
// import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
// import { MovieContext } from '../context/MovieContext';
// import { tmdb } from '../services/tmdb';

// const MovieCard = ({ movie }) => {
//   const navigate = useNavigate();
//   const { favorites, addToFavorites, removeFromFavorites } = useContext(MovieContext);
//   const isFavorite = favorites.some(fav => fav.id === movie.id);

//   const handleFavoriteClick = (e) => {
//     e.stopPropagation();
//     if (isFavorite) {
//       removeFromFavorites(movie.id);
//     } else {
//       addToFavorites({
//         id: movie.id,
//         title: movie.title,
//         poster_path: movie.poster_path,
//         release_date: movie.release_date,
//         vote_average: movie.vote_average
//       });
//     }
//   };

//   return (
//     <Card 
//       sx={{ 
//         maxWidth: 300, 
//         m: 2, 
//         cursor: 'pointer',
//         transition: 'transform 0.2s',
//         '&:hover': {
//           transform: 'scale(1.05)',
//           boxShadow: 6
//         }
//       }}
//       onClick={() => navigate(`/movie/${movie.id}`)}
//     >
//       <CardMedia
//         component="img"
//         height="450"
//         image={tmdb.getPosterUrl(movie.poster_path) || '/no-poster.jpg'}
//         alt={movie.title}
//         sx={{ objectFit: 'cover' }}
//       />
//       <CardContent>
//         <Box display="flex" justifyContent="space-between" alignItems="center">
//           <Typography variant="h6" component="div" noWrap>
//             {movie.title}
//           </Typography>
//           <Tooltip title={isFavorite ? "Remove from favorites" : "Add to favorites"}>
//             <IconButton onClick={handleFavoriteClick} aria-label="favorite">
//               {isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
//             </IconButton>
//           </Tooltip>
//         </Box>
//         <Box display="flex" justifyContent="space-between" mt={1}>
//           <Typography variant="body2" color="text.secondary">
//             {movie.release_date ? movie.release_date.substring(0, 4) : 'N/A'}
//           </Typography>
//           <Box display="flex" alignItems="center">
//             <Rating 
//               name="movie-rating" 
//               value={movie.vote_average / 2} 
//               precision={0.5} 
//               readOnly 
//               size="small"
//             />
//             <Typography variant="body2" ml={1}>
//               {movie.vote_average?.toFixed(1)}
//             </Typography>
//           </Box>
//         </Box>
//       </CardContent>
//     </Card>
//   );
// };

// export default MovieCard;

import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Rating,
  Box,
  IconButton,
  Tooltip
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

  return (
    <Card className="movie-card" onClick={() => navigate(`/movie/${movie.id}`)}>
      <CardMedia
        component="img"
        height="450"
        image={tmdb.getPosterUrl(movie.poster_path) || '/no-poster.jpg'}
        alt={movie.title}
        className="movie-poster"
      />
      <CardContent>
        <Box className="movie-header">
          <Typography variant="h6" component="div" noWrap>
            {movie.title}
          </Typography>
          <Tooltip title={isFavorite ? "Remove from favorites" : "Add to favorites"}>
            <IconButton onClick={handleFavoriteClick} aria-label="favorite">
              {isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
            </IconButton>
          </Tooltip>
        </Box>
        <Box className="movie-info">
          <Typography variant="body2" color="text.secondary">
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
      </CardContent>
    </Card>
  );
};

export default MovieCard;
