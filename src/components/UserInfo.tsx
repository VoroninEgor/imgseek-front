import React from 'react';
import { Box, Typography, Button, Avatar, IconButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useNavigate, useLocation } from 'react-router-dom';

const UserInfo: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const username = localStorage.getItem('username');
    const roles = localStorage.getItem('roles');
    const isAdmin = roles?.includes('ROLE_ADMIN');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('roles');
        navigate('/login');
    };

    const handleToggleView = () => {
        if (location.pathname === '/admin') {
            navigate('/shop');
        } else {
            navigate('/admin');
        }
    };

    return (
        <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            p: 1,
            borderRadius: 2,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0px 2px 8px rgba(0,0,0,0.1)'
        }}>
            <Avatar 
                sx={{ 
                    bgcolor: 'primary.main',
                    width: 32,
                    height: 32,
                    fontSize: '1rem'
                }}
            >
                {username?.[0]?.toUpperCase()}
            </Avatar>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                {username}
            </Typography>
            {isAdmin && (
                <IconButton
                    onClick={handleToggleView}
                    size="small"
                    sx={{
                        color: 'primary.main',
                        '&:hover': {
                            backgroundColor: 'rgba(211, 47, 47, 0.04)'
                        }
                    }}
                >
                    {location.pathname === '/admin' ? <StorefrontIcon /> : <AdminPanelSettingsIcon />}
                </IconButton>
            )}
            <Button
                variant="outlined"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                size="small"
                sx={{
                    color: 'primary.main',
                    borderColor: 'primary.main',
                    '&:hover': {
                        borderColor: 'primary.dark',
                        backgroundColor: 'rgba(211, 47, 47, 0.04)'
                    }
                }}
            >
                Выйти
            </Button>
        </Box>
    );
};

export default UserInfo; 