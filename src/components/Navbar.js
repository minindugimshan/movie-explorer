import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, Switch, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const Navbar = () => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Button color="inherit" component={Link} to="/">
            Movie Explorer
          </Button>
        </Typography>
        <Button color="inherit" component={Link} to="/favorites">
          Favorites
        </Button>
        <Box display="flex" alignItems="center" ml={2}>
          {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          <Switch checked={darkMode} onChange={toggleTheme} color="default" />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

// import React, { useContext } from 'react';
// import { Link } from 'react-router-dom';
// import { AppBar, Toolbar, Typography, Button, Box, Switch } from '@mui/material';
// import { ThemeContext } from '../context/ThemeContext';
// import Brightness4Icon from '@mui/icons-material/Brightness4';
// import Brightness7Icon from '@mui/icons-material/Brightness7';

// const Navbar = ({ isAuthenticated, onLogout }) => {
//   const { darkMode, toggleTheme } = useContext(ThemeContext);

//   return (
//     <AppBar position="static">
//       <Toolbar>
//         <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
//           <Button color="inherit" component={Link} to="/">
//             Movie Explorer
//           </Button>
//         </Typography>
        
//         {isAuthenticated ? (
//           <>
//             <Button color="inherit" component={Link} to="/favorites">
//               Favorites
//             </Button>
//             <Button color="inherit" onClick={onLogout}>
//               Logout
//             </Button>
//           </>
//         ) : (
//           <Button color="inherit" component={Link} to="/login">
//             Login
//           </Button>
//         )}
        
//         <Box display="flex" alignItems="center" ml={2}>
//           {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
//           <Switch checked={darkMode} onChange={toggleTheme} color="default" />
//         </Box>
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default Navbar;