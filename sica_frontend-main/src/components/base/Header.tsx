import React, { useState, useCallback } from 'react';
import { AppBar, Toolbar, IconButton, Box, Menu, MenuItem, CssBaseline, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import useAuthStore from '../../store/authStore';

interface HeaderProps {
  handleDrawerToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ handleDrawerToggle }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user, logout, setLogoutInitiated } = useAuthStore();

  const handleMenu = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    setLogoutInitiated(true);
  }, [logout, setLogoutInitiated]);

  return (
    <>
      <CssBaseline />
      <AppBar position="fixed" elevation={0} sx={{ zIndex: 1201, backgroundColor: '#FFFFFF' }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 10 }}>
            <img src="/logo.png" alt="Logotipo" style={{ height: 40, marginLeft: 45 }} />
          </Box>

          {user && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mr: 2 }}>
              <Typography variant="subtitle1" color="textPrimary" sx={{ color: '#000' }}>
                {user.name}dsd
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ color: '#000' }}>
                {user.role}
              </Typography>
            </Box>
          )}
          
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ marginRight: '36px', color: '#000' }} // Ajustar el color del ícono
          >
            <MenuIcon />
          </IconButton>
          <Box flexGrow={1} />
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mr: 2 }}>
              <Typography variant="subtitle1" color="textPrimary" sx={{ color: '#000' }}>
                John Doe
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ color: '#000' }}>
                Administrador
              </Typography>
            </Box>
            <IconButton onClick={handleMenu} color="inherit" sx={{ color: '#000' }}>
              <KeyboardArrowDownIcon />
            </IconButton>
          </Box>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;
