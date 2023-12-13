// script.js

let categoryLikes = JSON.parse(localStorage.getItem('categoryLikes')) || {};

function showCopyMessage(message) {
    const copyMessage = document.getElementById('copyMessage');
    copyMessage.innerHTML = message;
    copyMessage.style.display = 'block';

    setTimeout(function () {
        copyMessage.style.display = 'none';
    }, 2000);
}

function showCategoryActions(categoryId) {
    const actions = document.querySelector(`[data-category-id="${categoryId}"] .category-actions`);
    actions.classList.add('visible');
}

function hideCategoryActions(categoryId) {
    const actions = document.querySelector(`[data-category-id="${categoryId}"] .category-actions`);
    actions.classList.remove('visible');
}

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

document.addEventListener('lazybeforeunveil', function (e) {
    const bg = e.target.getAttribute('data-bg');
    if (bg) {
        e.target.style.backgroundImage = 'url(' + bg + ')';
    }
});

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const category = entry.target;
            category.classList.add('visible');
            observer.unobserve(category);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.category').forEach(category => {
    observer.observe(category);
});

let loadMoreContentFlag = true;

function loadMoreContent() {
    if (loadMoreContentFlag) {
        const existingContent = document.querySelectorAll('.category');
        existingContent.forEach(category => {
            category.classList.add('visible');
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

document.addEventListener('copy', () => {
    // Ваш обробник події копіювання
});

function toggleLikeCategory(categoryId, pagePath) {
    if (!categoryLikes[categoryId]) {
        categoryLikes[categoryId] = {};
    }

    if (!categoryLikes[categoryId][pagePath]) {
        categoryLikes[categoryId][pagePath] = { count: 0, liked: false };
    }

    const currentLike = categoryLikes[categoryId][pagePath];

    if (currentLike.liked) {
        currentLike.count--;
    } else {
        currentLike.count++;
    }

    currentLike.liked = !currentLike.liked;

    updateLikeCount(categoryId, currentLike.count, currentLike.liked, pagePath);
}

function updateLikeCount(categoryId, count, liked, pagePath) {
    const likeSpan = document.querySelector(`[data-category-id="${categoryId}"] .like`);
    likeSpan.innerHTML = `${liked ? '❤️' : '🤍'} ${count}`;

    categoryLikes[categoryId][pagePath] = { count, liked };

    localStorage.setItem('categoryLikes', JSON.stringify(categoryLikes));
}

document.addEventListener('DOMContentLoaded', function () {
    if (document.querySelector('.categories')) {
        Object.keys(categoryLikes).forEach(categoryId => {
            const pagePath = window.location.pathname;
            const currentLike = categoryLikes[categoryId][pagePath];

            if (currentLike) {
                updateLikeCount(categoryId, currentLike.count, currentLike.liked, pagePath);
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', function () {
    // Отримуємо поточний рік
    const currentYear = new Date().getFullYear();

    // Вставляємо поточний рік в елемент футера
    const footerYearElement = document.getElementById('footerYear');
    if (footerYearElement) {
        footerYearElement.textContent = currentYear;
    }
});