import React, { useState, useContext, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { MovieContext } from '../../context/MovieContext';
import { tmdb } from '../../services/tmdb';
import './MovieFilters.css';

const MovieFilters = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    genres: [],
    minYear: '',
    maxYear: '',
    rating: 0
  });
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const fetchGenresAndLoadFilters = async () => {
      try {
        const savedFilters = localStorage.getItem('movieFilters');
        if (savedFilters) {
          setFilters(JSON.parse(savedFilters));
        }
        const data = await tmdb.getGenres();
        setGenres(data.genres);
      } catch (err) {
        console.error('Error:', err);
      }
    };
    
    fetchGenresAndLoadFilters();
  }, []);

  const handleGenreChange = (e) => {
    const { value } = e.target;
    const genresArray = Array.isArray(value) ? value : [value].filter(Boolean);
    setFilters(prev => ({ ...prev, genres: genresArray }));
  };

  const handleYearChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (event, newValue) => {
    setFilters(prev => ({ ...prev, rating: newValue }));
  };

  const handleApply = () => {
    localStorage.setItem('movieFilters', JSON.stringify(filters));
    onFilter(filters);
  };

  const handleReset = () => {
    const resetFilters = {
      genres: [],
      minYear: '',
      maxYear: '',
      rating: 0
    };
    setFilters(resetFilters);
    localStorage.removeItem('movieFilters');
    onFilter(resetFilters);
  };

  const removeGenre = (genreIdToRemove) => {
    setFilters(prev => ({
      ...prev,
      genres: prev.genres.filter(id => id !== genreIdToRemove)
    }));
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  return (
    <Box className="filters-container">
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Filter Movies</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box className="filters-inner">
            <FormControl fullWidth>
              <InputLabel>Genres</InputLabel>
              <Select
                name="genres"
                multiple
                value={filters.genres}
                label="Genres"
                onChange={handleGenreChange}
                renderValue={(selected) => (
                  <Box className="genre-chip-container">
                    {selected.map((genreId) => {
                      const genre = genres.find(g => g.id === genreId);
                      return genre ? (
                        <Chip 
                          key={genreId} 
                          label={genre.name} 
                          onDelete={() => removeGenre(genreId)}
                          onMouseDown={(e) => e.stopPropagation()}
                        />
                      ) : null;
                    })}
                  </Box>
                )}
              >
                {genres.map(genre => (
                  <MenuItem key={genre.id} value={genre.id}>
                    {genre.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box className="year-filters">
              <FormControl fullWidth>
                <InputLabel>Min Year</InputLabel>
                <Select
                  name="minYear"
                  value={filters.minYear}
                  label="Min Year"
                  onChange={handleYearChange}
                >
                  <MenuItem value="">Any Year</MenuItem>
                  {years.map(year => (
                    <MenuItem key={`min-${year}`} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl fullWidth>
                <InputLabel>Max Year</InputLabel>
                <Select
                  name="maxYear"
                  value={filters.maxYear}
                  label="Max Year"
                  onChange={handleYearChange}
                >
                  <MenuItem value="">Any Year</MenuItem>
                  {years.map(year => (
                    <MenuItem key={`max-${year}`} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box>
              <Typography gutterBottom>
                Minimum Rating: {filters.rating}
              </Typography>
              <Slider
                value={filters.rating}
                onChange={handleRatingChange}
                aria-labelledby="rating-slider"
                min={0}
                max={10}
                step={0.5}
                valueLabelDisplay="auto"
              />
            </Box>

            <Box className="filter-buttons">
              <Button variant="contained" onClick={handleApply} fullWidth>
                Apply Filters
              </Button>
              <Button variant="outlined" onClick={handleReset} fullWidth>
                Reset
              </Button>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default MovieFilters;
