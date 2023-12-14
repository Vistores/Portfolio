let categoryLikes = JSON.parse(localStorage.getItem('categoryLikes')) || {};
let visibleCategories = 3;
let isLoading = false;

function showCategoryActions(categoryId) {
    const actions = document.getElementById(`categoryActions${categoryId}`);
    actions.style.opacity = '1';
}

function hideCategoryActions(categoryId) {
    const actions = document.getElementById(`categoryActions${categoryId}`);
    actions.style.opacity = '1';
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

    // Перевірка на "undefined" та встановлення значення на "0", якщо потрібно
    if (localStorage.getItem('categoryLikes') === undefined) {
        localStorage.setItem('categoryLikes', JSON.stringify(categoryLikes));
    } else {
        localStorage.setItem('categoryLikes', JSON.stringify(categoryLikes || {}));
    }
}

function openImageConfirmation(imagePath) {
        window.open(imagePath, '_blank');
}

document.addEventListener('DOMContentLoaded', function () {
    const gallery = document.getElementById('gallery');
    const categories = document.querySelectorAll('.category');
    const totalCategories = categories.length;

    function showCategories() {
        for (let i = 0; i < visibleCategories; i++) {
            const category = categories[i];
            category.classList.add('visible');
        }
    }

    showCategories();

    function loadMoreCategories() {
        if (isLoading) {
            return;
        }

        isLoading = true;

        const categories = document.querySelectorAll('.category');
        const totalCategories = categories.length;
        const batchSize = 3;
        const distanceToLoad = 200;

        for (let i = visibleCategories; i < totalCategories; i++) {
            const category = categories[i];
            const categoryOffset = category.offsetTop + category.clientHeight;
            const pageOffset = window.pageYOffset + window.innerHeight;

            if (pageOffset > categoryOffset - distanceToLoad) {
                category.classList.add('visible');
                visibleCategories++;
            } else {
                break;
            }
        }

        isLoading = false;
    }

    let lastScrollTop = 0;

    document.addEventListener('scroll', function () {
        const st = window.scrollY;

        if (st > lastScrollTop) {
            loadMoreCategories();
        }

        lastScrollTop = st <= 0 ? 0 : st;
    });

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

    document.addEventListener('scroll', function () {
        const lastCategory = document.querySelector('.category:last-child');
        const lastCategoryOffset = lastCategory.offsetTop + lastCategory.clientHeight;
        const pageOffset = window.pageYOffset + window.innerHeight;

        if (pageOffset > lastCategoryOffset - 200 && visibleCategories < totalCategories) {
            visibleCategories += 3;
            loadMoreCategories();
        }
    });

    document.addEventListener('DOMContentLoaded', function () {
        const footerElement = document.querySelector('footer p');
        const currentYear = new Date().getFullYear();
        footerElement.innerHTML = `&copy; ${currentYear} Докзя. Усі права захищено.`;
    });
});
