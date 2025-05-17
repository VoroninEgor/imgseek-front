import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    Paper,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Alert,
    CircularProgress,
    Container,
    Tooltip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import { shopService } from '../services/shopService';
import type { ShopItem, CreateShopRequest, UpdateShopRequest, ConfigureImagesSourceRequest } from '../types/shop';
import UserInfo from '../components/UserInfo';

const AdminPanel: React.FC = () => {
    const navigate = useNavigate();
    const [shops, setShops] = useState<ShopItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [openDialog, setOpenDialog] = useState(false);
    const [editingShop, setEditingShop] = useState<ShopItem | null>(null);
    const [formData, setFormData] = useState<CreateShopRequest>({
        name: '',
        callback: ''
    });
    const [openImageSourceDialog, setOpenImageSourceDialog] = useState(false);
    const [selectedShop, setSelectedShop] = useState<ShopItem | null>(null);
    const [imageSourceData, setImageSourceData] = useState<Omit<ConfigureImagesSourceRequest, 'shopId'>>({
        s3Url: '',
        s3Key: '',
        s3SecretKey: '',
        s3Bucket: ''
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        const roles = localStorage.getItem('roles');
        
        if (!token || !roles?.includes('ROLE_ADMIN')) {
            navigate('/login');
            return;
        }

        fetchShops();
    }, [navigate]);

    const fetchShops = async () => {
        try {
            const response = await shopService.getShopList();
            setShops(response.list);
        } catch (err: any) {
            if (err.response?.status === 401) {
                navigate('/login');
            } else {
                setError('Failed to load shops. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (shop?: ShopItem) => {
        if (shop) {
            setEditingShop(shop);
            setFormData({
                name: shop.name,
                callback: shop.callback || ''
            });
        } else {
            setEditingShop(null);
            setFormData({
                name: '',
                callback: ''
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingShop(null);
        setFormData({
            name: '',
            callback: ''
        });
    };

    const handleSubmit = async () => {
        try {
            if (editingShop) {
                await shopService.updateShop(editingShop.id, formData);
            } else {
                await shopService.createShop(formData);
            }
            handleCloseDialog();
            fetchShops();
        } catch (err: any) {
            setError('Operation failed. Please try again.');
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this shop?')) {
            try {
                await shopService.deleteShop(id);
                fetchShops();
            } catch (err: any) {
                setError('Failed to delete shop. Please try again.');
            }
        }
    };

    const handleOpenImageSourceDialog = (shop: ShopItem) => {
        setSelectedShop(shop);
        setOpenImageSourceDialog(true);
    };

    const handleCloseImageSourceDialog = () => {
        setOpenImageSourceDialog(false);
        setSelectedShop(null);
        setImageSourceData({
            s3Url: '',
            s3Key: '',
            s3SecretKey: '',
            s3Bucket: ''
        });
    };

    const handleImageSourceSubmit = async () => {
        if (!selectedShop) return;

        try {
            await shopService.configureImagesSource({
                shopId: selectedShop.id,
                ...imageSourceData
            });
            handleCloseImageSourceDialog();
            fetchShops();
        } catch (err: any) {
            setError('Failed to configure image source. Please try again.');
        }
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
                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: 2
                        }}>
                            <Typography
                                variant="h4"
                                component="h1"
                                sx={{
                                    color: 'primary.main',
                                    fontWeight: 600
                                }}
                            >
                                Админка
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => handleOpenDialog()}
                                sx={{
                                    px: 3,
                                    py: 1,
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    boxShadow: '0px 2px 4px rgba(211, 47, 47, 0.2)',
                                    '&:hover': {
                                        boxShadow: '0px 4px 8px rgba(211, 47, 47, 0.3)'
                                    }
                                }}
                            >
                                Создать магазин
                            </Button>
                        </Box>
                    </Paper>

                    {error && (
                        <Alert
                            severity="error"
                            sx={{ mb: 3, borderRadius: 2 }}
                            onClose={() => setError('')}
                        >
                            {error}
                        </Alert>
                    )}

                    {shops.map((shop) => (
                        <Tooltip 
                            key={shop.id}
                            title={shop.locked ? "Необходимо закончить интеграцию фото" : ""}
                            placement="top"
                        >
                            <Paper
                                sx={{
                                    p: 2,
                                    mb: 2,
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    border: shop.locked ? '2px solid #ff6b6b' : 'none',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        boxShadow: shop.locked ? '0px 4px 12px rgba(255, 107, 107, 0.2)' : '0px 4px 12px rgba(0,0,0,0.1)'
                                    }
                                }}
                            >
                                <Box>
                                    <Typography 
                                        variant="h6" 
                                        color="primary"
                                        sx={{ 
                                            fontWeight: 600,
                                            fontSize: '1.25rem'
                                        }}
                                    >
                                        {shop.name}
                                    </Typography>
                                    {shop.callback && (
                                        <Typography variant="body2" color="text.secondary">
                                            Callback: {shop.callback}
                                        </Typography>
                                    )}
                                </Box>
                                <Box>
                                    <IconButton
                                        color="primary"
                                        onClick={() => handleOpenImageSourceDialog(shop)}
                                        sx={{ mr: 1 }}
                                    >
                                        <SettingsIcon />
                                    </IconButton>
                                    <IconButton
                                        color="primary"
                                        onClick={() => handleOpenDialog(shop)}
                                        sx={{ mr: 1 }}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        color="primary"
                                        onClick={() => handleDelete(shop.id)}
                                        sx={{
                                            '&:hover': {
                                                backgroundColor: 'primary.light',
                                                color: 'white'
                                            }
                                        }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            </Paper>
                        </Tooltip>
                    ))}
                </Grid>
            </Grid>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>
                    {editingShop ? 'Изменить данные' : 'Создать новый магазин'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Shop Name"
                        fullWidth
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="Callback URL"
                        fullWidth
                        value={formData.callback}
                        onChange={(e) => setFormData({ ...formData, callback: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained">
                        {editingShop ? 'Save' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog 
                open={openImageSourceDialog} 
                onClose={handleCloseImageSourceDialog}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Настройка источника изображений</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="S3 URL"
                            fullWidth
                            value={imageSourceData.s3Url}
                            onChange={(e) => setImageSourceData({ ...imageSourceData, s3Url: e.target.value })}
                        />
                        <TextField
                            label="S3 Key"
                            fullWidth
                            value={imageSourceData.s3Key}
                            onChange={(e) => setImageSourceData({ ...imageSourceData, s3Key: e.target.value })}
                        />
                        <TextField
                            label="S3 Secret Key"
                            fullWidth
                            type="password"
                            value={imageSourceData.s3SecretKey}
                            onChange={(e) => setImageSourceData({ ...imageSourceData, s3SecretKey: e.target.value })}
                        />
                        <TextField
                            label="S3 Bucket"
                            fullWidth
                            value={imageSourceData.s3Bucket}
                            onChange={(e) => setImageSourceData({ ...imageSourceData, s3Bucket: e.target.value })}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseImageSourceDialog}>Отмена</Button>
                    <Button 
                        onClick={handleImageSourceSubmit}
                        variant="contained"
                        disabled={!imageSourceData.s3Url || !imageSourceData.s3Key || !imageSourceData.s3SecretKey || !imageSourceData.s3Bucket}
                    >
                        Сохранить
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminPanel; 