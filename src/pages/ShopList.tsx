import React, { useEffect, useState } from 'react';
import { 
    Typography, 
    Box, 
    CircularProgress,
    Alert,
    Grid
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ShopCard from '../components/ShopCard';
import UserInfo from '../components/UserInfo';
import { shopService } from '../services/shopService';
import type { ShopItem } from '../types/shop';

const ShopList: React.FC = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState<ShopItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            try {
                const response = await shopService.getShopList();
                setItems(response.list);
            } catch (err: any) {
                if (err.response?.status === 401) {
                    navigate('/login');
                } else {
                    setError('Failed to load shop list. Please try again.');
                }
                console.error('Error fetching shop list:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    const handleSearch = (item: ShopItem) => {
        navigate(`/search/${item.id}`);
    };

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh'
                }}
            >
                <CircularProgress color="primary" />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                width: '100vw',
                background: 'linear-gradient(135deg, #f0e6ff 0%, #ffffff 100%)',
                py: 4,
                px: 2
            }}
        >
            <Box sx={{ 
                position: 'fixed',
                top: 16,
                right: 16,
                zIndex: 1000
            }}>
                <UserInfo />
            </Box>

            <Grid container justifyContent="center" maxWidth="lg" sx={{ mx: 'auto' }}>
                <Grid item xs={12}>
                    <Typography 
                        variant="h4" 
                        component="h1" 
                        align="center"
                        sx={{ 
                            mb: 4,
                            color: 'primary.main',
                            fontWeight: 600
                        }}
                    >
                        Поиск товаров по фото
                    </Typography>

                    {error && (
                        <Alert 
                            severity="error" 
                            sx={{ 
                                mb: 3,
                                borderRadius: 2
                            }}
                        >
                            {error}
                        </Alert>
                    )}

                    {items
                        .filter(item => !item.locked)
                        .map((item) => (
                            <ShopCard 
                                key={item.id} 
                                item={item} 
                                onSearch={handleSearch}
                            />
                        ))}
                </Grid>
            </Grid>
        </Box>
    );
};

export default ShopList; 