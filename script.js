// Book Data
let books = [];
let filteredBooks = [];

// Unified Cart State
window.cart = JSON.parse(localStorage.getItem('nithya_cart')) || [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();

    // Fetch books from PHP backend
    fetch('api.php?action=books')
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                books = data.data;
                filteredBooks = [...books];
                
                const isBooksPage = !!document.getElementById('all-books-grid');
                if (isBooksPage) {
                    renderBooks(books);
                    
                    const urlParams = new URLSearchParams(window.location.search);
                    const catParam = urlParams.get('cat');
                    if (catParam) {
                        const capitalized = catParam.charAt(0).toUpperCase() + catParam.slice(1);
                        filterByCategory(capitalized);
                        
                        // Update active button state
                        const btns = document.querySelectorAll('.cat-btn');
                        btns.forEach(b => b.classList.remove('active'));
                        btns.forEach(btn => {
                            if (btn.innerText === capitalized) {
                                btn.classList.add('active');
                            }
                        });
                    }
                } else {
                    loadFeaturedBooks();
                }

                setupIntersectionObserver();
            }
        })
        .catch(err => {
            console.error("Error fetching books:", err);
        });
});

function renderBooks(booksToRender) {
    const grid = document.getElementById('all-books-grid');
    if (!grid) return;
    grid.innerHTML = '';
    booksToRender.forEach(book => {
        grid.appendChild(createBookCard(book));
    });
    setupIntersectionObserver();
}

function filterByCategory(category) {
    if (window.event && window.event.target && window.event.target.classList) {
        const filterBtns = document.querySelectorAll('.cat-btn');
        filterBtns.forEach(btn => btn.classList.remove('active'));
        window.event.target.classList.add('active');
    }

    if (category === 'All') {
        filteredBooks = [...books];
    } else {
        filteredBooks = books.filter(b => b.category === category);
    }
    applyCurrentSort();
}

function sortBooks(type) {
    if (type === 'price-low') {
        filteredBooks.sort((a, b) => a.price - b.price);
    } else if (type === 'price-high') {
        filteredBooks.sort((a, b) => b.price - a.price);
    } else if (type === 'alphabetical') {
        filteredBooks.sort((a, b) => a.title.localeCompare(b.title));
    }
    renderBooks(filteredBooks);
}

function applyCurrentSort() {
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) sortBooks(sortSelect.value);
    else renderBooks(filteredBooks);
}

// Load Featured Books
function loadFeaturedBooks() {
    const grid = document.getElementById('featured-books');
    if (!grid) return;

    // Clear static demo cards if they exist
    grid.innerHTML = '';

    books.slice(0, 3).forEach(book => {
        const card = createBookCard(book);
        grid.appendChild(card);
    });
}

function createBookCard(book) {
    const div = document.createElement('div');
    div.className = 'book-card fade-in';
    div.innerHTML = `
        <div class="book-img" onclick="window.location.href='details.html?id=${book.id}'" style="cursor: pointer;">
            <span class="book-tag">${book.tag}</span>
            <img src="${book.image}" alt="${book.title}" loading="lazy">
        </div>
        <div class="book-info">
            <h3 onclick="window.location.href='details.html?id=${book.id}'" style="cursor: pointer;">${book.title}</h3>
            <p class="author">${book.author}</p>
            <div class="rating" style="color: #f39c12; margin-bottom: 0.5rem; font-size: 0.9rem;">
                ${getStars(book.rating)} <span style="color: var(--text-muted); font-size: 0.8rem;">(${book.rating ? book.rating.toFixed(1) : '4.5'})</span>
            </div>
            <div class="book-footer">
                <span class="price">$${parseFloat(book.price).toFixed(2)}</span>
                <button class="add-btn" onclick="addToCart(${book.id})"><i class="fa-solid fa-plus"></i></button>
            </div>
        </div>
    `;
    return div;
}

// Cart Functions
window.addToCart = (bookId) => {
    const book = books.find(b => b.id === bookId);
    if (book) {
        cart.push(book);
        localStorage.setItem('nithya_cart', JSON.stringify(cart));
        updateCartCount();
        showNotification(`${book.title} added to cart!`);
    }
};

function updateCartCount() {
    const countElement = document.querySelector('.cart-count');
    if (countElement) {
        countElement.innerText = cart.length;
        countElement.style.transform = 'scale(1.2)';
        setTimeout(() => countElement.style.transform = 'scale(1)', 200);
    }
}

function showNotification(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--primary);
        color: white;
        padding: 1rem 2rem;
        border-radius: 12px;
        z-index: 10000;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        animation: slideIn 0.3s ease-out;
    `;
    toast.innerText = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// intersection Observer for animations
function setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

// Add animation keyframes via JS
const style = document.createElement('style');
style.innerHTML = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

function getStars(rating) {
    const r = rating || 4.5;
    const full = Math.floor(r);
    const half = (r - full) >= 0.5;
    let stars = '';
    for(let i=0; i<full; i++) stars += '<i class="fa-solid fa-star"></i>';
    if(half) stars += '<i class="fa-solid fa-star-half-stroke"></i>';
    const empty = 5 - Math.ceil(r);
    for(let i=0; i<empty; i++) stars += '<i class="fa-regular fa-star"></i>';
    return stars;
}
