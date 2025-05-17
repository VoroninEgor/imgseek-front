import React, { useState, useRef } from 'react';
import {
    Box,
    Typography,
    Grid,
    Paper,
    Button,
    CircularProgress,
    Alert,
    IconButton,
    Link
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { shopService } from '../services/shopService';
import type { SearchResult } from '../types/shop';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const API_URL = '';

const SearchPage: React.FC = () => {
    const navigate = useNavigate();
    const { shopId } = useParams<{ shopId: string }>();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [results, setResults] = useState<SearchResult[]>([]);
    const [callbackUrl, setCallbackUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSearch = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!selectedFile) return;

        console.log('Нажата кнопка "Найти похожие товары"');
        setLoading(true);
        setError(null);
        setResults([]);
        setCallbackUrl(null);

        try {
            const s3Config = await shopService.getShopS3Config(Number(shopId));
            setCallbackUrl(s3Config.callback);

            const searchResults = await shopService.searchInShop(Number(shopId), selectedFile);
            setResults(searchResults);

            // Отправляем POST запрос на коллбэк с найденными ID товаров
            const productIds = searchResults.map(result => result.product_id);
            const token = localStorage.getItem('token');
            await fetch('/api/callback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(productIds)
            });

            // После успешного POST запроса перенаправляем на страницу с ID товаров
            navigate(`/callback?ids=${encodeURIComponent(JSON.stringify(productIds))}`);
        } catch (err: any) {
            if (err.response?.status === 404) {
                setError('S3 configuration not found for this shop. Please configure S3 settings in admin panel.');
            } else {
                setError('Failed to search products. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

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
            <Grid container component="div" justifyContent="center" maxWidth="lg" sx={{ mx: 'auto' }}>
                <Grid item component="div" xs={12}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            mb: 4,
                            background: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: 2
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <IconButton
                                onClick={() => navigate('/shop')}
                                sx={{ mr: 2 }}
                            >
                                <ArrowBackIcon />
                            </IconButton>
                            <Typography
                                variant="h4"
                                component="h1"
                                sx={{
                                    color: 'primary.main',
                                    fontWeight: 600
                                }}
                            >
                                Поиск по фото
                            </Typography>
                        </Box>

                        {error && (
                            <Alert
                                severity="error"
                                sx={{ mb: 3, borderRadius: 2 }}
                                onClose={() => setError(null)}
                            >
                                {error}
                            </Alert>
                        )}

                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 3
                            }}
                        >
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                style={{ display: 'none' }}
                                ref={fileInputRef}
                            />

                            {previewUrl ? (
                                <Box
                                    sx={{
                                        width: '100%',
                                        maxWidth: 400,
                                        height: 300,
                                        position: 'relative',
                                        borderRadius: 2,
                                        overflow: 'hidden'
                                    }}
                                >
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                    <Button
                                        variant="contained"
                                        startIcon={<CloudUploadIcon />}
                                        onClick={() => fileInputRef.current?.click()}
                                        sx={{
                                            position: 'absolute',
                                            bottom: 16,
                                            right: 16,
                                            background: 'rgba(255, 255, 255, 0.9)',
                                            color: 'primary.main',
                                            '&:hover': {
                                                background: 'rgba(255, 255, 255, 1)'
                                            }
                                        }}
                                    >
                                        Изменить фото
                                    </Button>
                                </Box>
                            ) : (
                                <Button
                                    variant="outlined"
                                    startIcon={<CloudUploadIcon />}
                                    onClick={() => fileInputRef.current?.click()}
                                    sx={{
                                        width: '100%',
                                        maxWidth: 400,
                                        height: 300,
                                        border: '2px dashed',
                                        borderColor: 'primary.main',
                                        borderRadius: 2,
                                        '&:hover': {
                                            borderColor: 'primary.dark',
                                            backgroundColor: 'rgba(211, 47, 47, 0.04)'
                                        }
                                    }}
                                >
                                    Загрузить фото
                                </Button>
                            )}

                            <Button
                                variant="contained"
                                startIcon={<SearchIcon />}
                                onClick={handleSearch}
                                disabled={!selectedFile || loading}
                                sx={{
                                    px: 4,
                                    py: 1.5,
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontSize: '1.1rem',
                                    fontWeight: 600
                                }}
                            >
                                {loading ? 'Поиск...' : 'Найти похожие товары'}
                            </Button>
                        </Box>

                        {loading && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                <CircularProgress color="primary" />
                            </Box>
                        )}

                        {results.length > 0 && callbackUrl && (
                            <Box sx={{ mt: 4, p: 2, bgcolor: 'primary.light', borderRadius: 2 }}>
                                <Typography variant="body1" color="white">
                                    Поиск по адресу{' '}
                                    <Link href={callbackUrl} color="inherit" target="_blank" rel="noopener">
                                        {callbackUrl}
                                    </Link>
                                    {' '}товаров: {results.map(r => r.product_id).join(', ')}
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default SearchPage; 