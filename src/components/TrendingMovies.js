// import React, { useContext, useEffect } from 'react';
// import { MovieContext } from '../context/MovieContext';
// import MovieCard from './MovieCard';
// import { Box, Typography, Grid } from '@mui/material';
// import { ButtonGroup, Button } from '@mui/material';

// const TrendingMovies = () => {
//   const { trending, fetchTrendingMovies, loading, error } = useContext(MovieContext);

//   useEffect(() => {
//     fetchTrendingMovies();
//   }, [fetchTrendingMovies]);

//   if (loading) return <div>Loading trending movies...</div>;
//   if (error) return <div>Error: {error}</div>;

  
//   return (
//     <Box sx={{ mt: 4 }}>
//       <Typography variant="h4" gutterBottom>
//         Trending This Week
//       </Typography>
//       <Grid container spacing={2}>
//         {trending.map((movie) => (
//           <Grid item key={movie.id} xs={12} sm={6} md={4} lg={3}>
//             <MovieCard movie={movie} />
//           </Grid>
//         ))}
//       </Grid>
//     </Box>
//   );
// };

// export default TrendingMovies;


import React, { useContext, useEffect, useState } from 'react';
import { MovieContext } from '../context/MovieContext';
import MovieCard from './MovieCard';
import { 
  Box, 
  Typography, 
  ButtonGroup, 
  Button, 
  CircularProgress,
  Alert,
  IconButton
} from '@mui/material';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 1536 },
    items: 6,
    partialVisibilityGutter: 40
  },
  desktop: {
    breakpoint: { max: 1536, min: 1024 },
    items: 5,
    partialVisibilityGutter: 30
  },
  tablet: {
    breakpoint: { max: 1024, min: 600 },
    items: 3,
    partialVisibilityGutter: 20
  },
  mobile: {
    breakpoint: { max: 600, min: 0 },
    items: 2,
    partialVisibilityGutter: 10
  }
};

const CustomArrow = ({ onClick, direction }) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: 'absolute',
      zIndex: 1,
      top: '50%',
      transform: 'translateY(-50%)',
      backgroundColor: 'background.paper',
      boxShadow: 3,
      [direction === 'left' ? 'left' : 'right']: 0,
      '&:hover': {
        backgroundColor: 'action.hover'
      }
    }}
  >
    {direction === 'left' ? <ArrowBackIosNewIcon /> : <ArrowForwardIosIcon />}
  </IconButton>
);

const TrendingMovies = () => {
  const { 
    trending, 
    fetchTrendingMovies, 
    loading, 
    error,
    hasMore,
    loadMore
  } = useContext(MovieContext);
  
  const [timeWindow, setTimeWindow] = useState('week');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchTrendingMovies(timeWindow);
    setPage(1);
  }, [timeWindow, fetchTrendingMovies]);

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
    loadMore();
  };

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        Error loading trending movies: {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ my: 4 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3
      }}>
        <Typography variant="h4" component="h2">
          Trending {timeWindow === 'day' ? 'Today' : 'This Week'}
        </Typography>
        <ButtonGroup size="small">
          <Button
            onClick={() => setTimeWindow('day')}
            variant={timeWindow === 'day' ? 'contained' : 'outlined'}
          >
            Today
          </Button>
          <Button
            onClick={() => setTimeWindow('week')}
            variant={timeWindow === 'week' ? 'contained' : 'outlined'}
          >
            This Week
          </Button>
        </ButtonGroup>
      </Box>

      {loading && page === 1 ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress size={60} />
        </Box>
      ) : (
        <>
          <Box sx={{ position: 'relative' }}>
            <Carousel
              responsive={responsive}
              infinite={false}
              partialVisible
              customLeftArrow={<CustomArrow direction="left" />}
              customRightArrow={<CustomArrow direction="right" />}
              itemClass="carousel-item"
              containerClass="carousel-container"
            >
              {trending.map((movie) => (
                <Box key={movie.id} sx={{ px: 1 }}>
                  <MovieCard movie={movie} />
                </Box>
              ))}
            </Carousel>
          </Box>

          {hasMore && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Button
                variant="outlined"
                onClick={handleLoadMore}
                disabled={loading}
                startIcon={loading && <CircularProgress size={20} />}
              >
                Load More
              </Button>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default TrendingMovies;