// script_category1.js
let categoryLikes = JSON.parse(localStorage.getItem('categoryLikes')) || {};
let visibleCategories = 3; // Початкова кількість видимих категорій
let isLoading = false;

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

    localStorage.setItem('categoryLikes', JSON.stringify(categoryLikes));
}

function openImageConfirmation(imagePath) {
    const confirmMessage = `Відкрити оригінальне зображення в новій вкладці?\n${imagePath}`;
    if (window.confirm(confirmMessage)) {
        window.open(imagePath, '_blank');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const categories = document.querySelectorAll('.category');
    const totalCategories = categories.length;
    const categoriesPerPage = 3;
    let visibleCategories = categoriesPerPage;

    function showCategories() {
        for (let i = 0; i < visibleCategories; i++) {
            const category = categories[i];
            category.classList.add('visible');
        }
    }

    showCategories();

    window.addEventListener('scroll', function () {
        const lastCategory = document.querySelector('.category:last-child');
        const lastCategoryOffset = lastCategory.offsetTop + lastCategory.clientHeight;
        const pageOffset = window.pageYOffset + window.innerHeight;

        if (pageOffset > lastCategoryOffset - 200 && visibleCategories < totalCategories) {
            visibleCategories += categoriesPerPage;
            showCategories();
        }
    });

    // Додаємо обробник події для кожного зображення в категорії
    categories.forEach((category, index) => {
        const image = category.querySelector('.category-image');
        image.addEventListener('click', function () {
            const imagePath = image.src;
            openImageConfirmation(imagePath);
        });
    });

    Object.keys(categoryLikes).forEach(categoryId => {
        const { count, liked } = categoryLikes[categoryId];
        updateLikeCount(categoryId, count, liked);
    });

    document.addEventListener('lazybeforeunveil', function (e) {
        const bg = e.target.getAttribute('data-bg');
        if (bg) {
            e.target.style.backgroundImage = 'url(' + bg + ')';
        }
    });

    window.addEventListener('scroll', function () {
        const lastCategory = document.querySelector('.category:last-child');
        const lastCategoryOffset = lastCategory.offsetTop + lastCategory.clientHeight;
        const pageOffset = window.pageYOffset + window.innerHeight;

        if (pageOffset > lastCategoryOffset - 200) {
            loadMoreCategories();
        }
    });
});

function loadMoreCategories() {
    if (isLoading) {
        return;
    }

    isLoading = true;

    const categories = document.querySelectorAll('.category');
    const totalCategories = categories.length;

    for (let i = visibleCategories; i < visibleCategories + 3 && i < totalCategories; i++) {
        const category = categories[i];
        category.classList.add('visible');
    }

    visibleCategories += 3;

    isLoading = false;
}
