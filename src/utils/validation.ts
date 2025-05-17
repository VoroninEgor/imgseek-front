export const validateUsername = (username: string): string | null => {
    if (!username) {
        return 'Username is required';
    }
    if (username.length < 3) {
        return 'Username must be at least 3 characters long';
    }
    if (username.length > 20) {
        return 'Username must be less than 20 characters';
    }
    return null;
};

export const validatePassword = (password: string): string | null => {
    if (!password) {
        return 'Password is required';
    }
    if (password.length < 6) {
        return 'Password must be at least 6 characters long';
    }
    return null;
}; 