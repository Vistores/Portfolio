// script.js

let categoryLikes = JSON.parse(localStorage.getItem('categoryLikes')) || {};

function showCategoryActions(categoryId) {
    const actions = document.getElementById(`categoryActions${categoryId}`);
    actions.style.opacity = '1';
}

function hideCategoryActions(categoryId) {
    const actions = document.getElementById(`categoryActions${categoryId}`);
    actions.style.opacity = '0';
}

function toggleLikeCategory(categoryId, event) {
    event.preventDefault();

    if (!categoryLikes[categoryId]) {
        categoryLikes[categoryId] = { count: 0, liked: false };
    }

    if (categoryLikes[categoryId].liked) {
        categoryLikes[categoryId].count--;
    } else {
        categoryLikes[categoryId].count++;
    }

    categoryLikes[categoryId].liked = !categoryLikes[categoryId].liked;

    updateLikeCount(categoryId, categoryLikes[categoryId].count, categoryLikes[categoryId].liked);
}

function updateLikeCount(categoryId, count, liked) {
    const likeSpan = document.getElementById(`categoryActions${categoryId}`).querySelector('.like');
    likeSpan.innerHTML = `${liked ? '❤️' : '🤍'} ${count}`;

    // Оновити Local Storage з даними про лайки
    localStorage.setItem('categoryLikes', JSON.stringify(categoryLikes));
}

document.querySelectorAll('.share').forEach((shareBtn, index) => {
    shareBtn.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();

        // Отримуємо ім'я файлу категорії
        const categoryFileName = `category${index + 1}.html`;

        // Отримуємо повний шлях до поточної сторінки та видаляємо ім'я файлу "index.html"
        const currentPath = window.location.href.replace('index.html', '');

        // Формуємо повний URL до файлу категорії
        const categoryPageURL = `${currentPath}${categoryFileName}`;

        const tempTextArea = document.createElement('textarea');
        tempTextArea.value = categoryPageURL;
        document.body.appendChild(tempTextArea);
        tempTextArea.select();
        document.execCommand('copy');
        document.body.removeChild(tempTextArea);
        alert('Посилання скопійовано!');
    });
});

// Відновлення лайків після перезавантаження сторінки
document.addEventListener('DOMContentLoaded', function () {
    Object.keys(categoryLikes).forEach(categoryId => {
        const { count, liked } = categoryLikes[categoryId];
        updateLikeCount(categoryId, count, liked);
    });
});

// Додавання підгрузки по скролу для існуючих компонентів
let loadMoreContentFlag = true;

function loadMoreContent() {
    if (loadMoreContentFlag) {
        // Ваш код для завантаження додаткового контенту
        // Наприклад, AJAX-запит або додавання нових елементів в DOM
        const existingContent = document.querySelectorAll('.category');
        existingContent.forEach(category => {
            // Ваш код для виведення існуючого контенту
        });
        loadMoreContentFlag = false;
    }
}

window.addEventListener('scroll', function () {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollTop + windowHeight >= documentHeight * 0.8) {
        loadMoreContent();
    }
});
