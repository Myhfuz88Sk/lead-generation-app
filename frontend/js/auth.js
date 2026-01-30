// Authentication JavaScript
// Works with Flask backend

const API_URL = 'http://127.0.0.1:5000/api';

// ========== SIGNUP FUNCTIONALITY ==========

// Check if we're on signup page
if (document.getElementById('signupForm')) {
    const signupForm = document.getElementById('signupForm');
    const signupBtn = document.getElementById('signupBtn');
    const alert = document.getElementById('alert');

    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(signupForm);
        const userData = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            username: formData.get('username'),
            password: formData.get('password'),
            role: formData.get('role'),
            createdAt: new Date().toISOString()
        };

        // Validate password
        if (userData.password.length < 6) {
            showAlert('Password must be at least 6 characters long', 'error');
            return;
        }

        // Disable button
        signupBtn.disabled = true;
        signupBtn.textContent = 'CREATING ACCOUNT...';

        try {
            // Send to backend
            const response = await fetch(`${API_URL}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (response.ok) {
                // Success
                showAlert('Account created successfully! Redirecting to login...', 'success');
                signupForm.reset();
                
                // Redirect to login after 2 seconds
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            } else {
                // Error from backend
                showAlert(data.error || 'Registration failed. Please try again.', 'error');
                signupBtn.disabled = false;
                signupBtn.textContent = 'CREATE PROFILE';
            }
        } catch (error) {
            console.error('Signup error:', error);
            
            // Fallback: Save to localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            
            // Check if username exists
            if (users.find(u => u.username === userData.username)) {
                showAlert('Username already exists', 'error');
                signupBtn.disabled = false;
                signupBtn.textContent = 'CREATE PROFILE';
                return;
            }
            
            // Check if email exists
            if (users.find(u => u.email === userData.email)) {
                showAlert('Email already registered', 'error');
                signupBtn.disabled = false;
                signupBtn.textContent = 'CREATE PROFILE';
                return;
            }
            
            users.push(userData);
            localStorage.setItem('users', JSON.stringify(users));
            
            showAlert('Account created successfully! Redirecting to login...', 'success');
            signupForm.reset();
            
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        }
    });
}

// ========== LOGIN FUNCTIONALITY ==========

// Check if we're on login page
if (document.getElementById('loginForm')) {
    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.getElementById('loginBtn');
    const alert = document.getElementById('alert');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(loginForm);
        const credentials = {
            username: formData.get('username'),
            password: formData.get('password'),
            role: formData.get('role')
        };

        // Disable button
        loginBtn.disabled = true;
        loginBtn.textContent = 'AUTHENTICATING...';

        try {
            // Send to backend
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials)
            });

            const data = await response.json();

            if (response.ok) {
                // Success
                showAlert('Login successful! Redirecting...', 'success');
                
                // Store user session
                localStorage.setItem('currentUser', JSON.stringify(data.user));
                localStorage.setItem('isLoggedIn', 'true');
                
                // Redirect based on SELECTED ROLE (not user's role)
                setTimeout(() => {
                    if (credentials.role === 'admin') {
                        window.location.href = 'admin.html';
                    } else {
                        window.location.href = 'index.html';
                    }
                }, 1500);
            } else {
                // Error from backend
                showAlert(data.error || 'Invalid credentials', 'error');
                loginBtn.disabled = false;
                loginBtn.textContent = 'AUTHENTICATE';
            }
        } catch (error) {
            console.error('Login error:', error);
            
            // Fallback: Check localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => 
                u.username === credentials.username && 
                u.password === credentials.password &&
                u.role === credentials.role
            );
            
            if (user) {
                showAlert('Login successful! Redirecting...', 'success');
                
                // Store session
                localStorage.setItem('currentUser', JSON.stringify(user));
                localStorage.setItem('isLoggedIn', 'true');
                
                // Redirect based on SELECTED ROLE (not stored user role)
                setTimeout(() => {
                    if (credentials.role === 'admin') {
                        window.location.href = 'admin.html';
                    } else {
                        window.location.href = 'index.html';
                    }
                }, 1500);
            } else {
                showAlert('Invalid username, password, or role', 'error');
                loginBtn.disabled = false;
                loginBtn.textContent = 'AUTHENTICATE';
            }
        }
    });
}

// ========== HELPER FUNCTIONS ==========

function showAlert(message, type) {
    const alert = document.getElementById('alert');
    alert.textContent = message;
    alert.className = `alert ${type}`;
    
    // Auto-hide error alerts after 5 seconds
    if (type === 'error') {
        setTimeout(() => {
            alert.style.display = 'none';
        }, 5000);
    }
}

// ========== LOGOUT FUNCTIONALITY ==========

function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'login.html';
}

// ========== SESSION CHECK ==========

function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    
    return { isLoggedIn: isLoggedIn === 'true', user: currentUser };
}

// ========== PROTECT PAGES ==========

function protectPage(requiredRole = null) {
    const { isLoggedIn, user } = checkAuth();
    
    if (!isLoggedIn) {
        window.location.href = 'login.html';
        return false;
    }
    
    if (requiredRole && user.role !== requiredRole) {
        alert('Access denied. Insufficient permissions.');
        window.location.href = 'index.html';
        return false;
    }
    
    return true;
}

// ========== DISPLAY USER INFO ==========

function displayUserInfo() {
    const { user } = checkAuth();
    
    if (user) {
        // Update UI with user info
        const userDisplayElements = document.querySelectorAll('.user-name');
        userDisplayElements.forEach(el => {
            el.textContent = `${user.firstName} ${user.lastName}`;
        });
        
        const userEmailElements = document.querySelectorAll('.user-email');
        userEmailElements.forEach(el => {
            el.textContent = user.email;
        });
        
        const userRoleElements = document.querySelectorAll('.user-role');
        userRoleElements.forEach(el => {
            el.textContent = user.role === 'admin' ? 'Administrator' : 'User';
        });
    }
}

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        logout,
        checkAuth,
        protectPage,
        displayUserInfo
    };
}