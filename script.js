// Mobile Navigation
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navList = document.querySelector('.nav-list');
    const body = document.body;
    const header = document.querySelector('.header');

    // Toggle mobile menu
    if (mobileMenuBtn && navList) {
        mobileMenuBtn.addEventListener('click', function() {
            navList.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
            body.classList.toggle('no-scroll');
            
            // Change icon
            const icon = mobileMenuBtn.querySelector('i');
            if (navList.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
                header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when clicking on links
        const navLinks = document.querySelectorAll('.nav-list a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navList.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                body.classList.remove('no-scroll');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navList.contains(e.target) && 
                !mobileMenuBtn.contains(e.target) && 
                navList.classList.contains('active')) {
                navList.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                body.classList.remove('no-scroll');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Modal functionality
    const modal = document.getElementById('appointmentModal');
    const contactForm = document.getElementById('contactForm');
    const appointmentForm = document.getElementById('appointmentForm');

    // Open modal
    window.openModal = function() {
        if (modal) {
            modal.style.display = 'flex';
            body.classList.add('no-scroll');
        }
    };

    // Close modal
    window.closeModal = function() {
        if (modal) {
            modal.style.display = 'none';
            body.classList.remove('no-scroll');
        }
    };

    // Close modal when clicking outside
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Form submissions
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitForm(this, 'Заявка успешно отправлена! Я свяжусь с вами в ближайшее время.');
        });
    }

    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitForm(this, 'Запись успешно оформлена! Я свяжусь с вами для подтверждения.');
            setTimeout(closeModal, 2000);
        });
    }

    function submitForm(form, successMessage) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.textContent = 'Отправка...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Show success
            submitBtn.textContent = '✓ ' + successMessage;
            submitBtn.style.backgroundColor = '#4CAF50';
            
            // Reset form
            form.reset();
            
            // Reset button after 3 seconds
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.backgroundColor = '';
            }, 3000);
        }, 1500);
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                if (navList && navList.classList.contains('active')) {
                    navList.classList.remove('active');
                    mobileMenuBtn.classList.remove('active');
                    body.classList.remove('no-scroll');
                    const icon = mobileMenuBtn.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
                
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Sticky header effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Gallery image lazy loading
    const galleryImages = document.querySelectorAll('.gallery-image');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '50px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    galleryImages.forEach(img => {
        img.style.opacity = '0';
        img.style.transform = 'translateY(20px)';
        img.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(img);
    });

    // Animate elements on scroll
    const animateElements = document.querySelectorAll('.feature, .category, .gallery-item');
    const animateObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, {
        threshold: 0.1
    });

    animateElements.forEach(el => {
        animateObserver.observe(el);
    });
});