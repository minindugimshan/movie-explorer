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
import { MovieContext } from '../context/MovieContext';
import { tmdb } from '../services/tmdb';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import YouTube from 'react-youtube';
import styles from './MoviePage.module.css';

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
        if (!id) {
          throw new Error('No movie ID provided');
        }

        console.log(`Fetching details for movie ID: ${id}`);
        setLocalLoading(true);
        setLocalError(null);

        const data = await getMovieDetails(id);
        
        if (isMounted) {
          if (!data) {
            throw new Error('No movie data received');
          }
          console.log('Received movie data:', data);
          setMovie(data);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching movie:', err);
          setLocalError(err.message || 'Failed to load movie details');
        }
      } finally {
        if (isMounted) {
          setLocalLoading(false);
        }
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
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
          <CircularProgress size={60} />
          <Typography variant="body1" ml={2}>
            Loading movie details...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
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
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Movie not found
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => navigate('/')}
        >
          Browse Movies
        </Button>
      </Container>
    );
  }

//   return (
//     <Container maxWidth="lg" className={styles.container}>
//       <Box sx={{ my: 4 }}>
//         <Button 
//           startIcon={<ArrowBackIcon />} 
//           onClick={() => navigate(-1)}
//           sx={{ mb: 2 }}
//           variant="outlined"
//         >
//           Back
//         </Button>

//         <Grid container spacing={4}>
//           <Grid item xs={12} md={4}>
//             <Paper elevation={3} sx={{ p: 2 }} className={styles.posterContainer}>
//               <img
//                 src={movie.poster_path 
//                   ? tmdb.getPosterUrl(movie.poster_path, 'w500') 
//                   : '/no-poster.jpg'
//                 }
//                 alt={movie.title} className={styles.posterImage}
//                 style={{ 
//                   width: '100%', 
//                   borderRadius: '8px',
//                   aspectRatio: '2/3',
//                   objectFit: 'cover'
//                 }}
//                 onError={(e) => {
//                   e.target.src = '/no-poster.jpg';
//                 }}
//               />
//               <Box display="flex" justifyContent="center" mt={2} className={styles.favoriteButton}>
//                 <Tooltip title={isFavorite ? "Remove from favorites" : "Add to favorites"}>
//                   <IconButton 
//                     onClick={handleFavoriteClick} 
//                     size="large"
//                     color={isFavorite ? "error" : "default"}
//                   >
//                     {isFavorite ? (
//                       <FavoriteIcon fontSize="large" />
//                     ) : (
//                       <FavoriteBorderIcon fontSize="large" />
//                     )}
//                   </IconButton>
//                 </Tooltip>
//               </Box>
//             </Paper>
//           </Grid>
//           <Grid item xs={12} md={8}>
//             <Box mb={2}>
//               <Box display="flex" alignItems="center" justifyContent="space-between">
//                 <Typography variant="h3" component="h1">
//                   {movie.title}
//                 </Typography>
//               </Box>
//               <Typography variant="subtitle1" color="text.secondary">
//                 {movie.release_date} • {movie.runtime} mins
//               </Typography>
//             </Box>

//             <Box display="flex" alignItems="center" mb={2}>
//               <Rating 
//                 value={movie.vote_average / 2} 
//                 precision={0.1} 
//                 readOnly 
//                 size="large"
//               />
//               <Typography variant="body1" ml={1}>
//                 {movie.vote_average.toFixed(1)} ({movie.vote_count} votes)
//               </Typography>
//             </Box>

//             <Box mb={3}>
//               {movie.genres?.map(genre => (
//                 <Chip 
//                   key={genre.id} 
//                   label={genre.name} 
//                   sx={{ mr: 1, mb: 1 }} 
//                   variant="outlined"
//                 />
//               ))}
//             </Box>

//             <Typography variant="h5" gutterBottom>Overview</Typography>
//             <Typography paragraph sx={{ mb: 3 }}>
//               {movie.overview || 'No overview available.'}
//             </Typography>

//             {movie.homepage && (
//               <Button 
//                 variant="contained" 
//                 href={movie.homepage} 
//                 target="_blank" 
//                 rel="noopener noreferrer"
//                 sx={{ mt: 2, mr: 2 }}
//               >
//                 Official Website
//               </Button>
//             )}
//           </Grid>
//         </Grid>

//         {trailerId && (
//           <>
//             <Divider sx={{ my: 4 }} />
//             <Typography variant="h5" gutterBottom>Trailer</Typography>
//             <Box sx={{ 
//               position: 'relative', 
//               paddingBottom: '56.25%',
//               height: 0,
//               overflow: 'hidden',
//               borderRadius: '8px',
//               my: 2
//             }}>
//               <YouTube
//                 videoId={trailerId}
//                 opts={{
//                   width: '100%',
//                   height: '100%',
//                   playerVars: {
//                     autoplay: 0,
//                     modestbranding: 1,
//                     rel: 0
//                   }
//                 }}
//                 style={{
//                   position: 'absolute',
//                   top: 0,
//                   left: 0,
//                   width: '100%',
//                   height: '100%'
//                 }}
//               />
//             </Box>
//           </>
//         )}
//       </Box>
//     </Container>
//   );
// };

// export default MoviePage;

 return (
    <Container maxWidth="lg" className={styles.container}>
      <Box>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate(-1)}
          className={styles.backButton}
          variant="outlined"
        >
          Back
        </Button>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} className={styles.posterContainer}>
              <img
                src={movie.poster_path 
                  ? tmdb.getPosterUrl(movie.poster_path, 'w500') 
                  : '/no-poster.jpg'
                }
                alt={movie.title}
                className={styles.posterImage}
                onError={(e) => {
                  e.target.src = '/no-poster.jpg';
                }}
              />
              <Box className={styles.favoriteButton}>
                <Tooltip title={isFavorite ? "Remove from favorites" : "Add to favorites"}>
                  <IconButton 
                    onClick={handleFavoriteClick} 
                    size="large"
                    color={isFavorite ? "error" : "default"}
                  >
                    {isFavorite ? (
                      <FavoriteIcon fontSize="large" />
                    ) : (
                      <FavoriteBorderIcon fontSize="large" />
                    )}
                  </IconButton>
                </Tooltip>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={8}>
            <Box className={styles.movieHeader}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="h3" component="h1">
                  {movie.title}
                </Typography>
              </Box>
              <Typography variant="subtitle1" color="text.secondary">
                {movie.release_date} • {movie.runtime} mins
              </Typography>
            </Box>

            <Box className={styles.ratingContainer}>
              <Rating 
                value={movie.vote_average / 2} 
                precision={0.1} 
                readOnly 
                size="large"
              />
              <Typography variant="body1" className={styles.ratingText}>
                {movie.vote_average.toFixed(1)} ({movie.vote_count} votes)
              </Typography>
            </Box>

            <Box className={styles.genresContainer}>
              {movie.genres?.map(genre => (
                <Chip 
                  key={genre.id} 
                  label={genre.name} 
                  sx={{ mr: 1, mb: 1 }} 
                  variant="outlined"
                />
              ))}
            </Box>

            <Typography variant="h5" className={styles.overviewTitle}>Overview</Typography>
            <Typography paragraph className={styles.overviewText}>
              {movie.overview || 'No overview available.'}
            </Typography>

            {movie.homepage && (
              <Button 
                variant="contained" 
                href={movie.homepage} 
                target="_blank" 
                rel="noopener noreferrer"
                sx={{ mt: 2, mr: 2 }}
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
            <Box className={styles.trailerContainer}>
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
                className={styles.trailerIframe}
              />
            </Box>
          </>
        )}
      </Box>
    </Container>
  );
};

export default MoviePage;