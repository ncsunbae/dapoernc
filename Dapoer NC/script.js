// Theme Toggle Functionality
const themeToggle = document.getElementById('themeToggle');
const currentTheme = localStorage.getItem('theme') || 'light';

// Set initial theme
document.documentElement.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') {
        icon.className = 'fas fa-sun';
        themeToggle.setAttribute('aria-label', 'Switch to light mode');
    } else {
        icon.className = 'fas fa-moon';
        themeToggle.setAttribute('aria-label', 'Switch to dark mode');
    }
}

// DOM Elements
const hamburger = document.getElementById('hamburger');
const navMenu = document.querySelector('.nav-menu');
const cartBtn = document.getElementById('cartBtn');
const cartSidebar = document.getElementById('cartSidebar');
const closeCart = document.getElementById('closeCart');
const cartOverlay = document.getElementById('cartOverlay');
const cartItems = document.querySelector('.cart-items');
const cartCount = document.querySelector('.cart-count');
const cartTotal = document.getElementById('cartTotal');
const filterButtons = document.querySelectorAll('.filter-btn');
const catalogGrid = document.querySelector('.catalog-grid');
const contactForm = document.getElementById('contactForm');
const clearAllBtn = document.getElementById('clearAllBtn');

// Search Elements
const searchInput = document.getElementById('searchInput');
const searchClear = document.getElementById('searchClear');

// Modal Elements
const editSizeModal = document.getElementById('editSizeModal');
const closeEditModal = document.getElementById('closeEditModal');
const cancelEdit = document.getElementById('cancelEdit');
const saveEdit = document.getElementById('saveEdit');
const editProductImage = document.getElementById('editProductImage');
const editProductName = document.getElementById('editProductName');
const editCurrentSize = document.getElementById('editCurrentSize');
const editProductPrice = document.getElementById('editProductPrice');
const sizeSelectorModal = document.getElementById('sizeSelectorModal');

// Checkout Elements
const checkoutBtn = document.getElementById('checkoutBtn');
const checkoutModal = document.getElementById('checkoutModal');
const closeCheckoutModal = document.getElementById('closeCheckoutModal');
const cancelCheckout = document.getElementById('cancelCheckout');
const confirmCheckout = document.getElementById('confirmCheckout');
const checkoutForm = document.getElementById('checkoutForm');
const orderSummary = document.getElementById('orderSummary');
const summarySubtotal = document.getElementById('summarySubtotal');
const summaryShipping = document.getElementById('summaryShipping');
const summaryTotal = document.getElementById('summaryTotal');
const shippingMethod = document.getElementById('shippingMethod');

// Mobile Menu Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Fungsi untuk update menu aktif
function setActiveMenu() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= (sectionTop - 100)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Fungsi untuk handle click pada menu
function setupMenuClick() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Hapus active class dari semua link
            navLinks.forEach(link => link.classList.remove('active'));
            
            // Tambah active class ke link yang diklik
            this.classList.add('active');
            
            // Untuk mobile, tutup menu setelah klik
            if (window.innerWidth <= 768) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });
}

// Cart Toggle
cartBtn.addEventListener('click', () => {
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
});

closeCart.addEventListener('click', () => {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
});

cartOverlay.addEventListener('click', () => {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
});

// Cart Data
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Variables untuk edit size
let currentEditIndex = null;
let selectedSizeForEdit = null;
let selectedPriceForEdit = null;
let selectedSizeDescriptionForEdit = null;
let selectedStockForEdit = null;

// Shipping Rates
const shippingRates = {
    'gosend': { name: 'GoSend', rate: 15000, etd: '1-2 jam' },
    'grabrexpress': { name: 'GrabExpress', rate: 12000, etd: '1-2 jam' },
    'jne': { name: 'JNE Reguler', rate: 10000, etd: '2-3 hari' },
    'tiki': { name: 'TIKI Reguler', rate: 11000, etd: '2-3 hari' },
    'pos': { name: 'POS Indonesia', rate: 8000, etd: '3-5 hari' }
};

// ==================== SEARCH FUNCTIONALITY ====================
function setupSearch() {
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase().trim();
        
        if (searchTerm.length > 0) {
            searchClear.classList.add('show');
            performSearch(searchTerm);
        } else {
            searchClear.classList.remove('show');
            displayProducts(); // Reset ke semua produk
        }
    });
    
    searchClear.addEventListener('click', function() {
        searchInput.value = '';
        searchClear.classList.remove('show');
        displayProducts();
        searchInput.focus();
    });
    
    // Enter key untuk search (optional, tapi baik untuk accessibility)
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const searchTerm = e.target.value.toLowerCase().trim();
            if (searchTerm.length > 0) {
                performSearch(searchTerm);
            }
        }
    });
}

function performSearch(searchTerm) {
    // Auto-scroll ke section katalog dengan smooth animation
    const catalogSection = document.getElementById('catalog');
    const headerHeight = document.querySelector('.header').offsetHeight;
    const catalogPosition = catalogSection.offsetTop - headerHeight - 20;
    
    window.scrollTo({
        top: catalogPosition,
        behavior: 'smooth'
    });
    
    showLoading();
    
    // Simulate loading delay
    setTimeout(() => {
        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm) ||
            (product.sizes && product.sizes.some(size => 
                size.description.toLowerCase().includes(searchTerm)
            ))
        );
        
        displaySearchedProducts(filteredProducts, searchTerm);
        hideLoading();
    }, 300);
}

function displaySearchedProducts(filteredProducts, searchTerm) {
    catalogGrid.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        catalogGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>Produk tidak ditemukan</h3>
                <p>Tidak ada hasil untuk "${searchTerm}"</p>
                <button class="btn-secondary" id="clearSearch">Tampilkan Semua Produk</button>
            </div>
        `;
        
        document.getElementById('clearSearch').addEventListener('click', () => {
            searchInput.value = '';
            searchClear.classList.remove('show');
            displayProducts();
        });
        return;
    }
    
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        catalogGrid.appendChild(productCard);
    });
    
    // Setup event listeners untuk produk yang difilter
    setupAllSizeSelectors();
    setupAllAddToCartButtons();
    setupLazyLoading();
}

// ==================== LOADING STATES ====================
function showLoading() {
    catalogGrid.innerHTML = '';
    for (let i = 0; i < 8; i++) {
        const skeletonCard = document.createElement('div');
        skeletonCard.className = 'product-card';
        skeletonCard.innerHTML = `
            <div class="product-image">
                <div class="skeleton skeleton-image"></div>
            </div>
            <div class="product-info">
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text short"></div>
                <div class="skeleton skeleton-price"></div>
            </div>
        `;
        catalogGrid.appendChild(skeletonCard);
    }
}

function hideLoading() {
    // Loading akan hilang otomatis saat displayProducts dipanggil
}

// ==================== IMAGE OPTIMIZATION ====================
function setupLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('blur-load');
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
}

// ==================== PRODUCT CARD CREATION ====================
function createProductCard(product) {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    
    let defaultPrice = product.hasSizes 
        ? product.sizes.find(size => size.isDefault)?.price || product.sizes[0].price
        : product.price;
    
    let defaultSize = product.hasSizes 
        ? product.sizes.find(size => size.isDefault)?.size || product.sizes[0].size
        : '';
        
    let defaultSizeDescription = product.hasSizes 
        ? product.sizes.find(size => size.isDefault)?.description || product.sizes[0].description
        : '';
        
    let defaultStock = product.hasSizes 
        ? product.sizes.find(size => size.isDefault)?.stock || product.sizes[0].stock
        : product.stock || 0;
    
    productCard.innerHTML = `
        <div class="product-image">
            <img data-src="${product.image}" 
                 src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23f5f5dc'/%3E%3C/svg%3E"
                 alt="${product.name}" 
                 class="blur-load"
                 onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27300%27 height=%27200%27 viewBox=%270 0 300 200%27%3E%3Crect width=%27300%27 height=%27200%27 fill=%22%23f5f5dc%22/%3E%3C/svg%3E'">
            <div class="product-overlay">
                <button class="add-to-cart" 
                        data-id="${product.id}" 
                        data-name="${product.name}"
                        data-price="${defaultPrice}"
                        data-stock="${defaultStock}"
                        ${product.hasSizes ? `data-size="${defaultSize}" 
                        data-size-description="${defaultSizeDescription}"` : ''}>
                    + Keranjang
                </button>
            </div>
        </div>
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            ${product.hasSizes ? `<div class="size-selector" data-product="${product.id}"></div>` : ''}
            <p class="product-price">Rp ${defaultPrice.toLocaleString()}</p>
            <p class="product-stock">Stock: ${defaultStock}</p>
            ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
        </div>
    `;
    
    return productCard;
}

// ==================== CART FUNCTIONALITY ====================
function updateCart() {
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Keranjang belanja Anda kosong</p>
            </div>
        `;
        cartTotal.textContent = 'Rp 0';
        clearAllBtn.style.display = 'none';
        return;
    }
    
    clearAllBtn.style.display = 'block';
    
    let total = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'">
            </div>
            <div class="cart-item-details">
                <h4 class="cart-item-name">${item.name} <span class="cart-stock">Stock: ${item.stock}</span></h4>
                <div class="cart-item-size-info">
                    <span class="cart-item-size">Ukuran: ${item.selectedSize} - ${item.sizeDescription}</span>
                    ${item.hasSizes ? `
                    <button class="edit-size-btn" data-index="${index}">
                        <i class="fas fa-edit"></i> Edit Ukuran
                    </button>
                    ` : ''}
                </div>
                <p class="cart-item-price">Rp ${item.price.toLocaleString()}</p>
                <div class="cart-item-actions">
                    <button class="quantity-btn decrease" data-index="${index}">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn increase" data-index="${index}">+</button>
                    <button class="remove-item" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    cartTotal.textContent = `Rp ${total.toLocaleString()}`;
    
    document.querySelectorAll('.decrease').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.dataset.index;
            if (cart[index].quantity > 1) {
                cart[index].quantity--;
            } else {
                cart.splice(index, 1);
            }
            saveCart();
            updateCart();
        });
    });
    
    document.querySelectorAll('.increase').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.dataset.index;
            cart[index].quantity++;
            saveCart();
            updateCart();
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.currentTarget.dataset.index;
            const itemName = cart[index].name;
            cart.splice(index, 1);
            saveCart();
            updateCart();
            showNotification(`${itemName} dihapus dari keranjang`);
        });
    });
    
    document.querySelectorAll('.edit-size-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.currentTarget.dataset.index;
            openEditSizeModal(index);
        });
    });
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

clearAllBtn.addEventListener('click', () => {
    if (cart.length === 0) return;
    
    if (confirm('Apakah Anda yakin ingin menghapus semua item dari keranjang?')) {
        cart = [];
        saveCart();
        updateCart();
        showNotification('Semua produk dihapus dari keranjang');
    }
});

// ==================== EDIT SIZE MODAL ====================
function openEditSizeModal(index) {
    const item = cart[index];
    const product = products.find(p => p.id === item.productId);
    
    if (!product || !product.hasSizes) {
        showNotification('Produk ini tidak memiliki pilihan ukuran');
        return;
    }
    
    currentEditIndex = index;
    
    editProductImage.src = item.image;
    editProductImage.alt = item.name;
    editProductName.textContent = item.name;
    editCurrentSize.textContent = `Ukuran saat ini: ${item.selectedSize} - ${item.sizeDescription}`;
    editProductPrice.textContent = `Rp ${item.price.toLocaleString()}`;
    
    sizeSelectorModal.innerHTML = '';
    product.sizes.forEach((size, sizeIndex) => {
        const sizeBtn = document.createElement('button');
        sizeBtn.className = `size-btn ${size.size === item.selectedSize ? 'active' : ''}`;
        sizeBtn.textContent = size.size;
        sizeBtn.dataset.size = size.size;
        sizeBtn.dataset.price = size.price;
        sizeBtn.dataset.description = size.description;
        sizeBtn.dataset.stock = size.stock;
        
        if (size.size === item.selectedSize) {
            selectedSizeForEdit = size.size;
            selectedPriceForEdit = size.price;
            selectedSizeDescriptionForEdit = size.description;
            selectedStockForEdit = size.stock;
        }
        
        sizeBtn.addEventListener('click', (e) => {
            sizeSelectorModal.querySelectorAll('.size-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            e.target.classList.add('active');
            
            selectedSizeForEdit = size.size;
            selectedPriceForEdit = size.price;
            selectedSizeDescriptionForEdit = size.description;
            selectedStockForEdit = size.stock;
            
            editProductPrice.textContent = `Rp ${parseInt(size.price).toLocaleString()}`;
        });
        
        sizeSelectorModal.appendChild(sizeBtn);
    });
    
    editSizeModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeEditModalHandler() {
    editSizeModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    currentEditIndex = null;
    selectedSizeForEdit = null;
    selectedPriceForEdit = null;
    selectedSizeDescriptionForEdit = null;
    selectedStockForEdit = null;
}

closeEditModal.addEventListener('click', closeEditModalHandler);
cancelEdit.addEventListener('click', closeEditModalHandler);

saveEdit.addEventListener('click', () => {
    if (currentEditIndex === null || !selectedSizeForEdit) return;
    
    const item = cart[currentEditIndex];
    const oldSize = item.selectedSize;
    
    item.selectedSize = selectedSizeForEdit;
    item.price = parseInt(selectedPriceForEdit);
    item.sizeDescription = selectedSizeDescriptionForEdit;
    item.stock = selectedStockForEdit;
    
    item.id = `${item.productId}-${selectedSizeForEdit}`;
    
    saveCart();
    updateCart();
    closeEditModalHandler();
    
    showNotification(`Ukuran ${item.name} diubah dari ${oldSize} ke ${selectedSizeForEdit}`);
});

// ==================== CHECKOUT FUNCTIONALITY ====================
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        showNotification('Keranjang belanja Anda kosong');
        return;
    }
    openCheckoutModal();
});

function openCheckoutModal() {
    updateOrderSummary();
    checkoutModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCheckoutModalHandler() {
    checkoutModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    checkoutForm.reset();
}

closeCheckoutModal.addEventListener('click', closeCheckoutModalHandler);
cancelCheckout.addEventListener('click', closeCheckoutModalHandler);

function updateOrderSummary() {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const selectedShipping = shippingRates[shippingMethod.value];
    const shippingCost = selectedShipping ? selectedShipping.rate : 0;
    const total = subtotal + shippingCost;

    summarySubtotal.textContent = `Rp ${subtotal.toLocaleString()}`;
    summaryShipping.textContent = selectedShipping ? `Rp ${shippingCost.toLocaleString()}` : 'Rp 0';
    summaryTotal.textContent = `Rp ${total.toLocaleString()}`;

    orderSummary.innerHTML = '';
    cart.forEach(item => {
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        orderItem.innerHTML = `
            <div class="order-item-info">
                <div class="order-item-name">${item.name}</div>
                <div class="order-item-details">
                    ${item.selectedSize ? `Ukuran: ${item.selectedSize} - ${item.sizeDescription}` : ''}
                    • Qty: ${item.quantity}
                </div>
            </div>
            <div class="order-item-price">
                Rp ${(item.price * item.quantity).toLocaleString()}
            </div>
        `;
        orderSummary.appendChild(orderItem);
    });
}

shippingMethod.addEventListener('change', updateOrderSummary);

confirmCheckout.addEventListener('click', (e) => {
    e.preventDefault();
    
    if (!checkoutForm.checkValidity()) {
        showNotification('Harap lengkapi semua data yang diperlukan');
        return;
    }

    if (!shippingMethod.value) {
        showNotification('Harap pilih metode pengiriman');
        return;
    }

    processCheckout();
});

function processCheckout() {
    const formData = new FormData(checkoutForm);
    const orderData = {
        customer: {
            name: formData.get('customerName'),
            phone: formData.get('customerPhone'),
            email: formData.get('customerEmail'),
            city: formData.get('customerCity'),
            address: formData.get('customerAddress')
        },
        shipping: shippingRates[formData.get('shippingMethod')],
        notes: formData.get('orderNotes'),
        items: [...cart],
        subtotal: cart.reduce((total, item) => total + (item.price * item.quantity), 0),
        timestamp: new Date().toISOString(),
        orderId: 'DNC-' + Date.now()
    };

    orderData.total = orderData.subtotal + orderData.shipping.rate;

    saveOrderToHistory(orderData);
    
    const whatsappMessage = generateWhatsAppMessage(orderData);
    
    redirectToWhatsApp(whatsappMessage);
    
    closeCheckoutModalHandler();
    clearCartAfterCheckout();
}

function generateWhatsAppMessage(orderData) {
    const itemsText = orderData.items.map(item => 
        `• ${item.name}${item.selectedSize ? ` (${item.selectedSize})` : ''} - ${item.quantity}x Rp ${item.price.toLocaleString()} = Rp ${(item.price * item.quantity).toLocaleString()}`
    ).join('\n');

    return `🛒 *ORDER DAPOER NC - ${orderData.orderId}*

*DATA PEMESAN:*
👤 Nama: ${orderData.customer.name}
📞 No. HP: ${orderData.customer.phone}
${orderData.customer.email ? `📧 Email: ${orderData.customer.email}\n` : ''}🏠 Kota: ${orderData.customer.city}
📍 Alamat: ${orderData.customer.address}

*DETAIL PESANAN:*
${itemsText}

*PENGIRIMAN:*
🚚 ${orderData.shipping.name} (${orderData.shipping.etd})
📦 Ongkos Kirim: Rp ${orderData.shipping.rate.toLocaleString()}

*TOTAL PEMBAYARAN:*
💳 Subtotal: Rp ${orderData.subtotal.toLocaleString()}
🚚 Ongkir: Rp ${orderData.shipping.rate.toLocaleString()}
💰 *TOTAL: Rp ${orderData.total.toLocaleString()}*

${orderData.notes ? `*CATATAN:*\n${orderData.notes}\n\n` : ''}
*METODE PEMBAYARAN:*
Silahkan transfer ke:
• BCA: 123-456-7890 a.n Dapoer NC
• Mandiri: 098-765-4321 a.n Dapoer NC
• BNI: 567-890-1234 a.n Dapoer NC
• BRI: 432-109-8765 a.n Dapoer NC

Atau e-wallet:
• OVO/DANA/GoPay/ShopeePay: 089652885287

*Konfirmasi pembayaran dengan mengirimkan bukti transfer.*
_Order akan diproses dalam 1 hari kerja setelah pembayaran dikonfirmasi._`;
}

function redirectToWhatsApp(message) {
    const phoneNumber = '089652885287';
    let cleanPhone = phoneNumber.replace(/\D/g, '');
    
    if (cleanPhone.startsWith('0')) {
        cleanPhone = '62' + cleanPhone.substring(1);
    }
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
    
    console.log('Redirecting to WhatsApp:', whatsappUrl);
    
    try {
        const newWindow = window.open(whatsappUrl, '_blank');
        if (!newWindow) {
            window.location.href = whatsappUrl;
        }
    } catch (error) {
        console.error('Error opening WhatsApp:', error);
        window.location.href = whatsappUrl;
    }
}

function saveOrderToHistory(orderData) {
    const orders = JSON.parse(localStorage.getItem('orderHistory')) || [];
    orders.unshift(orderData);
    localStorage.setItem('orderHistory', JSON.stringify(orders));
}

function clearCartAfterCheckout() {
    cart = [];
    saveCart();
    updateCart();
    showNotification('Order berhasil! Silahkan lanjutkan pembayaran via WhatsApp.');
}

// ==================== PRODUCT SIZE SELECTOR ====================
function renderSizeSelector(productId, container) {
    const product = products.find(p => p.id == productId);
    if (!product || !product.hasSizes) return;
    
    container.innerHTML = '';
    
    product.sizes.forEach((size, index) => {
        const sizeBtn = document.createElement('button');
        sizeBtn.className = `size-btn ${size.isDefault ? 'active' : ''}`;
        sizeBtn.textContent = size.size;
        sizeBtn.dataset.size = size.size;
        sizeBtn.dataset.price = size.price;
        sizeBtn.dataset.description = size.description;
        sizeBtn.dataset.stock = size.stock;
        
        sizeBtn.addEventListener('click', (e) => {
            container.querySelectorAll('.size-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            e.target.classList.add('active');
            
            const productCard = container.closest('.product-card');
            const priceElement = productCard.querySelector('.product-price');
            const stockElement = productCard.querySelector('.product-stock');
            
            priceElement.textContent = `Rp ${parseInt(size.price).toLocaleString()}`;
            stockElement.textContent = `Stock: ${size.stock}`;
            
            const addToCartBtn = productCard.querySelector('.add-to-cart');
            addToCartBtn.dataset.price = size.price;
            addToCartBtn.dataset.size = size.size;
            addToCartBtn.dataset.sizeDescription = size.description;
            addToCartBtn.dataset.stock = size.stock;
        });
        
        container.appendChild(sizeBtn);
    });
}

// ==================== ADD TO CART FUNCTIONALITY ====================
function animateAddToCart(button) {
    const productCard = button.closest('.product-card');
    const productImage = productCard.querySelector('img');
    const cartBtnRect = cartBtn.getBoundingClientRect();
    const productRect = productImage.getBoundingClientRect();
    
    const flyingImage = productImage.cloneNode();
    flyingImage.style.cssText = `
        position: fixed;
        width: 50px;
        height: 50px;
        border-radius: 8px;
        object-fit: cover;
        z-index: 10000;
        left: ${productRect.left}px;
        top: ${productRect.top}px;
        transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        pointer-events: none;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    `;
    
    document.body.appendChild(flyingImage);
    
    setTimeout(() => {
        flyingImage.style.left = `${cartBtnRect.left + 10}px`;
        flyingImage.style.top = `${cartBtnRect.top + 10}px`;
        flyingImage.style.width = '20px';
        flyingImage.style.height = '20px';
        flyingImage.style.opacity = '0.5';
    }, 50);
    
    setTimeout(() => {
        if (flyingImage.parentNode) {
            flyingImage.parentNode.removeChild(flyingImage);
        }
    }, 800);
    
    cartBtn.style.transform = 'scale(1.2)';
    setTimeout(() => {
        cartBtn.style.transform = 'scale(1)';
    }, 300);
}

function handleAddToCart(event) {
    const button = event.target;
    const originalHTML = button.innerHTML;
    
    // Show loading state
    button.innerHTML = '<div class="loading-spinner"></div>';
    button.disabled = true;
    
    setTimeout(() => {
        const productId = button.dataset.id;
        const name = button.dataset.name;
        const price = parseInt(button.dataset.price);
        const stock = parseInt(button.dataset.stock);
        const image = button.closest('.product-card').querySelector('img').src;
        const selectedSize = button.dataset.size;
        const sizeDescription = button.dataset.sizeDescription;
        
        const product = products.find(p => p.id == productId);
        const hasSizes = product ? product.hasSizes : false;
        
        if (stock === 0) {
            showNotification(`${name} stok habis`);
            button.innerHTML = originalHTML;
            button.disabled = false;
            return;
        }
        
        animateAddToCart(button);
        
        const cartItemId = selectedSize ? `${productId}-${selectedSize}` : productId;
        
        const existingItem = cart.find(item => item.id === cartItemId);
        
        if (existingItem) {
            if (existingItem.quantity >= stock) {
                showNotification(`Stok ${name} tidak mencukupi. Stok tersisa: ${stock}`);
                button.innerHTML = originalHTML;
                button.disabled = false;
                return;
            }
            existingItem.quantity++;
        } else {
            cart.push({
                id: cartItemId,
                productId: parseInt(productId),
                name,
                price,
                stock,
                image,
                selectedSize,
                sizeDescription,
                quantity: 1,
                hasSizes: hasSizes
            });
        }
        
        saveCart();
        updateCart();
        
        const sizeText = selectedSize ? ` (${selectedSize})` : '';
        showNotification(`${name}${sizeText} ditambahkan ke keranjang`);
        
        button.innerHTML = originalHTML;
        button.disabled = false;
    }, 500);
}

// ==================== PRODUCT DISPLAY ====================
function setupAllAddToCartButtons() {
    document.querySelectorAll('.featured-products .add-to-cart').forEach(button => {
        button.addEventListener('click', handleAddToCart);
    });
    
    document.querySelectorAll('.catalog .add-to-cart').forEach(button => {
        button.addEventListener('click', handleAddToCart);
    });
}

function setupAllSizeSelectors() {
    document.querySelectorAll('.featured-products .size-selector').forEach(container => {
        const productId = container.dataset.product;
        renderSizeSelector(productId, container);
    });
    
    document.querySelectorAll('.catalog .size-selector').forEach(container => {
        const productId = container.dataset.product;
        renderSizeSelector(productId, container);
    });
}

function displayProducts(filter = 'all') {
    catalogGrid.innerHTML = '';
    
    const filteredProducts = filter === 'all' 
        ? products 
        : products.filter(product => product.category === filter);
    
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        catalogGrid.appendChild(productCard);
    });
    
    setupAllSizeSelectors();
    setupAllAddToCartButtons();
    setupLazyLoading();
}

// ==================== NOTIFICATION SYSTEM ====================
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// ==================== PRODUCTS DATA ====================
const products = [
    // PERALATAN MAKAN (Cutlery)
    {
        id: 1,
        name: "Sendok Kayu Premium",
        category: "cutlery",
        image: "images/sendokk.png",
        badge: "Terlaris #1",
        hasSizes: true,
        sizes: [
            {
                size: "Kecil",
                description: "Small size",
                price: 1500,
                stock: 35
            },
            {
                size: "Standar",
                description: "Standard size",
                price: 2500,
                stock: 50,
                isDefault: true
            }
        ]
    },
    {
        id: 2,
        name: "Garpu Kayu Elegant",
        category: "cutlery",
        image: "images/garpuu.png",
        badge: "Terlaris #2",
        hasSizes: true,
        sizes: [
            {
                size: "Kecil",
                description: "Small size",
                price: 1500,
                stock: 40
            },
            {
                size: "Standar",
                description: "Standard size",
                price: 2500,
                stock: 38,
                isDefault: true
            }
        ]
    },
    {
        id: 3,
        name: "Sumpit Bambu Natural",
        category: "cutlery",
        image: "images/sumpitt.png",
        badge: "Terlaris #3",
        hasSizes: true,
        sizes: [
            {
                size: "M",
                description: "20 cm",
                price: 2500,
                stock: 44,
                isDefault: true
            },
            {
                size: "L",
                description: "23 cm",
                price: 3500,
                stock: 35
            }
        ]
    },    
    {
        id: 4,
        name: "Piring",
        category: "cutlery",
        image: "images/piringg.png",
        hasSizes: true,
        sizes: [
            {
                size: "S",
                description: "7 inch",
                price: 8000,
                stock: 20,
                isDefault: true
            },
            {
                size: "M",
                description: "8 inch",
                price: 9000,
                stock: 15
            },
            {
                size: "L",
                description: "10 inch",
                price: 12000,
                stock: 10
            }
        ]
    },
    {
        id: 5,
        name: "Gelas",
        category: "cutlery",
        image: "images/gelass.png",
        hasSizes: true,
        sizes: [
            {
                size: "S",
                description: "200 ml",
                price: 7000,
                stock: 30
            },
            {
                size: "M",
                description: "300 ml",
                price: 9000,
                stock: 25,
                isDefault: true
            },
            {
                size: "L",
                description: "500 ml",
                price: 11000,
                stock: 20
            }
        ]
    },
    {
        id: 6,
        name: "Mangkuk",
        category: "cutlery",
        image: "images/mangkokk.png",
        hasSizes: true,
        sizes: [
            {
                size: "S",
                description: "300 ml",
                price: 7800,
                stock: 28
            },
            {
                size: "M",
                description: "500 ml",
                price: 9500,
                stock: 32,
                isDefault: true
            },
            {
                size: "L",
                description: "800 ml",
                price: 11000,
                stock: 18
            }
        ]
    },
    {
        id: 7,
        name: "Cangkir",
        category: "cutlery",
        image: "images/cangkirr.png",
        hasSizes: true,
        sizes: [
            {
                size: "S",
                description: "100 ml",
                price: 5000,
                stock: 26
            },
            {
                size: "M",
                description: "150 ml",
                price: 6500,
                stock: 25,
                isDefault: true
            },
            {
                size: "L",
                description: "200 ml",
                price: 8000,
                stock: 43
            }
        ]
    },
    {
        id: 8,
        name: "Mug",
        category: "cutlery",
        image: "images/mugg.png",
        hasSizes: true,
        sizes: [
            {
                size: "M",
                description: "250 ml",
                price: 8000,
                stock: 20,
                isDefault: true
            },
            {
                size: "L",
                description: "350 ml",
                price: 9500,
                stock: 13
            }
        ]
    },
    {
        id: 9,
        name: "Kotak Makan",
        category: "cutlery",
        image: "images/kotak makann.png",
        hasSizes: true,
        sizes: [
            {
                size: "S",
                description: "500 ml",
                price: 20000,
                stock: 17
            },
            {
                size: "M",
                description: "750 ml",
                price: 25000,
                stock: 20,
                isDefault: true
            },
            {
                size: "L",
                description: "1 liter",
                price: 30000,
                stock: 19
            }
        ]
    },
    {
        id: 10,
        name: "Botol Minum",
        category: "cutlery",
        image: "images/botol minumm.png",
        hasSizes: true,
        sizes: [
            {
                size: "S",
                description: "350 ml",
                price: 15000,
                stock: 35
            },
            {
                size: "M",
                description: "600 ml",
                price: 20000,
                stock: 30,
                isDefault: true
            },
            {
                size: "L",
                description: "1 liter",
                price: 25000,
                stock: 27
            }
        ]
    },

    // PERALATAN MASAK (Cookware)
    {
        id: 11,
        name: "Wajan",
        category: "cookware",
        image: "images/wajann.png",
        hasSizes: true,
        sizes: [
            {
                size: "S",
                description: "20 cm",
                price: 60000,
                stock: 37
            },
            {
                size: "M",
                description: "24 cm",
                price: 80000,
                stock: 12,
                isDefault: true
            },
            {
                size: "L",
                description: "28 cm",
                price: 100000,
                stock: 48
            }
        ]
    },
    {
        id: 12,
        name: "Panci",
        category: "cookware",
        image: "images/pancii.png",
        hasSizes: true,
        sizes: [
            {
                size: "S",
                description: "18 cm",
                price: 120000,
                stock: 24
            },
            {
                size: "M",
                description: "22 cm",
                price: 140000,
                stock: 12,
                isDefault: true
            },
            {
                size: "L",
                description: "26 cm",
                price: 160000,
                stock: 31
            }
        ]
    },
    {
        id: 13,
        name: "Spatula",
        category: "cookware",
        image: "images/spatulaa.png",
        hasSizes: true,
        sizes: [
            {
                size: "Kecil",
                description: "Small size",
                price: 15000,
                stock: 25
            },
            {
                size: "Standar",
                description: "Standard size",
                price: 18000,
                stock: 29,
                isDefault: true
            }
        ]
    },
    {
        id: 14,
        name: "Centong Nasi",
        category: "cookware",
        image: "images/centongg.png",
        hasSizes: true,
        sizes: [
            {
                size: "Kecil",
                description: "Small size",
                price: 8000,
                stock: 27
            },
            {
                size: "Standar",
                description: "Standard size",
                price: 10000,
                stock: 41,
                isDefault: true
            }
        ]
    },
    {
        id: 15,
        name: "Talenan",
        category: "cookware",
        image: "images/talenann.png",
        hasSizes: true,
        sizes: [
            {
                size: "S",
                description: "20×30 cm",
                price: 12000,
                stock: 14
            },
            {
                size: "M",
                description: "25×35 cm",
                price: 15000,
                stock: 23,
                isDefault: true
            },
            {
                size: "L",
                description: "30×40 cm",
                price: 18000,
                stock: 15
            }
        ]
    },
    {
        id: 16,
        name: "Pisau Dapur",
        category: "cookware",
        image: "images/pisauu.png",
        hasSizes: true,
        sizes: [
            {
                size: "S",
                description: "6 inch",
                price: 25000,
                stock: 25
            },
            {
                size: "M",
                description: "8 inch",
                price: 30000,
                stock: 33,
                isDefault: true
            },
            {
                size: "L",
                description: "10 inch",
                price: 35000,
                stock: 21
            }
        ]
    },
    {
        id: 17,
        name: "Parutan",
        category: "cookware",
        image: "images/parutann.png",
        hasSizes: true,
        sizes: [
            {
                size: "S",
                description: "10 cm",
                price: 8000,
                stock: 25
            },
            {
                size: "M",
                description: "15 cm",
                price: 9000,
                stock: 31,
                isDefault: true
            },
            {
                size: "L",
                description: "20 cm",
                price: 10000,
                stock: 20
            }
        ]
    },
    {
        id: 18,
        name: "Saringan Minyak",
        category: "cookware",
        image: "images/saringan minyakk.png",
        hasSizes: true,
        sizes: [
            {
                size: "M",
                description: "20 cm",
                price: 12000,
                stock: 15,
                isDefault: true
            },
            {
                size: "L",
                description: "24 cm",
                price: 15000,
                stock: 13
            }
        ]
    },
    {
        id: 19,
        name: "Saringan Teh",
        category: "cookware",
        image: "images/saringan tehh.png",
        hasSizes: true,
        sizes: [
            {
                size: "M",
                description: "6 cm",
                price: 6000,
                stock: 38,
                isDefault: true
            },
            {
                size: "L",
                description: "10 cm",
                price: 8000,
                stock: 25
            }
        ]
    },
    {
        id: 20,
        name: "Pemukul Daging",
        category: "cookware",
        image: "images/pemukul dagingg.png",
        hasSizes: true,
        sizes: [
            {
                size: "M",
                description: "20 cm",
                price: 15000,
                stock: 41,
                isDefault: true
            },
            {
                size: "L",
                description: "24 cm",
                price: 20000,
                stock: 12
            }
        ]
    },
    {
        id: 21,
        name: "Cetakan Kue",
        category: "cookware",
        image: "images/cetakan kuee.png",
        hasSizes: true,
        sizes: [
            {
                size: "S",
                description: "10 cm",
                price: 20000,
                stock: 26
            },
            {
                size: "M",
                description: "15 cm",
                price: 30000,
                stock: 18,
                isDefault: true
            },
            {
                size: "L",
                description: "20 cm",
                price: 40000,
                stock: 45
            }
        ]
    },
    {
        id: 22,
        name: "Cetakan Es",
        category: "cookware",
        image: "images/cetakan ess.png",
        hasSizes: true,
        sizes: [
            {
                size: "S",
                description: "6 lubang",
                price: 5000,
                stock: 39
            },
            {
                size: "M",
                description: "12 lubang",
                price: 6000,
                stock: 12,
                isDefault: true
            },
            {
                size: "L",
                description: "18 lubang",
                price: 7000,
                stock: 20
            }
        ]
    },
    {
        id: 23,
        name: "Blender",
        category: "cookware",
        image: "images/blenderr.png",
        hasSizes: true,
        sizes: [
            {
                size: "S",
                description: "1 liter",
                price: 250000,
                stock: 43
            },
            {
                size: "M",
                description: "1.5 liter",
                price: 350000,
                stock: 10,
                isDefault: true
            },
            {
                size: "L",
                description: "2 liter",
                price: 450000,
                stock: 36
            }
        ]
    },
    {
        id: 24,
        name: "Chopper",
        category: "cookware",
        image: "images/chopperr.png",
        hasSizes: true,
        sizes: [
            {
                size: "M",
                description: "500 ml",
                price: 90000,
                stock: 12
            },
            {
                size: "L",
                description: "700 ml",
                price: 110000,
                stock: 49,
                isDefault: true
            }
        ]
    },

    // PENYIMPANAN (Storage)
    {
        id: 25,
        name: "Teko",
        category: "storage",
        image: "images/tekoo.png",
        hasSizes: true,
        sizes: [
            {
                size: "S",
                description: "1 liter",
                price: 30000,
                stock: 15
            },
            {
                size: "M",
                description: "1.5 liter",
                price: 35000,
                stock: 26,
                isDefault: true
            },
            {
                size: "L",
                description: "2 liter",
                price: 40000,
                stock: 13
            }
        ]
    },
    {
        id: 26,
        name: "Tempat Bumbu",
        category: "storage",
        image: "images/tempat bumbuu.png",
        hasSizes: true,
        sizes: [
            {
                size: "S",
                description: "100 ml",
                price: 9000,
                stock: 26
            },
            {
                size: "M",
                description: "200 ml",
                price: 12000,
                stock: 25,
                isDefault: true
            },
            {
                size: "L",
                description: "500 ml",
                price: 15000,
                stock: 22
            }
        ]
    },
    {
        id: 27,
        name: "Rak Piring",
        category: "storage",
        image: "images/rak piringg.png",
        hasSizes: true,
        sizes: [
            {
                size: "1 Tingkat",
                description: "Single layer",
                price: 75000,
                stock: 53,
                isDefault: true
            },
            {
                size: "2 Tingkat",
                description: "Double layer",
                price: 90000,
                stock: 46
            }
        ]
    },
    {
        id: 28,
        name: "Wadah Simpan",
        category: "storage",
        image: "images/wadah simpann.png",
        hasSizes: true,
        sizes: [
            {
                size: "S",
                description: "500 ml",
                price: 50000,
                stock: 29
            },
            {
                size: "M",
                description: "1 liter",
                price: 65000,
                stock: 15,
                isDefault: true
            },
            {
                size: "L",
                description: "2 liter",
                price: 80000,
                stock: 31
            }
        ]
    },

    // AKSESORIS (Accessories)
    {
        id: 29,
        name: "Corong",
        category: "accessories",
        image: "images/corongg.png",
        hasSizes: true,
        sizes: [
            {
                size: "S",
                description: "6 cm",
                price: 6000,
                stock: 25
            },
            {
                size: "M",
                description: "8 cm",
                price: 8000,
                stock: 44,
                isDefault: true
            }
        ]
    },
    {
        id: 30,
        name: "Serbet",
        category: "accessories",
        image: "images/serbett.png",
        hasSizes: true,
        sizes: [
            {
                size: "S",
                description: "30×30 cm",
                price: 4000,
                stock: 40
            },
            {
                size: "M",
                description: "40×40 cm",
                price: 5000,
                stock: 63,
                isDefault: true
            },
            {
                size: "L",
                description: "50×50 cm",
                price: 6000,
                stock: 27
            }
        ]
    }
];

// ==================== FILTER & CONTACT ====================
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        const filter = button.dataset.filter;
        displayProducts(filter);
    });
});

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = contactForm.querySelector('input[type="text"]').value;
    const email = contactForm.querySelector('input[type="email"]').value;
    const subject = contactForm.querySelectorAll('input[type="text"]')[1].value;
    const message = contactForm.querySelector('textarea').value;
    
    console.log({ name, email, subject, message });
    
    showNotification('Pesan Anda telah terkirim! Kami akan segera merespons.');
    
    contactForm.reset();
});

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    updateCart();
    displayProducts();
    setupMenuClick();
    setupAllSizeSelectors();
    setupAllAddToCartButtons();
    setupSearch();
    setupLazyLoading();
    setActiveMenu();
    
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        setActiveMenu();
    });
    
    document.querySelectorAll('.footer-section a[data-filter]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const filter = e.target.dataset.filter;
            
            filterButtons.forEach(btn => btn.classList.remove('active'));
            document.querySelector(`.filter-btn[data-filter="${filter}"]`).classList.add('active');
            
            displayProducts(filter);
            
            document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});