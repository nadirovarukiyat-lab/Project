// ===== ФУНКЦИИ ДЛЯ МОБИЛЬНОГО МЕНЮ =====
document.addEventListener('DOMContentLoaded', function() {
    
    // Элементы мобильного меню
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    // Открытие/закрытие мобильного меню
    if (mobileMenuToggle && nav) {
        mobileMenuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            
            // Меняем иконку
            const icon = this.querySelector('i');
            if (nav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Закрытие меню при клике на ссылку
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                nav.classList.remove('active');
                mobileMenuToggle.querySelector('i').classList.remove('fa-times');
                mobileMenuToggle.querySelector('i').classList.add('fa-bars');
            });
        });
        
        // Закрытие меню при клике вне его
        document.addEventListener('click', function(event) {
            if (!nav.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
                nav.classList.remove('active');
                mobileMenuToggle.querySelector('i').classList.remove('fa-times');
                mobileMenuToggle.querySelector('i').classList.add('fa-bars');
            }
        });
    }
    
    // 1. Плавная прокрутка для навигации
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
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

    // 2. Обработка формы записи
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Сбор данных формы
            const formData = {
                name: this.querySelector('[name="name"]').value,
                phone: this.querySelector('[name="phone"]').value,
                service: this.querySelector('[name="service"]').value,
                date: this.querySelector('[name="date"]').value,
                message: this.querySelector('[name="message"]').value,
                timestamp: new Date().toISOString()
            };
            
            // Валидация
            if (!formData.name || !formData.phone || !formData.service || !formData.date) {
                showNotification('Пожалуйста, заполните все обязательные поля', 'error');
                return;
            }
            
            // В реальном проекте здесь был бы fetch на сервер
            // Сохраняем в localStorage для демо
            saveBooking(formData);
            
            // Показываем уведомление
            showNotification('Заявка успешно отправлена! Я свяжусь с вами в ближайшее время.', 'success');
            
            // Очищаем форму
            this.reset();
            
            // Устанавливаем сегодняшнюю дату
            const today = new Date().toISOString().split('T')[0];
            this.querySelector('[name="date"]').value = today;
            
            // Отправка в Telegram (раскомментировать при наличии бота)
            // sendToTelegram(formData);
        });
    }

    // 3. Устанавливаем минимальную дату (сегодня)
    const dateInput = document.querySelector('input[type="date"]');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
        dateInput.value = today;
    }

    // 4. Динамическое обновление года в футере
    const currentYear = new Date().getFullYear();
    const yearElements = document.querySelectorAll('.footer-bottom p');
    yearElements.forEach(el => {
        el.innerHTML = el.innerHTML.replace('2025', currentYear);
    });

    // 5. Анимация при скролле
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Наблюдаем за карточками
    document.querySelectorAll('.service-card, .approach-card, .review-card').forEach(card => {
        observer.observe(card);
    });

    // 6. Отслеживание кликов по кнопкам "Записаться"
    document.querySelectorAll('.service-btn, .btn-primary').forEach(btn => {
        if (btn.getAttribute('href') === '#contacts') {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                document.querySelector('#contacts').scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Если на кнопке есть data-service, выбираем её в форме
                const serviceType = this.dataset.service;
                if (serviceType) {
                    const serviceSelect = document.querySelector('[name="service"]');
                    if (serviceSelect) {
                        serviceSelect.value = serviceType;
                    }
                }
            });
        }
    });

    // 7. Добавление стилей для анимаций
    const style = document.createElement('style');
    style.textContent = `
        .animate {
            animation: fadeInUp 0.6s ease forwards;
        }
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
});

// ===== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =====

// Сохранение заявки в localStorage
function saveBooking(data) {
    let bookings = JSON.parse(localStorage.getItem('aisha_bookings') || '[]');
    bookings.push(data);
    localStorage.setItem('aisha_bookings', JSON.stringify(bookings));
    console.log('Заявка сохранена:', data);
}

// Показ уведомлений
function showNotification(message, type = 'success') {
    // Удаляем старое уведомление
    const oldNotification = document.querySelector('.notification');
    if (oldNotification) oldNotification.remove();
    
    // Создаем новое
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    // Стили
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-width: 300px;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    const contentStyle = `
        display: flex;
        align-items: center;
        gap: 10px;
        flex: 1;
    `;
    
    notification.querySelector('.notification-content').style.cssText = contentStyle;
    
    // Кнопка закрытия
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        margin-left: 10px;
        opacity: 0.8;
        transition: opacity 0.2s;
    `;
    
    closeBtn.addEventListener('mouseenter', () => {
        closeBtn.style.opacity = '1';
    });
    
    closeBtn.addEventListener('mouseleave', () => {
        closeBtn.style.opacity = '0.8';
    });
    
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Анимация
    const keyframes = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = keyframes;
    document.head.appendChild(styleSheet);
    
    document.body.appendChild(notification);
    
    // Автоматическое закрытие через 5 секунд
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Отправка в Telegram (пример, требуется настройка бота)
function sendToTelegram(data) {
    const botToken = 'YOUR_BOT_TOKEN';
    const chatId = 'YOUR_CHAT_ID';
    
    const message = `
Новая заявка от ${data.name}
Телефон: ${data.phone}
Услуга: ${data.service}
Дата: ${data.date}
Сообщение: ${data.message || 'Нет'}
    `.trim();
    
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'HTML'
        })
    }).catch(err => console.error('Ошибка отправки в Telegram:', err));
}

// Форматирование телефона
function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 0) {
        if (value.length <= 3) {
            value = `+7 (${value}`;
        } else if (value.length <= 6) {
            value = `+7 (${value.slice(1, 4)}) ${value.slice(4)}`;
        } else if (value.length <= 8) {
            value = `+7 (${value.slice(1, 4)}) ${value.slice(4, 7)}-${value.slice(7)}`;
        } else {
            value = `+7 (${value.slice(1, 4)}) ${value.slice(4, 7)}-${value.slice(7, 9)}-${value.slice(9, 11)}`;
        }
    }
    input.value = value;
}

// Добавляем форматирование телефона
document.addEventListener('DOMContentLoaded', function() {
    const phoneInput = document.querySelector('input[type="tel"]');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            formatPhoneNumber(this);
        });
    }
});

// Активация пункта меню при скролле
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 150) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Закрытие мобильного меню при изменении размера окна на десктоп
window.addEventListener('resize', function() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const nav = document.getElementById('nav');
    
    if (window.innerWidth > 768 && nav && nav.classList.contains('active')) {
        nav.classList.remove('active');
        if (mobileMenuToggle) {
            mobileMenuToggle.querySelector('i').classList.remove('fa-times');
            mobileMenuToggle.querySelector('i').classList.add('fa-bars');
        }
    }
});

// ===== ПРОСТОЙ ВАРИАНТ ДЛЯ АДРЕСА =====
document.addEventListener('DOMContentLoaded', function() {
    // Находим все элементы с адресом
    const addressSelectors = [
        'footer .footer-section p:has(i.fa-map-marker-alt)',
        '.contact-info .info-item:has(i.fa-map-marker-alt) p'
    ];
    
    addressSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            if (element.textContent.includes('Тарки')) {
                // Добавляем кликабельность
                element.style.cursor = 'pointer';
                element.style.transition = 'color 0.3s ease';
                
                // Добавляем обработчик клика
                element.addEventListener('click', function() {
                    window.open(
                        'https://yandex.ru/maps/28/makhachkala/?ll=47.513861%2C42.961158&mode=routes&rtext=42.983105%2C47.504749~42.944234%2C47.501367&rtt=auto&ruri=~ymapsbm1%3A%2F%2Fgeo%3Fdata%3DIgoNZgE-QhXlxitC&z=14.25',
                        '_blank'
                    );
                });
                
                // Эффект при наведении
                element.addEventListener('mouseenter', function() {
                    this.style.color = 'var(--accent)';
                    const icon = this.querySelector('i');
                    if (icon) icon.style.color = 'var(--accent)';
                });
                
                element.addEventListener('mouseleave', function() {
                    const isFooter = this.closest('footer');
                    this.style.color = isFooter ? '#999' : 'var(--text-light)';
                    const icon = this.querySelector('i');
                    if (icon) {
                        icon.style.color = isFooter ? '#999' : 'var(--text-light)';
                    }
                });
                
                // Добавляем подсказку
                element.title = 'Открыть в Яндекс Картах';
            }
        });
    });
});