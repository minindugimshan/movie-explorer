// import React, { useState, useContext, useEffect, useCallback } from 'react';
// import { 
//   Box, 
//   Container, 
//   Typography, 
//   Grid, 
//   TextField, 
//   Button, 
//   CircularProgress, 
//   Alert,
//   ButtonGroup
// } from '@mui/material';
// import MovieCard from '../components/MovieCard';
// import { MovieContext } from '../context/MovieContext';
// import Carousel from 'react-multi-carousel';
// import 'react-multi-carousel/lib/styles.css';
// import { useInView } from 'react-intersection-observer';

// const responsive = {
//   superLargeDesktop: {
//     breakpoint: { max: 4000, min: 1536 },
//     items: 6,
//   },
//   desktop: {
//     breakpoint: { max: 1536, min: 1024 },
//     items: 5,
//   },
//   tablet: {
//     breakpoint: { max: 1024, min: 600 },
//     items: 3,
//   },
//   mobile: {
//     breakpoint: { max: 600, min: 0 },
//     items: 2,
//   }
// };

// const Home = () => {
//   const { 
//     movies, 
//     trending, 
//     loading, 
//     error, 
//     hasMore, 
//     lastSearch, 
//     searchMovies,
//     fetchTrendingMovies
//   } = useContext(MovieContext);
  
//   const [searchQuery, setSearchQuery] = useState('');
//   const [timeWindow, setTimeWindow] = useState('week');
//   const [ref, inView] = useInView();

//   // Infinite scroll effect
//   useEffect(() => {
//     if (inView && hasMore && !loading && movies.length > 0) {
//       searchMovies(lastSearch, false);
//     }
//   }, [inView, hasMore, loading, lastSearch, searchMovies, movies.length]);

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       searchMovies(searchQuery);
//     }
//   };

//   const handleTimeWindowChange = (window) => {
//     setTimeWindow(window);
//     fetchTrendingMovies(window);
//   };

//   return (
//     <Container maxWidth="xl" sx={{ py: 4 }}>
//       {/* Search Section */}
//       <Box sx={{ mb: 6 }}>
//         <form onSubmit={handleSearch}>
//           <Box display="flex" alignItems="center">
//             <TextField
//               fullWidth
//               variant="outlined"
//               label="Search for movies"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               sx={{ mr: 2 }}
//             />
//             <Button 
//               type="submit" 
//               variant="contained" 
//               size="large"
//               disabled={loading}
//               sx={{ height: '56px' }}
//             >
//               {loading ? <CircularProgress size={24} /> : 'Search'}
//             </Button>
//           </Box>
//         </form>
//       </Box>

//       {error && (
//         <Alert severity="error" sx={{ mb: 4 }}>
//           {error}
//         </Alert>
//       )}

//       {/* Search Results or Trending Movies */}
//       {movies.length > 0 ? (
//         <>
//           <Typography variant="h4" component="h2" gutterBottom>
//             Search Results for "{lastSearch}"
//           </Typography>
//           <Grid container spacing={3}>
//             {movies.map((movie, index) => (
//               <Grid 
//                 item 
//                 key={`${movie.id}-${index}`} 
//                 xs={12} sm={6} md={4} lg={3}
//                 ref={index === movies.length - 1 ? ref : null} // Attach ref to last item
//               >
//                 <MovieCard movie={movie} />
//               </Grid>
//             ))}
//           </Grid>
//           {loading && (
//             <Box display="flex" justifyContent="center" my={4}>
//               <CircularProgress />
//             </Box>
//           )}
//           {!hasMore && movies.length > 0 && (
//             <Typography align="center" sx={{ my: 4 }}>
//               No more results to show
//             </Typography>
//           )}
//         </>
//       ) : (
//         <>
//           <Box sx={{ 
//             display: 'flex', 
//             justifyContent: 'space-between', 
//             alignItems: 'center',
//             mb: 3
//           }}>
//             <Typography variant="h4" component="h2">
//               Trending {timeWindow === 'day' ? 'Today' : 'This Week'}
//             </Typography>
//             <ButtonGroup size="small">
//               <Button
//                 onClick={() => handleTimeWindowChange('day')}
//                 variant={timeWindow === 'day' ? 'contained' : 'outlined'}
//               >
//                 Today
//               </Button>
//               <Button
//                 onClick={() => handleTimeWindowChange('week')}
//                 variant={timeWindow === 'week' ? 'contained' : 'outlined'}
//               >
//                 This Week
//               </Button>
//             </ButtonGroup>
//           </Box>

//           {loading && movies.length === 0 ? (
//             <Box display="flex" justifyContent="center" my={4}>
//               <CircularProgress size={60} />
//             </Box>
//           ) : (
//             <Box sx={{ position: 'relative', mb: 4 }}>
//               <Carousel
//                 responsive={responsive}
//                 infinite
//                 autoPlay={false}
//                 itemClass="carousel-item"
//                 containerClass="carousel-container"
//               >
//                 {trending.map((movie) => (
//                   <Box key={movie.id} sx={{ px: 1 }}>
//                     <MovieCard movie={movie} />
//                   </Box>
//                 ))}
//               </Carousel>
//             </Box>
//           )}
//         </>
//       )}
//     </Container>
//   );
// };

// export default Home;

import React, { useState, useContext, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  TextField, 
  Button, 
  CircularProgress, 
  Alert,
  ButtonGroup
} from '@mui/material';
import MovieCard from '../components/MovieCard';
import { MovieContext } from '../context/MovieContext';
import { useInView } from 'react-intersection-observer';

const Home = () => {
  const { 
    movies, 
    trending, 
    loading, 
    error, 
    hasMore, 
    lastSearch, 
    searchMovies,
    fetchTrendingMovies
  } = useContext(MovieContext);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [timeWindow, setTimeWindow] = useState('week');
  const [ref, inView] = useInView();

  // Infinite scroll effect
  useEffect(() => {
    if (inView && hasMore && !loading && movies.length > 0) {
      searchMovies(lastSearch, false);
    }
  }, [inView, hasMore, loading, lastSearch, searchMovies, movies.length]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchMovies(searchQuery);
    }
  };

  const handleTimeWindowChange = (window) => {
    setTimeWindow(window);
    fetchTrendingMovies(window);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Search Section */}
      <Box sx={{ mb: 6 }}>
        <form onSubmit={handleSearch}>
          <Box display="flex" alignItems="center">
            <TextField
              fullWidth
              variant="outlined"
              label="Search for movies"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ mr: 2 }}
            />
            <Button 
              type="submit" 
              variant="contained" 
              size="large"
              disabled={loading}
              sx={{ height: '56px' }}
            >
              {loading ? <CircularProgress size={24} /> : 'Search'}
            </Button>
          </Box>
        </form>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {/* Search Results or Trending Movies */}
      {movies.length > 0 ? (
        <>
          <Typography variant="h4" component="h2" gutterBottom>
            Search Results for "{lastSearch}"
          </Typography>
          <Grid container spacing={3}>
            {movies.map((movie, index) => (
              <Grid 
                item 
                key={`${movie.id}-${index}`} 
                xs={12} sm={6} md={4} lg={3}
                ref={index === movies.length - 1 ? ref : null}
              >
                <MovieCard movie={movie} />
              </Grid>
            ))}
          </Grid>
          {loading && (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          )}
          {!hasMore && movies.length > 0 && (
            <Typography align="center" sx={{ my: 4 }}>
              You've reached the end of results
            </Typography>
          )}
        </>
      ) : (
        <>
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
                onClick={() => handleTimeWindowChange('day')}
                variant={timeWindow === 'day' ? 'contained' : 'outlined'}
              >
                Today
              </Button>
              <Button
                onClick={() => handleTimeWindowChange('week')}
                variant={timeWindow === 'week' ? 'contained' : 'outlined'}
              >
                This Week
              </Button>
            </ButtonGroup>
          </Box>

          {loading && movies.length === 0 ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress size={60} />
            </Box>
          ) : (
            <Grid container spacing={3}>
              {trending.map((movie) => (
                <Grid item key={movie.id} xs={12} sm={6} md={4} lg={3}>
                  <MovieCard movie={movie} />
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}
    </Container>
  );
};

export default Home;