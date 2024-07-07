import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Switch from '@mui/material/Switch';
import { Link, useLocation } from 'react-router-dom';
import LightModeIcon from '@mui/icons-material/LightMode';

interface NavbarProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isDarkMode, toggleDarkMode }) => {
  const location = useLocation();

  return (
    <AppBar position="static">
      <Toolbar
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <Button
            color="inherit"
            component={Link}
            to="/"
            style={{ marginRight: 16 }}
            variant={location.pathname === '/' ? 'outlined' : 'text'}
          >
            Catalog
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/orders"
            style={{ marginRight: 16 }}
            variant={location.pathname === '/orders' ? 'outlined' : 'text'}
          >
            Orders
          </Button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <IconButton color="inherit">
            <LightModeIcon />
          </IconButton>
          <Switch
            checked={isDarkMode}
            onChange={toggleDarkMode}
            color="default"
          />
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
