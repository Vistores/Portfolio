let categoryLikes = JSON.parse(localStorage.getItem('categoryLikes')) || {};

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

// Функція для відображення модального вікна з повідомленням
function showModal(message) {
    const modalMessage = document.getElementById('modalMessage');
    modalMessage.textContent = message;

    // Додано код для зміни видимості модального вікна
    const modal = document.getElementById('myModal');
    modal.style.display = 'flex';

    // Змінено код для автоматичного закриття модального вікна через певний час
    setTimeout(() => {
        closeModal();
    }, 2000);  // Час в мілісекундах, наприклад, 2000 мілісекунд (2 секунди)
}

// Функція для закриття модального вікна
function closeModal() {
    const modal = document.getElementById('myModal');
    modal.style.display = 'none';
}

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

        // Виводимо модальне вікно при копіюванні посилання
        showModal('Посилання скопійовано!');
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

// Використовуємо Intersection Observer для визначення, коли елемент стає видимим
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const category = entry.target;
            category.classList.add('visible');
            observer.unobserve(category); // Прибираємо зі спостереження, коли елемент вже видимий
        }
    });
}, { threshold: 0.5 }); // threshold визначає, який частка елемента має бути видимою для спрацювання

document.querySelectorAll('.category').forEach(category => {
    observer.observe(category);
});

// Додавання підгрузки по скролу
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

        // Виводимо модальне вікно при копіюванні посилання
        showModal('Посилання скопійовано!');
    });
});

// Додаємо обробник події копіювання до документу
document.addEventListener('copy', () => {
    // Виводимо модальне вікно при копіюванні (можна також використовувати ваш showModal)
    showModal('Посилання скопійовано!');
});
