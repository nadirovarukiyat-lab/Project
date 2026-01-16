// Mobile Navigation and Functionality
document.addEventListener('DOMContentLoaded', function() {
    // ========== МОБИЛЬНОЕ МЕНЮ ==========
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navList = document.querySelector('.nav-list');
    const body = document.body;
    const header = document.querySelector('.header');
    
    // Создаем подложку для мобильного меню
    const mobileOverlay = document.createElement('div');
    mobileOverlay.className = 'mobile-menu-overlay';
    document.body.appendChild(mobileOverlay);

    // Функция открытия/закрытия мобильного меню
    function toggleMobileMenu() {
        const isActive = navList.classList.contains('active');
        
        if (!isActive) {
            // Открываем меню
            navList.classList.add('active');
            mobileMenuBtn.classList.add('active');
            mobileOverlay.classList.add('active');
            body.classList.add('no-scroll');
            
            // Меняем иконку
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
            
            // Фиксируем хедер
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
        } else {
            // Закрываем меню
            closeMobileMenu();
        }
    }

    // Функция закрытия мобильного меню
    function closeMobileMenu() {
        navList.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
        mobileOverlay.classList.remove('active');
        body.classList.remove('no-scroll');
        
        // Возвращаем иконку
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }

    // Обработчик кнопки мобильного меню
    if (mobileMenuBtn && navList) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
        
        // Закрытие меню по клику на подложку
        mobileOverlay.addEventListener('click', closeMobileMenu);
        
        // Закрытие меню по клику на ссылки
        const navLinks = document.querySelectorAll('.nav-list a');
        navLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
        
        // Закрытие меню по клику на кнопку "Записаться" в меню
        const appointmentBtn = document.querySelector('.nav-list a[href="#contact"]');
        if (appointmentBtn) {
            appointmentBtn.addEventListener('click', function(e) {
                // Не закрываем меню сразу для кнопки "Записаться"
                // так как она ведет к форме
            });
        }
    }

    // ========== МОДАЛЬНОЕ ОКНО ==========
    const modal = document.getElementById('appointmentModal');
    const contactForm = document.getElementById('contactForm');
    const appointmentForm = document.getElementById('appointmentForm');

    // Функция открытия модального окна
    window.openModal = function() {
        if (modal) {
            modal.style.display = 'flex';
            body.classList.add('no-scroll');
            // Закрываем мобильное меню если оно открыто
            closeMobileMenu();
        }
    };

    // Функция закрытия модального окна
    window.closeModal = function() {
        if (modal) {
            modal.style.display = 'none';
            body.classList.remove('no-scroll');
        }
    };

    // Закрытие модального окна по клику вне его
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        // Закрытие по Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.style.display === 'flex') {
                closeModal();
            }
        });
    }

    // ========== ФОРМЫ ==========
    // Отправка формы контактов
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitForm(this, 'Заявка успешно отправлена! Я свяжусь с вами в ближайшее время.');
        });
    }

    // Отправка формы записи
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitForm(this, 'Запись успешно оформлена! Я свяжусь с вами для подтверждения.');
            setTimeout(closeModal, 2000);
        });
    }

    // Общая функция отправки формы
    function submitForm(form, successMessage) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        const originalBgColor = submitBtn.style.backgroundColor;
        
        // Показываем состояние загрузки
        submitBtn.textContent = 'Отправка...';
        submitBtn.disabled = true;
        
        // Симуляция отправки на сервер
        setTimeout(() => {
            // Показываем успех
            submitBtn.textContent = '✓ ' + successMessage;
            submitBtn.style.backgroundColor = '#4CAF50';
            
            // Очищаем форму
            form.reset();
            
            // Восстанавливаем кнопку через 3 секунды
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.backgroundColor = originalBgColor;
            }, 3000);
        }, 1500);
    }

    // ========== ПЛАВНАЯ ПРОКРУТКА ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                // Закрываем мобильное меню
                closeMobileMenu();
                
                // Плавная прокрутка
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========== "ЛИПКИЙ" ХЕДЕР ==========
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // ========== ЛЕНИВАЯ ЗАГРУЗКА ИЗОБРАЖЕНИЙ ==========
    const galleryImages = document.querySelectorAll('.gallery-image');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.style.opacity = '1';
                    img.style.transform = 'translateY(0)';
                    imageObserver.unobserve(img);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });

        galleryImages.forEach(img => {
            img.style.opacity = '0';
            img.style.transform = 'translateY(20px)';
            img.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            imageObserver.observe(img);
        });
    }

    // ========== АНИМАЦИЯ ПРИ СКРОЛЛЕ ==========
    const animateElements = document.querySelectorAll('.feature, .category, .gallery-item, .contact-item');
    
    if ('IntersectionObserver' in window) {
        const elementObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    elementObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });

        animateElements.forEach(el => {
            elementObserver.observe(el);
        });
    } else {
        // Fallback для старых браузеров
        animateElements.forEach(el => {
            el.classList.add('animated');
        });
    }

    // ========== ПРОВЕРКА ДАТЫ В ФОРМЕ ==========
    const dateInput = document.querySelector('input[type="date"]');
    if (dateInput) {
        // Устанавливаем минимальную дату - сегодня
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
        
        // Устанавливаем максимальную дату - +3 месяца от сегодня
        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 3);
        dateInput.max = maxDate.toISOString().split('T')[0];
    }

    // ========== ВАЛИДАЦИЯ ТЕЛЕФОНА ==========
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            // Удаляем все нецифровые символы
            this.value = this.value.replace(/\D/g, '');
            
            // Форматируем номер
            if (this.value.length > 0) {
                let formattedValue = '+7 ';
                
                if (this.value.length > 1) {
                    formattedValue += '(' + this.value.substring(1, 4);
                }
                if (this.value.length > 4) {
                    formattedValue += ') ' + this.value.substring(4, 7);
                }
                if (this.value.length > 7) {
                    formattedValue += '-' + this.value.substring(7, 9);
                }
                if (this.value.length > 9) {
                    formattedValue += '-' + this.value.substring(9, 11);
                }
                
                this.value = formattedValue;
            }
        });
    });

    // ========== УСТАНОВКА ТЕКУЩЕГО ГОДА В ФУТЕРЕ ==========
    const yearElement = document.querySelector('#current-year');
    if (!yearElement) {
        // Создаем элемент если его нет
        const copyrightText = document.querySelector('.footer-copyright');
        if (copyrightText) {
            copyrightText.innerHTML = copyrightText.innerHTML.replace('2024', new Date().getFullYear());
        }
    } else {
        yearElement.textContent = new Date().getFullYear();
    }

    // ========== КЛИК ПО ЛОГОТИПУ ==========
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', function(e) {
            e.preventDefault();
            closeMobileMenu();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});

// ========== ОБРАБОТЧИК ОШИБОК ==========
window.addEventListener('error', function(e) {
    console.log('Произошла ошибка:', e.error);
});

// ========== ЗАГРУЗКА СТРАНИЦЫ ==========
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});