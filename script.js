let categoryLikes = JSON.parse(localStorage.getItem('categoryLikes')) || {};
// Функція для відображення блоку повідомлення
function showCopyMessage(message) {
    const copyMessage = document.getElementById('copyMessage');
    copyMessage.innerHTML = message;
    copyMessage.style.display = 'block';
    // Через 2 секунди сховати повідомлення
    setTimeout(function () {
        copyMessage.style.display = 'none';
    }, 2000);
}
function showCategoryActions(categoryId) {
    const actions = document.getElementById(`categoryActions${categoryId}`);
    actions.classList.add('visible');
}
function hideCategoryActions(categoryId) {
    const actions = document.getElementById(`categoryActions${categoryId}`);
    actions.classList.remove('visible');
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

document.querySelectorAll('.share').forEach((shareBtn, index) => {
    shareBtn.addEventListener('copy', (event) => {
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

        // Виводимо повідомлення про копіювання
        showCopyMessage('Посилання скопійовано!');
    });
});


document.addEventListener('DOMContentLoaded', function () {
    Object.keys(categoryLikes).forEach(categoryId => {
        const { count, liked } = categoryLikes[categoryId];
        updateLikeCount(categoryId, count, liked);
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
