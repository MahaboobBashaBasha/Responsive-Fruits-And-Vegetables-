// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});
// Generate Product Cards
function generateProductCards() {
    const productGrid = document.querySelector('.product-grid');
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.price}</p>
            <button class="add-to-cart">Add to Cart</button>
        `;
        
        productGrid.appendChild(productCard);
    });
}

// Call function when DOM is loaded
document.addEventListener('DOMContentLoaded', generateProductCards);

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Cart state
let cart = [];

// Initialize cart functionality
document.addEventListener('DOMContentLoaded', () => {
    // Add click handlers to all "Add to Cart" buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });
});

// Add to cart function
function addToCart(event) {
    const productCard = event.target.closest('.product-card');
    const product = {
        name: productCard.querySelector('h3').textContent,
        price: parseFloat(productCard.querySelector('.price').textContent.replace('$', '').replace('/lb', '')),
        image: productCard.querySelector('img').src,
        quantity: 1
    };

    // Check if product already exists in cart
    const existingProduct = cart.find(item => item.name === product.name);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push(product);
    }

    // Show success message
    showNotification(`Added ${product.name} to cart`);
    updateCartDisplay();
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    // Remove notification after 2 seconds
    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// Update cart display
function updateCartDisplay() {
    // Calculate total items in cart
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Update cart count if it exists
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = totalItems;
    }
}

// View cart function
function viewCart() {
    if (cart.length === 0) {
        alert('Your cart is empty');
        return;
    }

    // Create or get existing modal
    let modal = document.querySelector('.cart-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.className = 'cart-modal';
        document.body.appendChild(modal);
    }

    // Calculate total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Generate cart items HTML
    const cartHTML = `
        <div class="cart-header">
            <h2>Shopping Cart</h2>
            <button class="close-modal" onclick="closeCart()">&times;</button>
        </div>
        <div class="cart-items">
            ${cart.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="item-details">
                        <h3>${item.name}</h3>
                        <p>$${item.price.toFixed(2)}/lb</p>
                        <div class="quantity-controls">
                            <button onclick="updateQuantity('${item.name}', -1)">-</button>
                            <span>${item.quantity}</span>
                            <button onclick="updateQuantity('${item.name}', 1)">+</button>
                        </div>
                    </div>
                    <button class="remove-item" onclick="removeItem('${item.name}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `).join('')}
        </div>
        <div class="cart-footer">
            <div class="cart-total">Total: $${total.toFixed(2)}</div>
            <button class="checkout-btn" onclick="checkout()">Proceed to Checkout</button>
        </div>
    `;

    modal.innerHTML = cartHTML;
    modal.classList.add('active');
}

// Close cart modal
function closeCart() {
    const modal = document.querySelector('.cart-modal');
    modal.classList.remove('active');
}

// Update item quantity
function updateQuantity(itemName, change) {
    const item = cart.find(i => i.name === itemName);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeItem(itemName);
        } else {
            viewCart(); // Refresh cart display
            updateCartDisplay();
        }
    }
}

// Remove item from cart
function removeItem(itemName) {
    cart = cart.filter(item => item.name !== itemName);
    viewCart(); // Refresh cart display
    updateCartDisplay();
    if (cart.length === 0) {
        closeCart();
    }
}

// Checkout function
function checkout() {
    alert('Proceeding to checkout...');
    // Add your checkout logic here
}

// Add this to your existing JavaScript
const observeProducts = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.product-card').forEach(card => {
        observer.observe(card);
    });
};

// Call this function when the page loads
document.addEventListener('DOMContentLoaded', observeProducts);
