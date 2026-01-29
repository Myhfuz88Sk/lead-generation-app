// API Configuration
const API_URL = 'http://localhost:3000/api'; // Change this to your deployed backend URL

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    loadProjects();
    loadClients();
    setupFormHandlers();
    setupScrollAnimations();
});

// Load Projects from Backend
async function loadProjects() {
    const container = document.getElementById('projectsContainer');
    
    try {
        const response = await fetch(`${API_URL}/projects`);
        const projects = await response.json();
        
        if (projects.length === 0) {
            container.innerHTML = '<div class="loading">No projects available yet</div>';
            return;
        }
        
        container.innerHTML = projects.map(project => `
            <div class="project-card" data-aos="fade-up">
                <div class="project-image">
                    <img src="${project.image}" alt="${project.name}">
                </div>
                <div class="project-content">
                    <h3>${project.name}</h3>
                    <p>${project.description}</p>
                    <button class="btn-primary">Read More</button>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading projects:', error);
        container.innerHTML = `
            <div class="loading">
                Unable to load projects. Using sample data.
            </div>
        `;
        // Load sample projects if API fails
        loadSampleProjects(container);
    }
}

// Load Sample Projects (Fallback)
function loadSampleProjects(container) {
    const sampleProjects = [
        {
            name: 'Modern Villa',
            description: 'Luxury villa with contemporary design and premium amenities.',
            image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400'
        },
        {
            name: 'Urban Apartment',
            description: 'Stylish apartment in the heart of the city with modern facilities.',
            image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400'
        },
        {
            name: 'Cozy Cottage',
            description: 'Charming cottage perfect for a peaceful lifestyle.',
            image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400'
        },
        {
            name: 'Penthouse Suite',
            description: 'Exclusive penthouse with panoramic city views.',
            image: 'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=400'
        },
        {
            name: 'Family Home',
            description: 'Spacious home perfect for growing families.',
            image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400'
        }
    ];
    
    setTimeout(() => {
        container.innerHTML = sampleProjects.map(project => `
            <div class="project-card">
                <div class="project-image">
                    <img src="${project.image}" alt="${project.name}">
                </div>
                <div class="project-content">
                    <h3>${project.name}</h3>
                    <p>${project.description}</p>
                    <button class="btn-primary">Read More</button>
                </div>
            </div>
        `).join('');
    }, 500);
}

// Load Clients/Testimonials from Backend
async function loadClients() {
    const container = document.getElementById('testimonialsContainer');
    
    try {
        const response = await fetch(`${API_URL}/clients`);
        const clients = await response.json();
        
        if (clients.length === 0) {
            container.innerHTML = '<div class="loading">No testimonials available yet</div>';
            return;
        }
        
        container.innerHTML = clients.map(client => `
            <div class="testimonial-card" data-aos="fade-up">
                <div class="client-image">
                    <img src="${client.image}" alt="${client.name}">
                </div>
                <p>"${client.description}"</p>
                <div class="client-name">${client.name}</div>
                <div class="client-designation">${client.designation}</div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading clients:', error);
        container.innerHTML = `
            <div class="loading">
                Unable to load testimonials. Using sample data.
            </div>
        `;
        // Load sample clients if API fails
        loadSampleClients(container);
    }
}

// Load Sample Clients (Fallback)
function loadSampleClients(container) {
    const sampleClients = [
        {
            name: 'Natasha Smith',
            designation: 'CEO, Tech Corp',
            description: 'Excellent service! They helped us find the perfect office space for our growing company. Highly professional and attentive to details.',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200'
        },
        {
            name: 'Ryan Kaveh',
            designation: 'Web Developer',
            description: 'The team was fantastic throughout the entire process. Found my dream home within my budget. Couldn\'t be happier!',
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200'
        },
        {
            name: 'John Adams',
            designation: 'Entrepreneur',
            description: 'Professional, reliable, and efficient. They made the entire property buying process smooth and stress-free.',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200'
        },
        {
            name: 'Wendy Fischer',
            designation: 'Designer',
            description: 'Outstanding experience! The attention to design details and understanding of my needs was impressive.',
            image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200'
        }
    ];
    
    setTimeout(() => {
        container.innerHTML = sampleClients.map(client => `
            <div class="testimonial-card">
                <div class="client-image">
                    <img src="${client.image}" alt="${client.name}">
                </div>
                <p>"${client.description}"</p>
                <div class="client-name">${client.name}</div>
                <div class="client-designation">${client.designation}</div>
            </div>
        `).join('');
    }, 500);
}

// Setup Form Handlers
function setupFormHandlers() {
    // Hero Contact Form
    const heroForm = document.getElementById('heroContactForm');
    if (heroForm) {
        heroForm.addEventListener('submit', handleContactSubmit);
    }
    
    // Main Contact Form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
    
    // Newsletter Form
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }
}

// Handle Contact Form Submission
async function handleContactSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    const data = {
        fullName: formData.get('name') || formData.get('fullName'),
        email: formData.get('email'),
        mobile: formData.get('mobile'),
        city: formData.get('city'),
        submittedAt: new Date().toISOString()
    };
    
    try {
        const response = await fetch(`${API_URL}/contacts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            showModal('Success!', 'Thank you for contacting us. We will get back to you soon!');
            form.reset();
        } else {
            throw new Error('Submission failed');
        }
    } catch (error) {
        console.error('Error submitting contact form:', error);
        // Save to localStorage as fallback
        saveToLocalStorage('contacts', data);
        showModal('Success!', 'Your message has been saved. We will contact you soon!');
        form.reset();
    }
}

// Handle Newsletter Subscription
async function handleNewsletterSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const email = form.email.value;
    
    const data = {
        email: email,
        subscribedAt: new Date().toISOString()
    };
    
    try {
        const response = await fetch(`${API_URL}/subscribers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            showModal('Subscribed!', 'Thank you for subscribing to our newsletter!');
            form.reset();
        } else {
            throw new Error('Subscription failed');
        }
    } catch (error) {
        console.error('Error subscribing:', error);
        // Save to localStorage as fallback
        saveToLocalStorage('subscribers', data);
        showModal('Subscribed!', 'You have been added to our newsletter list!');
        form.reset();
    }
}

// Save to LocalStorage (Fallback)
function saveToLocalStorage(key, data) {
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    existing.push(data);
    localStorage.setItem(key, JSON.stringify(existing));
}

// Show Modal
function showModal(title, message) {
    const modal = document.getElementById('successModal');
    const modalMessage = document.getElementById('modalMessage');
    const modalTitle = modal.querySelector('h3');
    
    if (modalTitle) modalTitle.textContent = title;
    if (modalMessage) modalMessage.textContent = message;
    
    modal.classList.add('show');
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.close');
    closeBtn.onclick = () => modal.classList.remove('show');
    
    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    };
    
    // Auto close after 3 seconds
    setTimeout(() => {
        modal.classList.remove('show');
    }, 3000);
}

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Setup Scroll Animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all cards and sections
    document.querySelectorAll('.project-card, .testimonial-card, .service-card, .stat-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
    } else {
        navbar.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
    }
});

// Initialize Testimonial Carousel (Optional Enhancement)
let currentTestimonial = 0;
const testimonialDots = document.querySelectorAll('.nav-dot');

testimonialDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        testimonialDots.forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
        // Add carousel logic here if implementing carousel view
    });
});

// Form Validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\d\s\-\+\(\)]+$/;
    return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

// Add real-time validation to forms
document.querySelectorAll('input[type="email"]').forEach(input => {
    input.addEventListener('blur', function() {
        if (this.value && !validateEmail(this.value)) {
            this.style.borderColor = 'red';
            showError(this, 'Please enter a valid email address');
        } else {
            this.style.borderColor = '';
            hideError(this);
        }
    });
});

document.querySelectorAll('input[type="tel"]').forEach(input => {
    input.addEventListener('blur', function() {
        if (this.value && !validatePhone(this.value)) {
            this.style.borderColor = 'red';
            showError(this, 'Please enter a valid phone number');
        } else {
            this.style.borderColor = '';
            hideError(this);
        }
    });
});

function showError(input, message) {
    hideError(input);
    const error = document.createElement('div');
    error.className = 'error-message';
    error.style.color = 'red';
    error.style.fontSize = '12px';
    error.style.marginTop = '5px';
    error.textContent = message;
    input.parentNode.appendChild(error);
}

function hideError(input) {
    const error = input.parentNode.querySelector('.error-message');
    if (error) {
        error.remove();
    }
}

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadProjects,
        loadClients,
        handleContactSubmit,
        handleNewsletterSubmit,
        validateEmail,
        validatePhone
    };
}