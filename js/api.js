// API Configuration
const API_URL = 'https://your-api-server.com'; // Заменим позже на реальный

// Auth functions
async function login(email, password) {
    // TODO: Заменить на реальный API
    console.log('Login:', { email, password });
    
    // Демо-данные
    const user = {
        id: 1,
        username: 'Tigran',
        email: 'mirzoyantigran61@gmail.com',
        role: 'admin',
        token: 'demo-token-123'
    };
    
    localStorage.setItem('token', user.token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return { success: true, user };
}

async function register(userData) {
    console.log('Register:', userData);
    return { success: true };
}

async function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// User functions
async function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

async function updateUserProfile(data) {
    console.log('Update profile:', data);
    return { success: true };
}

// License functions
async function getLicenses() {
    // Демо-данные
    return [
        { id: 1, key: 'SPEED-1234-ABCD', type: 'speedhack', status: 'active', expires: '2024-12-31' },
        { id: 2, key: 'AIM-5678-EFGH', type: 'aimbot', status: 'active', expires: '2024-12-31' }
    ];
}

async function redeemLicense(key) {
    console.log('Redeem:', key);
    return { success: true };
}

// Admin functions
async function getUsers() {
    // Демо-данные
    return [
        { id: 1, username: 'Tigran', email: 'mirzoyantigran61@gmail.com', role: 'admin', status: 'active' },
        { id: 2, username: 'Ankit', email: 'ankit@example.com', role: 'user', status: 'active' },
        { id: 3, username: 'Kaier', email: 'kaier@example.com', role: 'user', status: 'active' }
    ];
}

async function getStats() {
    return {
        totalUsers: 3,
        activeLicenses: 2,
        newToday: 1,
        revenue: 299
    };
}

async function createLicense(email, type, duration) {
    console.log('Create license:', { email, type, duration });
    return { success: true, key: 'NEW-KEY-1234' };
}

async function updateUserRole(userId, role) {
    console.log('Update role:', { userId, role });
    return { success: true };
}

async function deleteUser(userId) {
    console.log('Delete user:', userId);
    return { success: true };
}
