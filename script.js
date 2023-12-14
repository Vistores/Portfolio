// script.js

// Ініціалізація об'єкту для збереження лайків
let categoryLikes = JSON.parse(localStorage.getItem('categoryLikes')) || {};

// Функція відображення повідомлення про копіювання
function showCopyMessage(message) {
    const copyMessage = document.getElementById('copyMessage');
    copyMessage.innerHTML = message;
    copyMessage.style.display = 'block';

    setTimeout(function () {
        copyMessage.style.display = 'none';
    }, 2000);
}

// Функція відображення дій з категорією при наведенні
function showCategoryActions(categoryId) {
    const actions = document.querySelector(`[data-category-id="${categoryId}"] .category-actions`);
    actions.classList.add('visible');
}

// Функція приховання дій з категорією при відведенні
function hideCategoryActions(categoryId) {
    const actions = document.querySelector(`[data-category-id="${categoryId}"] .category-actions`);
    actions.classList.remove('visible');
}

// Додавання обробників подій для кожної категорії
document.querySelectorAll('.category').forEach(category => {
    const categoryId = category.getAttribute('data-category-id');

    category.addEventListener('mouseover', () => showCategoryActions(categoryId));
    category.addEventListener('mouseout', () => hideCategoryActions(categoryId));

    category.querySelector('.like').addEventListener('click', (event) => {
        event.stopPropagation();
        event.preventDefault();
        toggleLikeCategory(categoryId, window.location.pathname);
    });
});

// Додавання обробників подій для лінивого завантаження зображень
document.addEventListener('lazybeforeunveil', function (e) {
    const bg = e.target.getAttribute('data-bg');
    if (bg) {
        e.target.style.backgroundImage = 'url(' + bg + ')';
    }
});

// Створення спостерігача для виявлення взаємодії з категоріями
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const category = entry.target;
            category.classList.add('visible');
            observer.unobserve(category);
        }
    });
}, { threshold: 0.5 });

// Додавання кожній категорії спостерігача
document.querySelectorAll('.category').forEach(category => {
    observer.observe(category);
});

// Ініціалізація флагу для завантаження додаткового контенту
let loadMoreContentFlag = true;

// Функція завантаження додаткового контенту
function loadMoreContent() {
    if (loadMoreContentFlag) {
        const existingContent = document.querySelectorAll('.category');
        existingContent.forEach(category => {
            category.classList.add('visible');
        });
        loadMoreContentFlag = false;
    }
}

// Додавання обробника подій для прокрутки сторінки
window.addEventListener('scroll', function () {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollTop + windowHeight >= documentHeight * 0.8) {
        loadMoreContent();
    }
});

// Додавання обробників подій для кожної кнопки "Поділитися"
document.querySelectorAll('.share').forEach((shareBtn, index) => {
    shareBtn.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();

        const categoryFileName = `category${index + 1}.html`;
        const currentPath = window.location.href.replace('index.html', '');
        const categoryPageURL = `${currentPath}${categoryFileName}`;

        const tempTextArea = document.createElement('textarea');
        tempTextArea.value = categoryPageURL;
        document.body.appendChild(tempTextArea);
        tempTextArea.select();
        document.execCommand('copy');
        document.body.removeChild(tempTextArea);

        showCopyMessage('Посилання скопійовано!');
    });
});

// Функція зміни стану "лайку" категорії
function toggleLikeCategory(categoryId, pagePath) {
    if (!categoryLikes[categoryId]) {
        categoryLikes[categoryId] = {};
    }

    if (!categoryLikes[categoryId][pagePath]) {
        // Якщо лайк був undefined, робимо його лайкнутим
        categoryLikes[categoryId][pagePath] = { count: 1, liked: true };
    } else {
        const currentLike = categoryLikes[categoryId][pagePath];

        if (currentLike.liked) {
            currentLike.count--;
        } else {
            currentLike.count++;
        }

        currentLike.liked = !currentLike.liked;
    }

    // Оновлення відображення лайків та їх збереження
    updateLikeCount(categoryId, categoryLikes[categoryId][pagePath].count, categoryLikes[categoryId][pagePath].liked, pagePath);
}

// Функція оновлення відображення лайків та збереження їх в localStorage
function updateLikeCount(categoryId, count, liked, pagePath) {
    const likeSpan = document.querySelector(`[data-category-id="${categoryId}"] .like`);
    likeSpan.innerHTML = `${liked ? '❤️' : '🤍'} ${count}`;

    categoryLikes[categoryId][pagePath] = { count, liked };

    localStorage.setItem('categoryLikes', JSON.stringify(categoryLikes));
}

// Обробник події завантаження сторінки
document.addEventListener('DOMContentLoaded', function () {
    // Перевірка, чи є на сторінці категорії
    if (document.querySelector('.categories')) {
        // Ітерація по всіх категоріях та оновлення лайків
        Object.keys(categoryLikes).forEach(categoryId => {
            const pagePath = window.location.pathname;
            const currentLike = categoryLikes[categoryId][pagePath];

            if (currentLike) {
                updateLikeCount(categoryId, currentLike.count, currentLike.liked, pagePath);
            }
        });
    }
});

// Обробник події завантаження сторінки для вставки поточного року в футер
document.addEventListener('DOMContentLoaded', function () {
    // Отримання поточного року
    const currentYear = new Date().getFullYear();

    // Вставка поточного року в елемент футера
    const footerYearElement = document.getElementById('footerYear');
    if (footerYearElement) {
        footerYearElement.textContent = currentYear;
    }
});
