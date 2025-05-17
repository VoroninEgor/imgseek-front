import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemText,
    CircularProgress
} from '@mui/material';
import { useLocation } from 'react-router-dom';

const CallbackPage: React.FC = () => {
    const location = useLocation();
    const [productIds, setProductIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get the product IDs from the URL search params
        const searchParams = new URLSearchParams(location.search);
        const ids = searchParams.get('ids');
        if (ids) {
            try {
                const parsedIds = JSON.parse(decodeURIComponent(ids));
                if (Array.isArray(parsedIds)) {
                    setProductIds(parsedIds);
                }
            } catch (e) {
                console.error('Failed to parse product IDs:', e);
            }
        }
        setLoading(false);
    }, [location.search]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                width: '100vw',
                background: 'linear-gradient(135deg, #ffebee 0%, #ffffff 100%)',
                py: 4,
                px: 2
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    maxWidth: 600,
                    mx: 'auto',
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 2
                }}
            >
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                        color: 'primary.main',
                        fontWeight: 600,
                        mb: 3
                    }}
                >
                    Найденные товары
                </Typography>

                {productIds.length > 0 ? (
                    <List>
                        {productIds.map((id, index) => (
                            <ListItem
                                key={id}
                                sx={{
                                    bgcolor: 'background.paper',
                                    mb: 1,
                                    borderRadius: 1,
                                    '&:hover': {
                                        bgcolor: 'action.hover'
                                    }
                                }}
                            >
                                <ListItemText
                                    primary={`Товар ${index + 1}`}
                                    secondary={`ID: ${id}`}
                                />
                            </ListItem>
                        ))}
                    </List>
                ) : (
                    <Typography variant="body1" color="text.secondary">
                        Товары не найдены
                    </Typography>
                )}
            </Paper>
        </Box>
    );
};

export default CallbackPage; 