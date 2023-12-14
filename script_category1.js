// script.js

// Ініціалізація об'єкту для збереження лайків
let categoryLikes = JSON.parse(localStorage.getItem('categoryLikes')) || {};
let visibleCategories = 3;
let isLoading = false;

// Функція відображення дій з категорією при наведенні
function showCategoryActions(categoryId) {
    const actions = document.getElementById(`categoryActions${categoryId}`);
    actions.style.opacity = '1';
}

// Функція приховання дій з категорією при відведенні
function hideCategoryActions(categoryId) {
    const actions = document.getElementById(`categoryActions${categoryId}`);
    actions.style.opacity = '1';
}

// Функція зміни стану "лайку" категорії
function toggleLikeCategory(categoryId, event) {
    event.preventDefault();

    if (!categoryLikes[categoryId]) {
        categoryLikes[categoryId] = { count: 0, liked: false };
    }

    if (categoryLikes[categoryId].liked === undefined) {
        // Якщо лайк був undefined, робимо його лайкнутим
        categoryLikes[categoryId].liked = true;
        categoryLikes[categoryId].count = 1;
    } else {
        if (categoryLikes[categoryId].liked) {
            categoryLikes[categoryId].count--;
        } else {
            categoryLikes[categoryId].count++;
        }
    }

    categoryLikes[categoryId].liked = !categoryLikes[categoryId].liked;

    // Оновлення відображення лайків та їх збереження
    updateLikeCount(categoryId, categoryLikes[categoryId].count, categoryLikes[categoryId].liked);
}

// Функція оновлення відображення лайків та збереження їх в localStorage
function updateLikeCount(categoryId, count, liked) {
    const likeSpan = document.getElementById(`categoryActions${categoryId}`).querySelector('.like');
    likeSpan.innerHTML = `${liked ? '❤️' : '🤍'} ${count}`;

    localStorage.setItem('categoryLikes', JSON.stringify(categoryLikes));
}

// Функція відкриття підтвердження зображення
function openImageConfirmation(imagePath) {
    window.open(imagePath, '_blank');
}

// Обробник події завантаження сторінки
document.addEventListener('DOMContentLoaded', function () {
    const gallery = document.getElementById('gallery');
    const categories = document.querySelectorAll('.category');
    const totalCategories = categories.length;

    // Функція відображення перших категорій
    function showCategories() {
        for (let i = 0; i < visibleCategories; i++) {
            const category = categories[i];
            category.classList.add('visible');
        }
    }

    showCategories();

    // Функція завантаження додаткових категорій при прокручуванні
    function loadMoreCategories() {
        if (isLoading) {
            return;
        }

        isLoading = true;

        const categories = document.querySelectorAll('.category');

        for (let i = visibleCategories; i < totalCategories; i++) {
            const category = categories[i];
            const categoryOffset = category.offsetTop + category.clientHeight;
            const pageOffset = window.pageYOffset + window.innerHeight;

            if (pageOffset > categoryOffset - 200) {
                category.classList.add('visible');
                visibleCategories++;
            } else {
                break;
            }
        }

        isLoading = false;
    }

    let lastScrollTop = 0;

    // Обробник події прокрутки сторінки
    document.addEventListener('scroll', function () {
        const st = window.scrollY;

        if (st > lastScrollTop) {
            loadMoreCategories();
        }

        lastScrollTop = st <= 0 ? 0 : st;
    });

    // Додавання обробників подій для кожної категорії
    categories.forEach((category, index) => {
        const categoryId = index + 1;
        const categoryActions = document.getElementById(`categoryActions${categoryId}`);
        const likeSpan = categoryActions.querySelector('.like');
        const image = category.querySelector('.category-image');
        const imagePath = image.getAttribute('data-path');

        category.addEventListener('mouseover', function () {
            showCategoryActions(categoryId);
        });

        category.addEventListener('mouseout', function () {
            hideCategoryActions(categoryId);
        });

        likeSpan.addEventListener('click', function (event) {
            event.stopPropagation();
            toggleLikeCategory(categoryId, event);
        });

        image.addEventListener('click', function () {
            openImageConfirmation(imagePath);
        });
    });

    // Ініціалізація відображення лайків для існуючих лайків
    Object.keys(categoryLikes).forEach(categoryId => {
        const { count, liked } = categoryLikes[categoryId];
        updateLikeCount(categoryId, count, liked);
    });

    // Додавання обробника події для лінивого завантаження зображень
    document.addEventListener('lazybeforeunveil', function (e) {
        const bg = e.target.getAttribute('data-bg');
        if (bg) {
            e.target.style.backgroundImage = 'url(' + bg + ')';
        }
    });

    // Додавання обробника події для завантаження додаткових категорій при прокрутці
    document.addEventListener('scroll', function () {
        const lastCategory = document.querySelector('.category:last-child');
        const lastCategoryOffset = lastCategory.offsetTop + lastCategory.clientHeight;
        const pageOffset = window.pageYOffset + window.innerHeight;

        if (pageOffset > lastCategoryOffset - 200 && visibleCategories < totalCategories) {
            visibleCategories += 3;
            loadMoreCategories();
        }
    });

    // Додавання обробника події завантаження сторінки для вставки поточного року в футер
    document.addEventListener('DOMContentLoaded', function () {
        const footerElement = document.querySelector('footer p');
        const currentYear = new Date().getFullYear();
        footerElement.innerHTML = `&copy; ${currentYear} Докзя. Усі права захищено.`;
    });
});
