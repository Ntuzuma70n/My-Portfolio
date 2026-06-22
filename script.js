document.addEventListener('DOMContentLoaded', function() {
    // ===== NAVIGATION =====
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all nav items and pages
            navItems.forEach(nav => nav.classList.remove('active'));
            pages.forEach(page => page.classList.remove('active'));
            
            // Add active class to clicked nav item
            this.classList.add('active');
            
            // Show corresponding page with smooth animation
            const pageId = this.getAttribute('data-page');
            const targetPage = document.getElementById(pageId);
            targetPage.classList.add('active');
            
            // Scroll to top smoothly
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // Re-trigger animations for the new page
            animateProgressBars();
        });
    });
    
  // Update the animateProgressBars function in script.js
function animateProgressBars() {
    const progressSpans = document.querySelectorAll('.page.active .progress-line span');
    
    progressSpans.forEach(span => {
        // Reset animation
        span.style.width = '0';
        
        // Trigger reflow
        span.offsetHeight;
        
        // Get target width from class
        const parentClass = span.parentElement.classList;
        let targetWidth = '0%';
        
        if (parentClass.contains('java')) targetWidth = '90%';
        else if (parentClass.contains('javascript')) targetWidth = '45%';
        else if (parentClass.contains('python')) targetWidth = '55%';
        else if (parentClass.contains('sql')) targetWidth = '90%';
        else if (parentClass.contains('csharp')) targetWidth = '80%';
        else if (parentClass.contains('html')) targetWidth = '90%';
        else if (parentClass.contains('bi')) targetWidth = '90%';
        else if (parentClass.contains('cloud')) targetWidth = '85%';
        else if (parentClass.contains('azure')) targetWidth = '50%';  // Add this line
        
        // Animate to target width
        setTimeout(() => {
            span.style.width = targetWidth;
        }, 100);
    });
}
    
    // Intersection Observer for progress bars
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateProgressBars();
                progressObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe skills sections
    document.querySelectorAll('.skills').forEach(section => {
        progressObserver.observe(section);
    });
    
    // Initial animation
    setTimeout(animateProgressBars, 300);
    
    // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ===== FORM HANDLING =====
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Basic validation
            if (!this.checkValidity()) {
                // Show validation feedback
                const invalidFields = this.querySelectorAll(':invalid');
                invalidFields.forEach(field => {
                    field.style.borderColor = '#dc3545';
                    setTimeout(() => {
                        field.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                    }, 2000);
                });
                return;
            }
            
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            
            try {
                // Disable button during submission
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';
                submitBtn.style.opacity = '0.7';
                
                // Submit form
                const formData = new FormData(this);
                const response = await fetch(this.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    // Success animation
                    submitBtn.textContent = '✓ Sent Successfully!';
                    submitBtn.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
                    
                    // Show success message
                    showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                    
                    // Reset form
                    setTimeout(() => {
                        this.reset();
                        submitBtn.textContent = originalText;
                        submitBtn.style.background = '';
                        submitBtn.style.opacity = '1';
                    }, 2000);
                } else {
                    throw new Error('Submission failed');
                }
            } catch (error) {
                console.error('Error:', error);
                submitBtn.textContent = '✗ Error! Try Again';
                submitBtn.style.background = 'linear-gradient(135deg, #dc3545, #c82333)';
                showNotification('Oops! Something went wrong. Please try again.', 'error');
                
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '';
                    submitBtn.style.opacity = '1';
                }, 2000);
            } finally {
                submitBtn.disabled = false;
            }
        });
    }
    
    // ===== NOTIFICATION SYSTEM =====
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '16px 24px',
            borderRadius: '12px',
            color: 'white',
            fontWeight: '500',
            zIndex: '10000',
            animation: 'slideInRight 0.5s ease',
            maxWidth: '400px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
        });
        
        if (type === 'success') {
            notification.style.background = 'linear-gradient(135deg, rgba(40, 167, 69, 0.9), rgba(32, 201, 151, 0.9))';
        } else {
            notification.style.background = 'linear-gradient(135deg, rgba(220, 53, 69, 0.9), rgba(200, 35, 51, 0.9))';
        }
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.5s ease forwards';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }
    
    // Add notification animations
    const notificationStyles = document.createElement('style');
    notificationStyles.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(notificationStyles);
    
    // ===== CAROUSEL PAUSE ON HOVER =====
    document.querySelectorAll('.carousel-track').forEach(track => {
        track.addEventListener('mouseenter', () => {
            track.style.animationPlayState = 'paused';
        });
        
        track.addEventListener('mouseleave', () => {
            track.style.animationPlayState = 'running';
        });
    });
    
    // ===== DARK MODE TOGGLE =====
    const darkModeToggle = document.createElement('div');
    darkModeToggle.className = 'dark-mode-toggle';
    darkModeToggle.innerHTML = '<i class="fas fa-adjust"></i>';
    Object.assign(darkModeToggle.style, {
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        width: '50px',
        height: '50px',
        backgroundColor: 'var(--primary-color)',
        color: 'white',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        zIndex: '1000',
        boxShadow: '0 4px 20px rgba(108, 99, 255, 0.4)',
        transition: 'var(--transition)',
        fontSize: '1.2rem',
        border: '2px solid rgba(255, 255, 255, 0.2)'
    });
    
    let isLightMode = false;
    
    darkModeToggle.addEventListener('click', function() {
        isLightMode = !isLightMode;
        
        if (isLightMode) {
            document.body.style.background = '#f8f9fa';
            document.body.style.color = '#2a2a2a';
            this.style.backgroundColor = '#2a2a2a';
            this.querySelector('i').className = 'fas fa-moon';
        } else {
            document.body.style.background = '';
            document.body.style.color = '';
            this.style.backgroundColor = '';
            this.querySelector('i').className = 'fas fa-adjust';
        }
        
        // Add rotation animation
        this.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            this.style.transform = 'rotate(0deg)';
        }, 300);
    });
    
    document.body.appendChild(darkModeToggle);
    
    // ===== TILT EFFECT ONLY ON PORTFOLIO CARDS (REMOVED FROM ABOUT CARDS) =====
    document.querySelectorAll('.portfolio-item').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
});