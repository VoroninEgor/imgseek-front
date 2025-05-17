import React from 'react';
import { Card, CardContent, Typography, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import type { ShopItem } from '../types/shop';

interface ShopCardProps {
    item: ShopItem;
    onSearch: (item: ShopItem) => void;
}

const ShopCard: React.FC<ShopCardProps> = ({ item, onSearch }) => {
    return (
        <Card 
            sx={{ 
                mb: 2,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3
                }
            }}
        >
            <CardContent sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                p: 2
            }}>
                <Typography 
                    variant="h6" 
                    component="h2"
                    sx={{ 
                        color: 'primary.main',
                        fontWeight: 600,
                        fontSize: '1.25rem'
                    }}
                >
                    {item.name}
                </Typography>
                <IconButton 
                    onClick={() => onSearch(item)}
                    sx={{ 
                        color: 'primary.main',
                        '&:hover': {
                            backgroundColor: 'primary.light',
                            color: 'white'
                        }
                    }}
                >
                    <SearchIcon />
                </IconButton>
            </CardContent>
        </Card>
    );
};

export default ShopCard; 