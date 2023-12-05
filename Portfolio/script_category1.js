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

function openImageConfirmation(imagePath) {
    const confirmMessage = `Відкрити оригінальне зображення в новій вкладці?\n${imagePath}`;
    if (window.confirm(confirmMessage)) {
        window.open(imagePath, '_blank');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const categoryImages = document.querySelectorAll('.category-image');

    if (categoryImages) {
        categoryImages.forEach((image, index) => {
            image.closest('.category').addEventListener('click', function (event) {
                event.preventDefault();
                openImageConfirmation(image.src);
            });
        });
    }
});
