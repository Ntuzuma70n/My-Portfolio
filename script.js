document.addEventListener('DOMContentLoaded', function() {
    // Navigation functionality
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all nav items and pages
            navItems.forEach(nav => nav.classList.remove('active'));
            pages.forEach(page => page.classList.remove('active'));
            
            // Add active class to clicked nav item
            this.classList.add('active');
            
            // Show corresponding page
            const pageId = this.getAttribute('data-page');
            document.getElementById(pageId).classList.add('active');
            
            // Scroll to top of the page
            window.scrollTo(0, 0);
        });
    });
    
    // Animate progress bars when they come into view
    const animateOnScroll = function() {
        const progressLines = document.querySelectorAll('.progress-line span');
        
        progressLines.forEach(line => {
            const linePosition = line.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (linePosition < screenPosition) {
                line.style.width = line.style.width; // This triggers the animation
            }
        });
    };
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on page load
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
  // Enhanced Form Handling
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Validate form
            if (!this.checkValidity()) {
                alert('Please fill all required fields!');
                return;
            }

            // Get form data
            const formData = new FormData(this);
            const submitBtn = this.querySelector('.submit-btn');
            
            try {
                // Disable button during submission
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';
                
                // Submit to FormSubmit
                const response = await fetch(this.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    // Success handling
                    alert('Thank you for your message! I will get back to you soon.');
                    this.reset();
                    
                    // Optional: Redirect to thank-you page
                    const nextUrl = this.querySelector('[name="_next"]').value;
                    if (nextUrl) window.location.href = nextUrl;
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Oops! Something went wrong. Please try again.');
            } finally {
                // Re-enable button
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
            }
        });
    }
    
    // Dark mode toggle (optional)
    const darkModeToggle = document.createElement('div');
    darkModeToggle.className = 'dark-mode-toggle';
    darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    darkModeToggle.style.position = 'fixed';
    darkModeToggle.style.bottom = '20px';
    darkModeToggle.style.right = '20px';
    darkModeToggle.style.width = '50px';
    darkModeToggle.style.height = '50px';
    darkModeToggle.style.backgroundColor = 'var(--primary-color)';
    darkModeToggle.style.color = 'white';
    darkModeToggle.style.borderRadius = '50%';
    darkModeToggle.style.display = 'flex';
    darkModeToggle.style.alignItems = 'center';
    darkModeToggle.style.justifyContent = 'center';
    darkModeToggle.style.cursor = 'pointer';
    darkModeToggle.style.zIndex = '1000';
    darkModeToggle.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
    darkModeToggle.style.transition = 'var(--transition)';
    
    darkModeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        const icon = this.querySelector('i');
        if (document.body.classList.contains('dark-mode')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    });
    
    document.body.appendChild(darkModeToggle);
    
    // Check for prefers-color-scheme and set initial icon
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const icon = darkModeToggle.querySelector('i');
    if (darkModeMediaQuery.matches) {
        document.body.classList.add('dark-mode');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
    
    // Listen for changes in color scheme preference
    darkModeMediaQuery.addEventListener('change', e => {
        if (e.matches) {
            document.body.classList.add('dark-mode');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            document.body.classList.remove('dark-mode');
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    });
    
    // Add dark mode styles when toggled manually
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        body.dark-mode {
            background-color: #121212;
            color: #e0e0e0;
        }
        
        body.dark-mode .skills, 
        body.dark-mode .experience, 
        body.dark-mode .contact-info, 
        body.dark-mode .contact-form {
            background: #1e1e1e;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }
        
        body.dark-mode .contact-form input, 
        body.dark-mode .contact-form textarea {
            background: #2a2a2a;
            border-color: #333;
            color: #e0e0e0;
        }
        
        body.dark-mode .progress-line {
            background: #333;
        }
        
        body.dark-mode .portfolio-header h1, 
        body.dark-mode .contact-header h1, 
        body.dark-mode .section-title {
            color: #f0f0f0;
        }
        
        body.dark-mode .portfolio-header p, 
        body.dark-mode .contact-header p, 
        body.dark-mode .contact-text p {
            color: #aaa;
        }
    `;
    document.head.appendChild(styleElement);
});