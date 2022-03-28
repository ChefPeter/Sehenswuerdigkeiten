import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import "./styles/header.css";
import Dark_Mode from './dark_mode';
import Sidebar from "../components/Sidebar";
import LanguageSelector from './LanguageSelector';


export default function Header() {
const [anchorEl, setAnchorEl] = React.useState(null);
const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

const isMenuOpen = Boolean(anchorEl);

const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
};

const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
};


const menuId = 'primary-search-account-menu';
const renderMenu = (
    <Menu
    anchorEl={anchorEl}
    anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
    }}
    id={menuId}
    keepMounted
    transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
    }}
    open={isMenuOpen}
    onClose={handleMenuClose}
    >
    
    <MenuItem><Dark_Mode></Dark_Mode></MenuItem>

    <MenuItem><LanguageSelector></LanguageSelector></MenuItem>
    
    </Menu>
    
);

return (
    <Box sx={{ flexGrow: 1 }}>
    <AppBar position="static">
        <Toolbar>
        
        <Sidebar></Sidebar>
        <Typography
            id="headText"
            variant="h6"
            noWrap
            focusable="false"
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' } }}
        >
            City2Go
        </Typography>
        </Toolbar>
    </AppBar>
    
    {renderMenu}
    
    </Box>
);
}