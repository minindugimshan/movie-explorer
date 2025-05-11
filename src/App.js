import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { MovieProvider } from './context/MovieContext';
import { ThemeProvider, ThemeContext } from './context/ThemeContext';
import { AuthContext, AuthProvider } from './context/AuthContext';
import Home from './pages/home/Home';
import MoviePage from './pages/moviepage/MoviePage';
import Favorites from './pages/favorites/Favorites';
import Login from './pages/login/Login';
import Navbar from './components/navbar/Navbar';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <MovieProvider>
            <MuiThemeWrapper>
              <CssBaseline />
              <Navbar />
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                <Route path="/movie/:id" element={<ProtectedRoute><MoviePage /></ProtectedRoute>} />
                <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </MuiThemeWrapper>
          </MovieProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
};

// Component to handle protected routes
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext); // Added React import via useContext
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Component to handle login page redirection if already authenticated
const LoginPage = () => {
  const { isAuthenticated } = useContext(AuthContext); // Added React import via useContext
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Login />;
};

// Component to wrap Material-UI theme
const MuiThemeWrapper = ({ children }) => {
  const { darkMode } = useContext(ThemeContext); // Added React import via useContext
  
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
    typography: {
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
    },
  });

  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
};

export default App;