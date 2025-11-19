import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import './LogoMenu.css';

const LogoMenu: React.FC = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar position="static" style={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
            <Toolbar style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* Logo */}
                <Typography variant="h6">
                    <img src="/logo.png" alt="Logo" className="logo" />

                </Typography>

                {/* Menu */}
                <IconButton edge="end" onClick={handleMenuClick}>
                    <MenuIcon />
                </IconButton>
                <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
                    <MenuItem onClick={handleMenuClose}>Impressum</MenuItem>
                    <MenuItem onClick={handleMenuClose}>Einloggen</MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

export default LogoMenu;
