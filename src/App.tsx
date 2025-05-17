import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { userTheme, adminTheme } from './theme';
import Login from './pages/Login';
import Register from './pages/Register';
import ShopList from './pages/ShopList';
import AdminPanel from './pages/AdminPanel';
import SearchPage from './pages/SearchPage';
import CallbackPage from './pages/CallbackPage';

const ThemeWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();
    const isAdminPage = location.pathname === '/admin';

    return (
        <ThemeProvider theme={isAdminPage ? adminTheme : userTheme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
};

const App: React.FC = () => {
    return (
        <Router>
            <ThemeWrapper>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/shop" element={<ShopList />} />
                    <Route path="/admin" element={<AdminPanel />} />
                    <Route path="/search/:shopId" element={<SearchPage />} />
                    <Route path="/callback" element={<CallbackPage />} />
                    <Route path="/" element={<Navigate to="/shop" replace />} />
                </Routes>
            </ThemeWrapper>
        </Router>
    );
};

export default App;
