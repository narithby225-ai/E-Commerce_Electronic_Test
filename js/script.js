// Shopping Cart
let cart = [];
let cartCount = 0;

// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mainNav = document.querySelector('.main-nav');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        mainNav.classList.toggle('active');
    });
}

// Product Filter
const filterBtns = document.querySelectorAll('.tab-btn');
const productCards = document.querySelectorAll('.product-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        
        productCards.forEach(card => {
            if (filter === 'all') {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 10);
            } else {
                const category = card.getAttribute('data-category');
                if (category === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            }
        });
    });
});

// Add to Cart Functionality
const addToCartBtns = document.querySelectorAll('.btn-cart');
const cartBadge = document.querySelector('.badge');

addToCartBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const productCard = e.target.closest('.product-card');
        const productName = productCard.querySelector('h3').textContent;
        const productPrice = productCard.querySelector('.price').textContent;
        
        // Add to cart array
        cart.push({
            name: productName,
            price: productPrice
        });
        
        // Update cart count
        cartCount++;
        cartBadge.textContent = cartCount;
        
        // Visual feedback
        btn.textContent = 'Added!';
        btn.style.background = '#4caf50';
        
        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
            btn.style.background = '';
        }, 1500);
        
        // Show notification
        showNotification(`${productName} added to cart!`);
    });
});

// Wishlist Functionality
const wishlistBtns = document.querySelectorAll('.product-overlay .btn-icon:first-child');

wishlistBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const icon = btn.querySelector('i');
        
        if (icon.classList.contains('far')) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            btn.style.color = '#ff6b6b';
            
            const productCard = e.target.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            showNotification(`${productName} added to wishlist!`);
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
            btn.style.color = '';
        }
    });
});

// Quick View Functionality
const quickViewBtns = document.querySelectorAll('.product-overlay .btn-icon:last-child');

quickViewBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const productCard = e.target.closest('.product-card');
        const productName = productCard.querySelector('h3').textContent;
        showNotification(`Quick view for ${productName}`);
        // Here you would typically open a modal with product details
    });
});

// Newsletter Form
const newsletterForm = document.querySelector('.newsletter-form');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input').value;
        showNotification('Thank you for subscribing!');
        newsletterForm.reset();
    });
}

// Countdown Timer
function updateCountdown() {
    const countdownValues = document.querySelectorAll('.countdown-value');
    
    if (countdownValues.length > 0) {
        let hours = parseInt(countdownValues[0].textContent);
        let minutes = parseInt(countdownValues[1].textContent);
        let seconds = parseInt(countdownValues[2].textContent);
        
        seconds--;
        
        if (seconds < 0) {
            seconds = 59;
            minutes--;
        }
        
        if (minutes < 0) {
            minutes = 59;
            hours--;
        }
        
        if (hours < 0) {
            hours = 23;
        }
        
        countdownValues[0].textContent = hours.toString().padStart(2, '0');
        countdownValues[1].textContent = minutes.toString().padStart(2, '0');
        countdownValues[2].textContent = seconds.toString().padStart(2, '0');
    }
}

setInterval(updateCountdown, 1000);

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Close mobile menu if open
            if (mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
            }
        }
    });
});

// Notification System
function showNotification(message) {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #4caf50;
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        font-weight: 500;
    `;
    
    // Add animation keyframes if not exists
    if (!document.querySelector('#notificationStyles')) {
        const style = document.createElement('style');
        style.id = 'notificationStyles';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Scroll to Top Button
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollToTopBtn.className = 'scroll-to-top';
scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: none;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    transition: all 0.3s;
`;

document.body.appendChild(scrollToTopBtn);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.style.display = 'flex';
    } else {
        scrollToTopBtn.style.display = 'none';
    }
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

scrollToTopBtn.addEventListener('mouseenter', () => {
    scrollToTopBtn.style.transform = 'scale(1.1)';
});

scrollToTopBtn.addEventListener('mouseleave', () => {
    scrollToTopBtn.style.transform = 'scale(1)';
});

// Search Functionality
const searchInput = document.querySelector('.search-bar input');
const searchBtn = document.querySelector('.search-bar button');

if (searchBtn) {
    searchBtn.addEventListener('click', () => {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (searchTerm) {
            // Filter products based on search term
            let foundProducts = 0;
            
            productCards.forEach(card => {
                const productName = card.querySelector('h3').textContent.toLowerCase();
                
                if (productName.includes(searchTerm)) {
                    card.style.display = 'block';
                    foundProducts++;
                } else {
                    card.style.display = 'none';
                }
            });
            
            if (foundProducts === 0) {
                showNotification('No products found matching your search');
            } else {
                showNotification(`Found ${foundProducts} product(s)`);
                
                // Scroll to products section
                const productsSection = document.querySelector('#products');
                if (productsSection) {
                    productsSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
            
            // Reset filter tabs
            filterBtns.forEach(btn => btn.classList.remove('active'));
            filterBtns[0].classList.add('active');
        }
    });
    
    // Allow search on Enter key
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchBtn.click();
        }
    });
}

// Category Cards Click
const categoryCards = document.querySelectorAll('.category-card');

categoryCards.forEach(card => {
    card.addEventListener('click', () => {
        const categoryName = card.querySelector('h3').textContent.toLowerCase();
        
        // Map category names to filter values
        const categoryMap = {
            'laptops': 'laptops',
            'smartphones': 'phones',
            'audio': 'accessories',
            'cameras': 'accessories',
            'accessories': 'accessories',
            'components': 'accessories'
        };
        
        const filterValue = categoryMap[categoryName] || 'all';
        
        // Scroll to products section
        const productsSection = document.querySelector('#products');
        if (productsSection) {
            productsSection.scrollIntoView({ behavior: 'smooth' });
        }
        
        // Trigger the appropriate filter
        setTimeout(() => {
            const targetBtn = document.querySelector(`[data-filter="${filterValue}"]`);
            if (targetBtn) {
                targetBtn.click();
            }
        }, 500);
    });
});

// Initialize - Show all products on load
document.addEventListener('DOMContentLoaded', () => {
    productCards.forEach(card => {
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
    });
});

console.log('TechMart E-commerce Website Loaded Successfully!');
