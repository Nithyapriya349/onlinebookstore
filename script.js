// Book Data
const books = [
    { id: 1, title: "The Art of Tomorrow", author: "Elena Vance", price: 45.00, tag: "Premium", category: "Design", image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400" },
    { id: 2, title: "Architectural Zen", author: "Sato Kenji", price: 32.00, tag: "Classic", category: "Design", image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400" },
    { id: 3, title: "Nodes of Logic", author: "Marcus Thorne", price: 28.50, tag: "Bestseller", category: "Technology", image: "https://images.unsplash.com/photo-1543004629-142a26698a3a?auto=format&fit=crop&q=80&w=400" },
    { id: 4, title: "The Silent Echo", author: "Sarah J. Maas", price: 19.99, tag: "Popular", category: "Fiction", image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&q=80&w=400" },
    { id: 5, title: "Design for Space", author: "Julian Peters", price: 55.00, tag: "Limited", category: "Technology", image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=400" },
    { id: 6, title: "The Last Horizon", author: "Clara Oswald", price: 24.00, tag: "Trending", category: "Fiction", image: "https://images.unsplash.com/photo-1532012197367-6849412618d1?auto=format&fit=crop&q=80&w=400" },
    { id: 7, title: "Cybernetic Ethics", author: "Dr. Aris Varma", price: 38.00, tag: "New", category: "Technology", image: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&q=80&w=400" },
    { id: 8, title: "Minimalist Living", author: "Lars Hudson", price: 15.50, tag: "Classic", category: "Philosophy", image: "https://images.unsplash.com/photo-1491841260033-68d799049969?auto=format&fit=crop&q=80&w=400" },
    { id: 9, title: "Ancient Shadows", author: "Yara Ben", price: 29.99, tag: "Mystery", category: "Fiction", image: "https://images.unsplash.com/photo-1512588150435-401cd7eaa9c5?auto=format&fit=crop&q=80&w=400" },
    { id: 10, title: "The Creative Act", author: "Rick Rubin", price: 42.00, tag: "Premium", category: "Design", image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=400" },
    { id: 11, title: "Stoic Calm", author: "Marcus Aurelius", price: 12.00, tag: "Essential", category: "Philosophy", image: "https://images.unsplash.com/photo-1531988042231-d39a9cc12a9a?auto=format&fit=crop&q=80&w=400" },
    { id: 12, title: "Beyond Reality", author: "S.J. Kincaid", price: 22.50, tag: "Sci-Fi", category: "Fiction", image: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=400" },
    { id: 13, title: "The Ocean of Night", author: "Gregory Benford", price: 27.00, tag: "Space", category: "Fiction", image: "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&q=80&w=400" },
    { id: 14, title: "Typographic Soul", author: "Erik Spiekermann", price: 48.00, tag: "Art", category: "Design", image: "https://images.unsplash.com/photo-1561070791-2dc269789961?auto=format&fit=crop&q=80&w=400" },
    { id: 15, title: "The AI Revolution", author: "Sam Altman", price: 65.50, tag: "Advanced", category: "Technology", image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=400" },
    { id: 16, title: "Modernist Cuisine", author: "Nathan Myhrvold", price: 120.00, tag: "Elite", category: "Design", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=400" },
    { id: 17, title: "Ego is the Enemy", author: "Ryan Holiday", price: 18.00, tag: "Bestseller", category: "Philosophy", image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=400" },
    { id: 18, title: "The Hidden Forest", author: "Peter Wohlleben", price: 21.00, tag: "Nature", category: "Philosophy", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=400" },
    { id: 19, title: "Code of the Brave", author: "Linus Torvalds", price: 35.00, tag: "Source", category: "Technology", image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=400" },
    { id: 20, title: "Vintage Architecture", author: "Frank Wright", price: 72.00, tag: "Exclusive", category: "Design", image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&q=80&w=400" },
    { id: 21, title: "Dark Matter Chronicles", author: "Blake Crouch", price: 24.50, tag: "Thriller", category: "Fiction", image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80&w=400" },
    { id: 22, title: "The Laws of Human Nature", author: "Robert Greene", price: 31.00, tag: "Classic", category: "Philosophy", image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=400" }
];

let filteredBooks = [...books];

// Unified Cart State
window.cart = JSON.parse(localStorage.getItem('nithya_cart')) || [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();

    const isBooksPage = !!document.getElementById('all-books-grid');
    if (isBooksPage) {
        renderBooks(books);
    } else {
        loadFeaturedBooks();
    }

    setupIntersectionObserver();
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
    const filterBtns = document.querySelectorAll('.cat-btn');
    filterBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

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
            <div class="book-footer">
                <span class="price">$${book.price.toFixed(2)}</span>
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
