import React, { useState } from 'react';
import { 
    Container, 
    Paper, 
    TextField, 
    Button, 
    Typography, 
    Box,
    Alert,
    InputAdornment,
    IconButton,
    Grid
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { validateUsername, validatePassword } from '../utils/validation';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [errors, setErrors] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const validateForm = (): boolean => {
        const usernameError = validateUsername(formData.username);
        const passwordError = validatePassword(formData.password);
        
        setErrors({
            username: usernameError || '',
            password: passwordError || ''
        });

        return !usernameError && !passwordError;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        setErrors(prev => ({
            ...prev,
            [name]: ''
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const response = await authService.login(formData);
            localStorage.setItem('token', response.token);
            localStorage.setItem('username', response.username);
            localStorage.setItem('roles', JSON.stringify(response.roles));
            
            if (response.roles.includes('ROLE_ADMIN')) {
                navigate('/admin');
            } else {
                navigate('/shop');
            }
        } catch (err: any) {
            if (err.response?.status === 401) {
                setError('Invalid username or password');
            } else {
                setError('Login failed. Please try again.');
            }
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                width: '100vw',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #ffebee 0%, #ffffff 100%)',
                py: 4,
                px: 2
            }}
        >
            <Grid container justifyContent="center" maxWidth="lg">
                <Grid item xs={12} md={6} lg={4}>
                    <Paper 
                        elevation={3} 
                        sx={{ 
                            p: { xs: 3, md: 4 },
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            background: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(10px)'
                        }}
                    >
                        <Typography 
                            component="h1" 
                            variant="h4" 
                            align="center" 
                            gutterBottom
                            sx={{
                                mb: 4,
                                fontWeight: 600,
                                color: 'primary.main'
                            }}
                        >
                            С возвращением!
                        </Typography>
                        {error && (
                            <Alert 
                                severity="error" 
                                sx={{ 
                                    mb: 3,
                                    width: '100%',
                                    borderRadius: 2
                                }}
                            >
                                {error}
                            </Alert>
                        )}
                        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                autoComplete="username"
                                autoFocus
                                value={formData.username}
                                onChange={handleChange}
                                error={!!errors.username}
                                helperText={errors.username}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonOutlineIcon color={errors.username ? "error" : "primary"} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ mb: 3 }}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                autoComplete="current-password"
                                value={formData.password}
                                onChange={handleChange}
                                error={!!errors.password}
                                helperText={errors.password}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockOutlinedIcon color={errors.password ? "error" : "primary"} />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ mb: 4 }}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                disabled={loading}
                                sx={{
                                    py: 1.5,
                                    fontSize: '1.1rem',
                                    mb: 3
                                }}
                            >
                                {loading ? 'Signing in...' : 'Login'}
                            </Button>
                            <Button
                                fullWidth
                                variant="text"
                                onClick={() => navigate('/register')}
                                sx={{
                                    color: 'primary.main',
                                    '&:hover': {
                                        backgroundColor: 'rgba(211, 47, 47, 0.04)'
                                    }
                                }}
                            >
                                Нет аккаунта? Зарегистрироваться
                            </Button>
                        </form>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Login; 