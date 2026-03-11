// Check authentication on page load
document.addEventListener('DOMContentLoaded', async () => {
    const user = await getCurrentUser();
    
    if (!user) {
        // Not logged in, redirect to login
        if (!window.location.pathname.includes('index.html')) {
            window.location.href = 'index.html';
        }
        return;
    }
    
    // Update UI with user info
    updateUserInfo(user);
    
    // Load page-specific data
    const page = window.location.pathname.split('/').pop();
    
    switch(page) {
        case 'dashboard.html':
            loadDashboard();
            break;
        case 'admin.html':
            if (user.role === 'admin') {
                loadAdminPanel();
            } else {
                window.location.href = 'dashboard.html';
            }
            break;
        case 'keys.html':
            loadLicenses();
            break;
        case 'settings.html':
            loadSettings(user);
            break;
        case 'security.html':
            loadSecurity();
            break;
        case 'support.html':
            loadSupport();
            break;
    }
});

function updateUserInfo(user) {
    const userNameEl = document.getElementById('userName');
    const userRoleEl = document.getElementById('userRole');
    const userInitialsEl = document.getElementById('userInitials');
    
    if (userNameEl) userNameEl.textContent = user.username;
    if (userRoleEl) userRoleEl.textContent = user.role === 'admin' ? 'Administrator' : 'User';
    if (userInitialsEl) userInitialsEl.textContent = user.username.substring(0, 2).toUpperCase();
}

async function loadDashboard() {
    const stats = await getStats();
    const activities = [
        { action: 'License activated: SPEEDHACK', time: '2 hours ago', status: 'Active' },
        { action: 'Downloaded: AIM SILENT', time: '5 hours ago', status: 'Completed' }
    ];
    
    document.getElementById('activeLicenses').textContent = stats.activeLicenses;
    document.getElementById('totalDownloads').textContent = '127';
    
    const activityList = document.getElementById('activityList');
    activityList.innerHTML = activities.map(a => `
        <div class="flex items-center justify-between py-3 border-b border-[#00ff9c]/10">
            <div>
                <p class="text-white">${a.action}</p>
                <p class="text-[#b5b5b5] text-sm">${a.time}</p>
            </div>
            <span class="text-[#00ff9c]">${a.status}</span>
        </div>
    `).join('');
}

async function loadAdminPanel() {
    const users = await getUsers();
    const stats = await getStats();
    
    document.getElementById('totalUsers').textContent = stats.totalUsers;
    document.getElementById('totalLicenses').textContent = stats.activeLicenses;
    document.getElementById('newToday').textContent = stats.newToday;
    document.getElementById('revenue').textContent = `$${stats.revenue}`;
    
    const usersTable = document.getElementById('usersTable');
    usersTable.innerHTML = users.map(u => `
        <tr class="border-b border-[#00ff9c]/10">
            <td class="py-3">${u.id}</td>
            <td class="py-3">${u.username}</td>
            <td class="py-3">${u.email}</td>
            <td class="py-3">
                <select onchange="updateUserRole(${u.id}, this.value)" class="bg-[#0f0f0f] border border-[#00ff9c]/20 rounded px-2 py-1">
                    <option value="user" ${u.role === 'user' ? 'selected' : ''}>User</option>
                    <option value="admin" ${u.role === 'admin' ? 'selected' : ''}>Admin</option>
                </select>
            </td>
            <td class="py-3">
                <span class="text-[#00ff9c]">${u.status}</span>
            </td>
            <td class="py-3">
                <button onclick="deleteUser(${u.id})" class="text-red-500 hover:text-red-400">Delete</button>
            </td>
        </tr>
    `).join('');
}

async function loadLicenses() {
    const licenses = await getLicenses();
    
    const licensesList = document.getElementById('licensesList');
    if (licensesList) {
        licensesList.innerHTML = licenses.map(l => `
            <div class="flex items-center justify-between p-4 bg-[#0f0f0f] rounded-lg">
                <div>
                    <p class="text-white font-mono">${l.key}</p>
                    <p class="text-[#b5b5b5] text-sm">Expires: ${l.expires}</p>
                </div>
                <span class="text-[#00ff9c]">${l.status}</span>
            </div>
        `).join('');
    }
}

async function loadSettings(user) {
    document.getElementById('settingsUsername').value = user.username;
    document.getElementById('settingsEmail').value = user.email;
    document.getElementById('settingsTelegram').value = user.telegram || '';
}

async function loadSecurity() {
    const sessions = [
        { device: 'Chrome on Windows', location: 'Yerevan, AM', lastActive: 'Now' },
        { device: 'Firefox on Android', location: 'Yerevan, AM', lastActive: '2 hours ago' }
    ];
    
    const sessionsList = document.getElementById('sessionsList');
    if (sessionsList) {
        sessionsList.innerHTML = sessions.map(s => `
            <div class="flex items-center justify-between p-4 bg-[#0f0f0f] rounded-lg">
                <div>
                    <p class="text-white">${s.device}</p>
                    <p class="text-[#b5b5b5] text-sm">${s.location}</p>
                </div>
                <span class="text-[#b5b5b5]">${s.lastActive}</span>
            </div>
        `).join('');
    }
}

function loadSupport() {
    // Static content - already in HTML
}

// Event listeners
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    const result = await login(email, password);
    
    if (result.success) {
        window.location.href = 'dashboard.html';
    } else {
        alert('Login failed!');
    }
});

document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const password = document.getElementById('regPassword').value;
    const confirm = document.getElementById('regConfirmPassword').value;
    
    if (password !== confirm) {
        alert('Passwords do not match!');
        return;
    }
    
    const userData = {
        username: document.getElementById('regUsername').value,
        email: document.getElementById('regEmail').value,
        telegram: document.getElementById('regTelegram').value,
        password: password,
        referral: document.getElementById('regReferral').value
    };
    
    const result = await register(userData);
    
    if (result.success) {
        alert('Registration successful! Please login.');
        window.location.href = 'index.html';
    }
});

document.getElementById('settingsForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const data = {
        username: document.getElementById('settingsUsername').value,
        email: document.getElementById('settingsEmail').value,
        telegram: document.getElementById('settingsTelegram').value
    };
    
    const result = await updateUserProfile(data);
    
    if (result.success) {
        alert('Settings saved!');
    }
});

// Password strength checker
window.checkPasswordStrength = function(password) {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/)) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;

    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-[#00ff9c]', 'bg-[#00eaff]'];
    const meter = document.getElementById('strengthMeter')?.children;
    
    if (meter) {
        for (let i = 0; i < 5; i++) {
            meter[i].className = i < strength ? `flex-1 ${colors[strength-1]} rounded` : 'flex-1 bg-gray-600 rounded';
        }
    }
};

// Admin functions
window.createLicense = async function() {
    const email = document.getElementById('licenseEmail').value;
    const type = document.getElementById('licenseType').value;
    const duration = document.getElementById('licenseDuration').value;
    
    if (!email) {
        alert('Please enter user email');
        return;
    }
    
    const result = await createLicense(email, type, duration);
    
    if (result.success) {
        alert(`License created: ${result.key}`);
        document.getElementById('licenseEmail').value = '';
    }
};

window.updateUserRole = async function(userId, role) {
    if (confirm('Update user role?')) {
        await updateUserRole(userId, role);
        alert('Role updated!');
    }
};

window.deleteUser = async function(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        await deleteUser(userId);
        alert('User deleted!');
        window.location.reload();
    }
};

window.redeemLicense = async function() {
    const key = document.getElementById('licenseKey')?.value;
    if (!key) {
        alert('Please enter a license key');
        return;
    }
    
    const result = await redeemLicense(key);
    
    if (result.success) {
        alert('License redeemed successfully!');
        document.getElementById('licenseKey').value = '';
        window.location.reload();
    }
};

window.showPage = function(pageId) {
    const pages = ['loginPage', 'registerPage', 'dashboardPage', 'forgotPage'];
    pages.forEach(p => {
        const el = document.getElementById(p);
        if (el) el.style.display = 'none';
    });
    
    const target = document.getElementById(pageId);
    if (target) target.style.display = 'flex';
};

window.showDashboardContent = function(contentId) {
    const contents = ['homeContent', 'keysContent', 'downloadsContent', 'settingsContent', 'securityContent', 'supportContent'];
    contents.forEach(c => {
        const el = document.getElementById(c);
        if (el) el.style.display = 'none';
    });
    
    const target = document.getElementById(contentId + 'Content');
    if (target) target.style.display = 'block';
};
