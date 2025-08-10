let cart = [];
let users = [];
let currentUser = null;

document.addEventListener('DOMContentLoaded', function() {
    loadData();
    updateCartDisplay();
    updateUserDisplay();
    
    setupEventListeners();
});

function loadData() {
    try {
        cart = JSON.parse(localStorage.getItem('cart')) || [];
        users = JSON.parse(localStorage.getItem('users')) || [];
        currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
    } catch (error) {
        console.log('Error loading data from localStorage:', error);
        cart = [];
        users = [];
        currentUser = null;
    }
}

function saveData() {
    try {
        localStorage.setItem('cart', JSON.stringify(cart));
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } catch (error) {
        console.log('Error saving data to localStorage:', error);
    }
}

function setupEventListeners() {
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    
    document.getElementById('signup-form').addEventListener('submit', handleSignup);
}

function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    document.getElementById(sectionId).classList.add('active');
    
    const activeLink = document.querySelector(`[onclick="showSection('${sectionId}')"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    if (sectionId === 'cart') {
        displayCartItems();
    }
}

function toggleCategory(categoryId) {
    const categoryContent = document.getElementById(categoryId);
    const toggleIcon = document.querySelector(`[onclick="toggleCategory('${categoryId}')"] .toggle-icon`);
    
    if (categoryContent.style.display === 'none' || !categoryContent.classList.contains('show')) {
        // Show category
        categoryContent.style.display = 'grid';
        categoryContent.classList.add('show');
        toggleIcon.classList.add('rotated');
    } else {
        categoryContent.classList.remove('show');
        toggleIcon.classList.remove('rotated');
        setTimeout(() => {
            if (!categoryContent.classList.contains('show')) {
                categoryContent.style.display = 'none';
            }
        }, 300);
    }
}

function addToCart(name, price, image) {
    if (!currentUser) {
        showMessage('Please login to add items to cart', 'error');
        showSection('login');
        return;
    }
    
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            image: image,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    saveData();
    showMessage(`${name} added to cart!`, 'success');
    
    const cartCount = document.getElementById('cart-count');
    cartCount.classList.add('cart-update');
    setTimeout(() => {
        cartCount.classList.remove('cart-update');
    }, 600);
}

function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    updateCartDisplay();
    displayCartItems();
    saveData();
    showMessage('Item removed from cart', 'success');
}

function updateQuantity(name, change) {
    const item = cart.find(item => item.name === name);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(name);
        } else {
            updateCartDisplay();
            displayCartItems();
            saveData();
        }
    }
}

function updateCartDisplay() {
    const cartCount = document.getElementById('cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

function displayCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        cartTotal.style.display = 'none';
        return;
    }
    
    let cartHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        cartHTML += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p class="price">$${item.price.toFixed(2)} each</p>
                    <p>Subtotal: $${itemTotal.toFixed(2)}</p>
                </div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="updateQuantity('${item.name}', -1)">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity('${item.name}', 1)">+</button>
                    <button class="remove-btn" onclick="removeFromCart('${item.name}')">Remove</button>
                </div>
            </div>
        `;
    });
    
    cartItemsContainer.innerHTML = cartHTML;
    document.getElementById('total-amount').textContent = total.toFixed(2);
    cartTotal.style.display = 'block';
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        updateUserDisplay();
        saveData();
        showMessage(`Welcome back, ${user.name}!`, 'success');
        showSection('home');
        
        document.getElementById('login-form').reset();
    } else {
        showMessage('Invalid email or password', 'error');
    }
}

function handleSignup(e) {
    e.preventDefault();
    
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm').value;
    
    if (password !== confirmPassword) {
        showMessage('Passwords do not match', 'error');
        return;
    }
    
    if (users.some(u => u.email === email)) {
        showMessage('Email already exists', 'error');
        return;
    }
    
    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        password: password
    };
    
    users.push(newUser);
    currentUser = newUser;
    updateUserDisplay();
    saveData();
    
    showMessage(`Account created successfully! Welcome, ${name}!`, 'success');
    showSection('home');
    
    document.getElementById('signup-form').reset();
}

function logout() {
    currentUser = null;
    cart = []; 
    updateUserDisplay();
    updateCartDisplay();
    saveData();
    showMessage('Logged out successfully', 'success');
    showSection('home');
}

function updateUserDisplay() {
    const userInfo = document.getElementById('user-info');
    const usernameDisplay = document.getElementById('username-display');
    const loginLink = document.querySelector('[onclick="showSection(\'login\')"]').parentNode;
    const signupLink = document.querySelector('[onclick="showSection(\'signup\')"]').parentNode;
    
    if (currentUser) {
        userInfo.style.display = 'flex';
        usernameDisplay.textContent = `Hello, ${currentUser.name}`;
        loginLink.style.display = 'none';
        signupLink.style.display = 'none';
    } else {
        userInfo.style.display = 'none';
        loginLink.style.display = 'block';
        signupLink.style.display = 'block';
    }
}

function showMessage(message, type) {
    const existingMessages = document.querySelectorAll('.success-message, .error-message');
    existingMessages.forEach(msg => msg.remove());
    
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'success' ? 'success-message' : 'error-message';
    messageDiv.textContent = message;
    
    const activeSection = document.querySelector('.section.active .container');
    if (activeSection) {
        activeSection.insertBefore(messageDiv, activeSection.firstChild);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }
}

function initializeSampleData() {
    if (users.length === 0) {
        users.push({
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123'
        });
        saveData();
    }
}

initializeSampleData();
