// Admin Panel JavaScript
const API_URL = 'http://127.0.0.1:5000/api'; // Flask backend URL

// State Management
let projects = [];
let clients = [];
let contacts = [];
let subscribers = [];

// Initialize Admin Panel
document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    loadAllData();
    setupEventListeners();
    loadFromLocalStorage();
});

// Navigation
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            // Show corresponding section
            const section = item.getAttribute('data-section');
            showSection(section);
        });
    });
}

function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update page title
    const titles = {
        'dashboard': 'Dashboard',
        'projects': 'Manage Projects',
        'clients': 'Manage Clients',
        'contacts': 'Contact Forms',
        'subscribers': 'Newsletter Subscribers'
    };
    document.getElementById('pageTitle').textContent = titles[sectionName] || 'Dashboard';
}

// Load All Data
async function loadAllData() {
    await Promise.all([
        loadProjects(),
        loadClients(),
        loadContacts(),
        loadSubscribers()
    ]);
    updateDashboardStats();
}

// Load Projects
async function loadProjects() {
    try {
        const response = await fetch(`${API_URL}/projects`);
        projects = await response.json();
    } catch (error) {
        console.error('Error loading projects:', error);
        // Load from localStorage as fallback
        projects = JSON.parse(localStorage.getItem('projects') || '[]');
    }
    renderProjects();
}

function renderProjects() {
    const tbody = document.getElementById('projectsTableBody');
    
    if (projects.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="empty-state">No projects added yet</td></tr>';
        return;
    }
    
    tbody.innerHTML = projects.map((project, index) => `
        <tr>
            <td><img src="${project.image}" alt="${project.name}" class="table-image"></td>
            <td>${project.name}</td>
            <td>${truncateText(project.description, 50)}</td>
            <td class="table-actions">
                <button class="btn-danger" onclick="deleteProject(${index})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        </tr>
    `).join('');
}

// Load Clients
async function loadClients() {
    try {
        const response = await fetch(`${API_URL}/clients`);
        clients = await response.json();
    } catch (error) {
        console.error('Error loading clients:', error);
        clients = JSON.parse(localStorage.getItem('clients') || '[]');
    }
    renderClients();
}

function renderClients() {
    const tbody = document.getElementById('clientsTableBody');
    
    if (clients.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No clients added yet</td></tr>';
        return;
    }
    
    tbody.innerHTML = clients.map((client, index) => `
        <tr>
            <td><img src="${client.image}" alt="${client.name}" class="table-image"></td>
            <td>${client.name}</td>
            <td>${client.designation}</td>
            <td>${truncateText(client.description, 50)}</td>
            <td class="table-actions">
                <button class="btn-danger" onclick="deleteClient(${index})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        </tr>
    `).join('');
}

// Load Contacts
async function loadContacts() {
    try {
        const response = await fetch(`${API_URL}/contacts`);
        contacts = await response.json();
    } catch (error) {
        console.error('Error loading contacts:', error);
        contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
    }
    renderContacts();
}

function renderContacts() {
    const tbody = document.getElementById('contactsTableBody');
    
    if (contacts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No contact submissions yet</td></tr>';
        return;
    }
    
    tbody.innerHTML = contacts.map((contact, index) => `
        <tr>
            <td>${contact.fullName}</td>
            <td>${contact.email}</td>
            <td>${contact.mobile}</td>
            <td>${contact.city}</td>
            <td>${formatDate(contact.submittedAt)}</td>
            <td class="table-actions">
                <button class="btn-danger" onclick="deleteContact(${index})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        </tr>
    `).join('');
}

// Load Subscribers
async function loadSubscribers() {
    try {
        const response = await fetch(`${API_URL}/subscribers`);
        subscribers = await response.json();
    } catch (error) {
        console.error('Error loading subscribers:', error);
        subscribers = JSON.parse(localStorage.getItem('subscribers') || '[]');
    }
    renderSubscribers();
}

function renderSubscribers() {
    const tbody = document.getElementById('subscribersTableBody');
    
    if (subscribers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="empty-state">No subscribers yet</td></tr>';
        return;
    }
    
    tbody.innerHTML = subscribers.map((subscriber, index) => `
        <tr>
            <td>${subscriber.email}</td>
            <td>${formatDate(subscriber.subscribedAt)}</td>
            <td class="table-actions">
                <button class="btn-danger" onclick="deleteSubscriber(${index})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        </tr>
    `).join('');
}

// Update Dashboard Stats
function updateDashboardStats() {
    document.getElementById('totalProjects').textContent = projects.length;
    document.getElementById('totalClients').textContent = clients.length;
    document.getElementById('totalContacts').textContent = contacts.length;
    document.getElementById('totalSubscribers').textContent = subscribers.length;
    
    // Update recent activity
    updateRecentActivity();
}

function updateRecentActivity() {
    const activityContainer = document.getElementById('recentActivity');
    const activities = [];
    
    // Add recent contacts
    contacts.slice(-3).reverse().forEach(contact => {
        activities.push({
            type: 'contact',
            title: `New contact from ${contact.fullName}`,
            time: contact.submittedAt,
            icon: 'envelope'
        });
    });
    
    // Add recent subscribers
    subscribers.slice(-2).reverse().forEach(subscriber => {
        activities.push({
            type: 'subscriber',
            title: `New subscriber: ${subscriber.email}`,
            time: subscriber.subscribedAt,
            icon: 'bell'
        });
    });
    
    // Sort by time and take latest 5
    activities.sort((a, b) => new Date(b.time) - new Date(a.time));
    activities.splice(5);
    
    if (activities.length === 0) {
        activityContainer.innerHTML = '<p class="empty-state">No recent activity</p>';
        return;
    }
    
    activityContainer.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon ${activity.type === 'contact' ? 'success' : 'info'}">
                <i class="fas fa-${activity.icon}"></i>
            </div>
            <div class="activity-details">
                <h4>${activity.title}</h4>
                <p>${formatDate(activity.time)}</p>
            </div>
        </div>
    `).join('');
}

// Setup Event Listeners
function setupEventListeners() {
    // Add Project Button
    document.getElementById('addProjectBtn').addEventListener('click', () => {
        openModal('projectModal');
    });
    
    // Add Client Button
    document.getElementById('addClientBtn').addEventListener('click', () => {
        openModal('clientModal');
    });
    
    // Refresh Buttons
    document.getElementById('refreshContactsBtn').addEventListener('click', loadContacts);
    document.getElementById('refreshSubscribersBtn').addEventListener('click', loadSubscribers);
    
    // Project Form
    document.getElementById('projectForm').addEventListener('submit', handleProjectSubmit);
    
    // Client Form
    document.getElementById('clientForm').addEventListener('submit', handleClientSubmit);
    
    // Image Preview for Project
    document.getElementById('projectImage').addEventListener('change', (e) => {
        previewImage(e, 'projectImagePreview');
    });
    
    // Image Preview for Client
    document.getElementById('clientImage').addEventListener('change', (e) => {
        previewImage(e, 'clientImagePreview');
    });
    
    // Modal Close Buttons
    document.querySelectorAll('.close-modal, .cancel-modal').forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });
    
    // Close modal on outside click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeAllModals();
            }
        });
    });
}

// Handle Project Form Submit
async function handleProjectSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const imageFile = document.getElementById('projectImage').files[0];
    
    if (!imageFile) {
        showAlert('Please select an image', 'error');
        return;
    }
    
    // Convert image to base64
    const imageBase64 = await fileToBase64(imageFile);
    
    const project = {
        id: Date.now(),
        name: formData.get('name'),
        description: formData.get('description'),
        image: imageBase64,
        createdAt: new Date().toISOString()
    };
    
    try {
        const response = await fetch(`${API_URL}/projects`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(project)
        });
        
        if (response.ok) {
            projects.push(project);
            saveToLocalStorage('projects', projects);
            renderProjects();
            updateDashboardStats();
            closeAllModals();
            showAlert('Project added successfully!', 'success');
            e.target.reset();
            document.getElementById('projectImagePreview').classList.remove('show');
        }
    } catch (error) {
        console.error('Error adding project:', error);
        // Fallback to localStorage
        projects.push(project);
        saveToLocalStorage('projects', projects);
        renderProjects();
        updateDashboardStats();
        closeAllModals();
        showAlert('Project added successfully!', 'success');
        e.target.reset();
        document.getElementById('projectImagePreview').classList.remove('show');
    }
}

// Handle Client Form Submit
async function handleClientSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const imageFile = document.getElementById('clientImage').files[0];
    
    if (!imageFile) {
        showAlert('Please select an image', 'error');
        return;
    }
    
    // Convert image to base64
    const imageBase64 = await fileToBase64(imageFile);
    
    const client = {
        id: Date.now(),
        name: formData.get('name'),
        designation: formData.get('designation'),
        description: formData.get('description'),
        image: imageBase64,
        createdAt: new Date().toISOString()
    };
    
    try {
        const response = await fetch(`${API_URL}/clients`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(client)
        });
        
        if (response.ok) {
            clients.push(client);
            saveToLocalStorage('clients', clients);
            renderClients();
            updateDashboardStats();
            closeAllModals();
            showAlert('Client added successfully!', 'success');
            e.target.reset();
            document.getElementById('clientImagePreview').classList.remove('show');
        }
    } catch (error) {
        console.error('Error adding client:', error);
        // Fallback to localStorage
        clients.push(client);
        saveToLocalStorage('clients', clients);
        renderClients();
        updateDashboardStats();
        closeAllModals();
        showAlert('Client added successfully!', 'success');
        e.target.reset();
        document.getElementById('clientImagePreview').classList.remove('show');
    }
}

// Delete Functions
async function deleteProject(index) {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    const project = projects[index];
    
    try {
        await fetch(`${API_URL}/projects/${project.id}`, {
            method: 'DELETE'
        });
    } catch (error) {
        console.error('Error deleting project:', error);
    }
    
    projects.splice(index, 1);
    saveToLocalStorage('projects', projects);
    renderProjects();
    updateDashboardStats();
    showAlert('Project deleted successfully!', 'success');
}

async function deleteClient(index) {
    if (!confirm('Are you sure you want to delete this client?')) return;
    
    const client = clients[index];
    
    try {
        await fetch(`${API_URL}/clients/${client.id}`, {
            method: 'DELETE'
        });
    } catch (error) {
        console.error('Error deleting client:', error);
    }
    
    clients.splice(index, 1);
    saveToLocalStorage('clients', clients);
    renderClients();
    updateDashboardStats();
    showAlert('Client deleted successfully!', 'success');
}

async function deleteContact(index) {
    if (!confirm('Are you sure you want to delete this contact?')) return;
    
    const contact = contacts[index];
    
    try {
        await fetch(`${API_URL}/contacts/${contact.id}`, {
            method: 'DELETE'
        });
    } catch (error) {
        console.error('Error deleting contact:', error);
    }
    
    contacts.splice(index, 1);
    saveToLocalStorage('contacts', contacts);
    renderContacts();
    updateDashboardStats();
    showAlert('Contact deleted successfully!', 'success');
}

async function deleteSubscriber(index) {
    if (!confirm('Are you sure you want to delete this subscriber?')) return;
    
    const subscriber = subscribers[index];
    
    try {
        await fetch(`${API_URL}/subscribers/${subscriber.id}`, {
            method: 'DELETE'
        });
    } catch (error) {
        console.error('Error deleting subscriber:', error);
    }
    
    subscribers.splice(index, 1);
    saveToLocalStorage('subscribers', subscribers);
    renderSubscribers();
    updateDashboardStats();
    showAlert('Subscriber deleted successfully!', 'success');
}

// Modal Functions
function openModal(modalId) {
    document.getElementById(modalId).classList.add('show');
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('show');
    });
}

// Image Preview
function previewImage(event, previewId) {
    const file = event.target.files[0];
    const preview = document.getElementById(previewId);
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            preview.classList.add('show');
        };
        reader.readAsDataURL(file);
    }
}

// Convert File to Base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Alert System
function showAlert(message, type = 'success') {
    const alert = document.getElementById('alert');
    const alertMessage = document.getElementById('alertMessage');
    
    alert.className = `alert ${type}`;
    alertMessage.textContent = message;
    alert.classList.add('show');
    
    setTimeout(() => {
        alert.classList.remove('show');
    }, 3000);
}

// Utility Functions
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function loadFromLocalStorage() {
    // This is already handled in individual load functions
    // but can be used for initial setup
    if (!projects.length) {
        projects = JSON.parse(localStorage.getItem('projects') || '[]');
        renderProjects();
    }
    if (!clients.length) {
        clients = JSON.parse(localStorage.getItem('clients') || '[]');
        renderClients();
    }
    if (!contacts.length) {
        contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
        renderContacts();
    }
    if (!subscribers.length) {
        subscribers = JSON.parse(localStorage.getItem('subscribers') || '[]');
        renderSubscribers();
    }
    updateDashboardStats();
}

// Image Cropping Function (Bonus Feature)
async function cropImage(imageFile, targetWidth = 450, targetHeight = 350) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = targetWidth;
                canvas.height = targetHeight;
                const ctx = canvas.getContext('2d');
                
                // Calculate crop dimensions
                const srcRatio = img.width / img.height;
                const targetRatio = targetWidth / targetHeight;
                
                let sx, sy, sWidth, sHeight;
                
                if (srcRatio > targetRatio) {
                    // Image is wider
                    sHeight = img.height;
                    sWidth = sHeight * targetRatio;
                    sx = (img.width - sWidth) / 2;
                    sy = 0;
                } else {
                    // Image is taller
                    sWidth = img.width;
                    sHeight = sWidth / targetRatio;
                    sx = 0;
                    sy = (img.height - sHeight) / 2;
                }
                
                ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, targetWidth, targetHeight);
                resolve(canvas.toDataURL('image/jpeg', 0.9));
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(imageFile);
    });
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadProjects,
        loadClients,
        loadContacts,
        loadSubscribers,
        deleteProject,
        deleteClient,
        deleteContact,
        deleteSubscriber
    };
}