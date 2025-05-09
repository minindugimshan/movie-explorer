import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { MovieProvider } from './context/MovieContext';
import { ThemeProvider, ThemeContext } from './context/ThemeContext';
import Home from './pages/Home';
import MoviePage from './pages/MoviePage';
import Favorites from './pages/Favorites';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <MovieProvider>
          <MuiThemeWrapper>
            <CssBaseline />
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/movie/:id" element={<MoviePage />} />
              <Route path="/favorites" element={<Favorites />} />
            </Routes>
          </MuiThemeWrapper>
        </MovieProvider>
      </ThemeProvider>
    </Router>
  );
}

const MuiThemeWrapper = ({ children }) => {
  const { darkMode } = React.useContext(ThemeContext);
  
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#3f51b5',
      },
      secondary: {
        main: '#f50057',
      },
    },
  });

  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
};

export default App;