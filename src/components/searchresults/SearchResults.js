import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Chip,
  Alert,
  Button,
  CircularProgress
} from '@mui/material';
import MovieCard from '../moviecard/MovieCard';
import { useInView } from 'react-intersection-observer';

const SearchResults = ({ 
  movies, 
  showFilters, 
  hasMore, 
  loading, 
  lastSearch,
  onLoadMore,
  error
}) => {
  const [ref, inView] = useInView();

  React.useEffect(() => {
    if (inView && hasMore && !loading && movies.length > 0) {
      onLoadMore?.();
    }
  }, [inView, hasMore, loading, onLoadMore, movies.length]);

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        {showFilters ? 'Filtered Results' : `Search Results for "${lastSearch}"`}
        {showFilters && (
          <Chip 
            label="Filters Applied" 
            color="primary" 
            size="small" 
            sx={{ ml: 2, verticalAlign: 'middle' }} 
          />
        )}
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {movies.length === 0 ? (
        <Alert severity="info">
          {showFilters 
            ? 'No movies match your filters' 
            : 'No results found. Try a different search.'}
        </Alert>
      ) : (
        <>
          <Grid container spacing={3}>
            {movies.map((movie, index) => (
              <Grid 
                item 
                key={`${movie.id}-${index}`} 
                xs={12} 
                sm={6} 
                md={4} 
                lg={3}
                ref={index === movies.length - 1 ? ref : null}
              >
                <MovieCard movie={movie} />
              </Grid>
            ))}
          </Grid>

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {!hasMore && movies.length > 0 && (
            <Typography align="center" sx={{ mt: 3, color: 'text.secondary' }}>
              You've reached the end of results
            </Typography>
          )}

          {hasMore && !loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button 
                variant="outlined" 
                onClick={onLoadMore}
                disabled={loading}
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

export default SearchResults;