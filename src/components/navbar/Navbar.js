import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, Switch, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import FavoriteIcon from '@mui/icons-material/Favorite';
import './Navbar.css';

const Navbar = () => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <AppBar position="static" color="primary" className="navbar-appbar">
      <Toolbar className="navbar-toolbar">
        <Typography variant="h6" component="div" className="navbar-title">
          <Button color="inherit" component={Link} to="/" className="navbar-brand-button">
            <img
              src={`${process.env.PUBLIC_URL}/favicon.svg`}
              alt="Movie Explorer Logo"
              className="navbar-logo"
              onError={(e) => {
                e.target.onerror = null;
                e.target.replaceWith(document.createTextNode('🎬'));
              }}
            />
            Movie Explorer
          </Button>
        </Typography>

        <Button
          color="inherit"
          component={Link}
          to="/favorites"
          startIcon={<FavoriteIcon />}
        >
          Favorites
        </Button>

        <Box className="navbar-theme-switch">
          {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          <Switch checked={darkMode} onChange={toggleTheme} color="default" />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
