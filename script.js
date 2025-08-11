// DOM Elements
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const contactForm = document.getElementById('contact-form');
const skillBars = document.querySelectorAll('.skill-progress');
const statNumbers = document.querySelectorAll('.stat-number');
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

// Navigation functionality
function initNavigation() {
    // Handle navigation clicks
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = link.getAttribute('data-section');
            showSection(targetSection);
            setActiveNavLink(link);
            
            // Close mobile menu if open
            navMenu.classList.remove('active');
        });
    });

    // Handle button clicks that navigate to sections
    document.querySelectorAll('[data-section]').forEach(btn => {
        if (!btn.classList.contains('nav-link')) {
            btn.addEventListener('click', () => {
                const targetSection = btn.getAttribute('data-section');
                showSection(targetSection);
                setActiveNavLink(document.querySelector(`[data-section="${targetSection}"].nav-link`));
            });
        }
    });

    // Mobile hamburger menu
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
        }
    });
}

function showSection(sectionId) {
    // Hide all sections
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        targetSection.classList.add('fade-in-up');
        
        // Remove animation class after animation completes
        setTimeout(() => {
            targetSection.classList.remove('fade-in-up');
        }, 600);

        // Trigger section-specific animations
        if (sectionId === 'skills') {
            animateSkillBars();
        } else if (sectionId === 'home') {
            animateStatNumbers();
        }
    }
}

function setActiveNavLink(activeLink) {
    navLinks.forEach(link => link.classList.remove('active'));
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// Skills section animations
function animateSkillBars() {
    skillBars.forEach(bar => {
        const targetWidth = bar.getAttribute('data-width');
        setTimeout(() => {
            bar.style.width = targetWidth + '%';
        }, 200);
    });
}

// Statistics counter animation
function animateStatNumbers() {
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            stat.textContent = Math.floor(current) + (target === 100 ? '%' : '');
        }, 16);
    });
}

// Projects filter functionality
function initProjectsFilter() {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            
            // Update active filter button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter projects
            filterProjects(filter);
        });
    });
}

function filterProjects(filter) {
    projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        if (filter === 'all' || category === filter) {
            card.style.display = 'block';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 50);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
}

// Contact form functionality
function initContactForm() {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };
        
        // Validate form
        if (validateContactForm(data)) {
            // Simulate form submission
            submitContactForm(data);
        }
    });
}

function validateContactForm(data) {
    let isValid = true;
    
    // Clear previous errors
    document.querySelectorAll('.error-message').forEach(error => {
        error.textContent = '';
    });
    
    // Validate name
    if (!data.name.trim()) {
        showError('name', 'Name is required');
        isValid = false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email.trim()) {
        showError('email', 'Email is required');
        isValid = false;
    } else if (!emailRegex.test(data.email)) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate subject
    if (!data.subject.trim()) {
        showError('subject', 'Subject is required');
        isValid = false;
    }
    
    // Validate message
    if (!data.message.trim()) {
        showError('message', 'Message is required');
        isValid = false;
    } else if (data.message.trim().length < 10) {
        showError('message', 'Message must be at least 10 characters long');
        isValid = false;
    }
    
    return isValid;
}

function showError(fieldName, message) {
    const field = document.getElementById(fieldName);
    const errorElement = field.parentNode.querySelector('.error-message');
    errorElement.textContent = message;
    field.style.borderColor = '#ef4444';
}

function submitContactForm(data) {
    // Show loading state
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Show success message
        showNotification('Message sent successfully!', 'success');
        
        // Reset form
        contactForm.reset();
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Clear any error styling
        document.querySelectorAll('input, textarea').forEach(field => {
            field.style.borderColor = '';
        });
    }, 2000);
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add notification styles if not already present
    if (!document.querySelector('.notification-styles')) {
        const styles = document.createElement('style');
        styles.className = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                background: white;
                color: var(--text-primary);
                padding: 1rem 1.5rem;
                border-radius: var(--border-radius);
                box-shadow: var(--shadow-lg);
                display: flex;
                align-items: center;
                gap: 0.5rem;
                z-index: 10000;
                transform: translateX(400px);
                transition: transform 0.3s ease;
                border-left: 4px solid var(--primary-color);
            }
            .notification-success {
                border-left-color: #10b981;
            }
            .notification.show {
                transform: translateX(0);
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Hide notification after 4 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 4000);
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
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
}

// Header scroll effect
function initHeaderScrollEffect() {
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = 'var(--shadow-md)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
        
        lastScrollY = currentScrollY;
    });
}

// Intersection Observer for animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate on scroll
    document.querySelectorAll('.project-card, .skill-category, .contact-item').forEach(el => {
        observer.observe(el);
    });
}

// Keyboard navigation
function initKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // Navigate with arrow keys
        if (e.altKey) {
            const currentSection = document.querySelector('.section.active');
            const sectionIds = ['home', 'skills', 'projects', 'contact'];
            const currentIndex = sectionIds.indexOf(currentSection.id);
            
            if (e.key === 'ArrowRight' && currentIndex < sectionIds.length - 1) {
                const nextSection = sectionIds[currentIndex + 1];
                showSection(nextSection);
                setActiveNavLink(document.querySelector(`[data-section="${nextSection}"].nav-link`));
            } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
                const prevSection = sectionIds[currentIndex - 1];
                showSection(prevSection);
                setActiveNavLink(document.querySelector(`[data-section="${prevSection}"].nav-link`));
            }
        }
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initProjectsFilter();
    initContactForm();
    initSmoothScrolling();
    initHeaderScrollEffect();
    initScrollAnimations();
    initKeyboardNavigation();
    
    // Show home section by default
    showSection('home');
    
    // Animate elements on page load
    setTimeout(() => {
        animateStatNumbers();
    }, 500);
});

// Handle window resize
window.addEventListener('resize', () => {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768) {
        navMenu.classList.remove('active');
    }
});

// Prevent right-click context menu on production (optional)
// document.addEventListener('contextmenu', (e) => e.preventDefault());

// Console welcome message
console.log('%c👋 Welcome to Willian Viana\'s Portfolio!', 'color: #2563eb; font-size: 16px; font-weight: bold;');
console.log('%cBuilt with ❤️ using HTML, CSS, and JavaScript', 'color: #64748b; font-size: 14px;');
