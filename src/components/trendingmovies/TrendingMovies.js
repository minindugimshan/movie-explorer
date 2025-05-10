// import React, { useContext, useEffect, useState } from 'react';
// import { MovieContext } from '../context/MovieContext';
// import MovieCard from './MovieCard';
// import { 
//   Box, 
//   Typography, 
//   ButtonGroup, 
//   Button, 
//   CircularProgress,
//   Alert,
//   Grid
// } from '@mui/material';

// const TrendingMovies = () => {
//   const { 
//     trending, 
//     fetchTrendingMovies, 
//     loading, 
//     error,
//     hasMore,
//     loadMore
//   } = useContext(MovieContext);
  
//   const [timeWindow, setTimeWindow] = useState('week');
//   const [page, setPage] = useState(1);

//   useEffect(() => {
//     fetchTrendingMovies(timeWindow);
//     setPage(1);
//   }, [timeWindow, fetchTrendingMovies]);

//   const handleLoadMore = () => {
//     setPage(prev => prev + 1);
//     loadMore();
//   };

//   if (error) {
//     return (
//       <Alert severity="error" sx={{ my: 2 }}>
//         Error loading trending movies: {error}
//       </Alert>
//     );
//   }

//   return (
//     <Box sx={{ my: 4 }}>
//       <Box sx={{ 
//         display: 'flex', 
//         justifyContent: 'space-between', 
//         alignItems: 'center',
//         mb: 3
//       }}>
//         <Typography variant="h4" component="h2">
//           Trending {timeWindow === 'day' ? 'Today' : 'This Week'}
//         </Typography>
//         <ButtonGroup size="small">
//           <Button
//             onClick={() => setTimeWindow('day')}
//             variant={timeWindow === 'day' ? 'contained' : 'outlined'}
//           >
//             Today
//           </Button>
//           <Button
//             onClick={() => setTimeWindow('week')}
//             variant={timeWindow === 'week' ? 'contained' : 'outlined'}
//           >
//             This Week
//           </Button>
//         </ButtonGroup>
//       </Box>

//       {loading && page === 1 ? (
//         <Box display="flex" justifyContent="center" my={4}>
//           <CircularProgress size={60} />
//         </Box>
//       ) : (
//         <>
//           <Grid container spacing={3}>
//             {trending.map((movie) => (
//               <Grid item key={movie.id} xs={12} sm={6} md={4} lg={3}>
//                 <MovieCard movie={movie} />
//               </Grid>
//             ))}
//           </Grid>

//           {hasMore && (
//             <Box display="flex" justifyContent="center" mt={4}>
//               <Button
//                 variant="outlined"
//                 onClick={handleLoadMore}
//                 disabled={loading}
//                 startIcon={loading && <CircularProgress size={20} />}
//               >
//                 Load More
//               </Button>
//             </Box>
//           )}
//         </>
//       )}
//     </Box>
//   );
// };

// export default TrendingMovies;

import React, { useContext, useEffect, useState } from 'react';
import { MovieContext } from '../../context/MovieContext';
import MovieCard from '../moviecard/MovieCard';
import {
  Box,
  Typography,
  ButtonGroup,
  Button,
  CircularProgress,
  Alert,
  Grid
} from '@mui/material';
import './TrendingMovies.css';

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
      <Alert severity="error" className="error-alert">
        Error loading trending movies: {error}
      </Alert>
    );
  }

  return (
    <Box className="trending-container">
      <Box className="trending-header">
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
        <Box className="loading-container">
          <CircularProgress size={60} />
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {trending.map((movie) => (
              <Grid item key={movie.id} xs={12} sm={6} md={4} lg={3}>
                <MovieCard movie={movie} />
              </Grid>
            ))}
          </Grid>

          {hasMore && (
            <Box className="load-more-container">
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
