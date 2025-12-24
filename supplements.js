// Supplements Page JavaScript
// Handles product loading, filtering, search, and buy now functionality
// Global state
let allProducts = [];
let filteredProducts = [];
let currentSort = '';
let currentSearch = '';
let currentCategory = 'all';
let currentPage = 1;
let productsPerPage = 20;

// Load products from JSON
async function loadProducts() {
    try {
        const response = await fetch('nbs_supplements.json');
        const data = await response.json();
        allProducts = data.products;
        filteredProducts = [...allProducts];
        
        // Update total count
        const totalCountElement = document.getElementById('totalCount');
        if (totalCountElement) {
            totalCountElement.textContent = allProducts.length;
        }
        
        // Setup category button listeners
        setupCategoryFilters();
        
        renderProducts();
        updateProductCount(); // Keep this from original, as it's not explicitly removed by the instruction's snippet
    } catch (error) {
        console.error('Error loading products:', error);
        showError('Failed to load products');
    }
}

// Setup category filter dropdown
function setupCategoryFilters() {
    const categorySelect = document.getElementById('categorySelect');
    if (categorySelect) {
        categorySelect.addEventListener('change', (e) => {
            filterByCategory(e.target.value);
        });
    }
}

// Filter products by category
function filterByCategory(category) {
    currentCategory = category;
    applyFilters();
}

// Apply all filters (search, sort, price, category)
function applyFilters() {
    // Start with category-filtered products
    let products = currentCategory === 'all' 
        ? [...allProducts] 
        : allProducts.filter(p => {
            const name = p.name.toLowerCase();
            const categories = p.categories || [];
            
            // Check if it matches category
            if (categories.includes(currentCategory)) {
                return true;
            }
            
            // Check for brand matches
            if (currentCategory === 'Optimum Nutrition' && (name.includes('optimum') || name.includes('on '))) {
                return true;
            }
            if (currentCategory === 'Limitless' && name.includes('limitless')) {
                return true;
            }
            if (currentCategory === 'NOW' && name.includes('now ')) {
                return true;
            }
            if (currentCategory === 'Nutrex' && name.includes('nutrex')) {
                return true;
            }
            
            // Check for product type matches
            if (currentCategory === 'Whey Protein' && name.includes('whey')) {
                return true;
            }
            if (currentCategory === 'Creatine' && name.includes('creatine')) {
                return true;
            }
            if (currentCategory === 'Pre-Workout' && (name.includes('pre-workout') || name.includes('pre workout'))) {
                return true;
            }
            if (currentCategory === 'Amino Acids' && (name.includes('amino') || name.includes('bcaa') || name.includes('eaa'))) {
                return true;
            }
            
            return false;
        });
    
    // Apply search filter
    if (currentSearch) {
        products = products.filter(product => {
            const searchLower = currentSearch.toLowerCase();
            return product.name.toLowerCase().includes(searchLower) ||
                   (product.description && product.description.toLowerCase().includes(searchLower));
        });
    }
    
    // Apply price filter (only max price)
    const maxPrice = parseFloat(document.getElementById('maxPrice')?.value);
    
    if (!isNaN(maxPrice) && maxPrice < 5000) {
        products = products.filter(p => p.price <= maxPrice);
    }
    
    // Apply sorting
    if (currentSort) {
        products = sortProducts(products, currentSort);
    }
    
    filteredProducts = products;
    currentPage = 1; // Reset to first page when filters change
    renderProducts();
    updateProductCount();
}

// Render products to grid
function renderProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    
    if (filteredProducts.length === 0) {
        grid.innerHTML = `
            <div class="no-results" style="grid-column: 1 / -1;">
                <h3>No products found</h3>
                <p>Try adjusting your filters or search query</p>
            </div>
        `;
        document.getElementById('paginationContainer').innerHTML = '';
        return;
    }
    
    // Calculate pagination
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToShow = filteredProducts.slice(startIndex, endIndex);
    
    // Render products
    grid.innerHTML = productsToShow.map(product => `
        <div class="product-card" onclick="viewProduct('${encodeURIComponent(product.url)}')">
            <div class="product-image">
                ${product.images && product.images.length > 0 
                    ? `<img src="${product.images[0]}" alt="${product.name}">` 
                    : '<div class="product-image-placeholder">💊</div>'}
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.short_description || product.description.substring(0, 100) + '...'}</p>
                <div class="product-price">${product.price.toFixed(2)} <small>EGP</small></div>
                <span class="stock-badge ${product.in_stock ? 'in-stock' : 'out-of-stock'}">
                    ${product.in_stock ? '✓ In Stock' : '✗ Out of Stock'}
                </span>
                <button class="view-details-btn">View Details</button>
            </div>
        </div>
    `).join('');
    
    // Render pagination
    renderPagination(totalPages);
}

// Render pagination controls
function renderPagination(totalPages) {
    const container = document.getElementById('paginationContainer');
    if (!container || totalPages <= 1) {
        if (container) container.innerHTML = '';
        return;
    }
    
    let paginationHTML = '<div class="pagination">';
    
    // Previous button
    if (currentPage > 1) {
        paginationHTML += `<button class="page-btn" onclick="goToPage(${currentPage - 1})">← Prev</button>`;
    }
    
    // Page numbers
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    if (startPage > 1) {
        paginationHTML += `<button class="page-btn" onclick="goToPage(1)">1</button>`;
        if (startPage > 2) {
            paginationHTML += `<span class="page-dots">...</span>`;
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHTML += `<span class="page-dots">...</span>`;
        }
        paginationHTML += `<button class="page-btn" onclick="goToPage(${totalPages})">${totalPages}</button>`;
    }
    
    // Next button
    if (currentPage < totalPages) {
        paginationHTML += `<button class="page-btn" onclick="goToPage(${currentPage + 1})">Next →</button>`;
    }
    
    paginationHTML += '</div>';
    container.innerHTML = paginationHTML;
}

// Go to specific page
function goToPage(page) {
    currentPage = page;
    renderProducts();
    updateProductCount();
    
    // Scroll to top of products
    const container = document.querySelector('.products-section');
    if (container) {
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Search functionality
function searchProducts(query) {
    currentSearch = query.toLowerCase().trim();
    applyFilters();
}

// Helper function to sort products
function sortProducts(products, sortBy) {
    return [...products].sort((a, b) => {
        switch(sortBy) {
            case 'price-asc':
                return a.price - b.price;
            case 'price-desc':
                return b.price - a.price;
            case 'name-asc':
                return a.name.localeCompare(b.name);
            case 'name-desc':
                return b.name.localeCompare(a.name);
            default:
                return 0;
        }
    });
}

// Update product count
function updateProductCount() {
    const countElement = document.getElementById('productCount');
    if (countElement) {
        countElement.textContent = filteredProducts.length;
    }
}

// Clear all filters
function clearFilters() {
    document.getElementById('searchInput').value = '';
    const maxPrice = document.getElementById('maxPrice');
    const maxPriceDisplay = document.getElementById('maxPriceDisplay');
    const sortSelect = document.getElementById('sortSelect');
    const categorySelect = document.getElementById('categorySelect');
    
    if (maxPrice) {
        maxPrice.value = '5000';
        if (maxPriceDisplay) maxPriceDisplay.textContent = '5000';
    }
    if (sortSelect) sortSelect.value = '';
    if (categorySelect) categorySelect.value = 'all';
    
    currentSearch = '';
    currentSort = '';
    currentCategory = 'all';
    
    filteredProducts = [...allProducts];
    renderProducts();
    updateProductCount();
}

// View product details
function viewProduct(productUrl) {
    window.location.href = `supplement-detail.html?product=${productUrl}`;
}

// Toggle mobile filters
function toggleFilters() {
    const sidebar = document.querySelector('.filters-sidebar');
    if (sidebar) {
        sidebar.classList.toggle('active');
    }
}

// Product Detail Page Functions
function loadProductDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const productUrl = decodeURIComponent(urlParams.get('product'));
    
    if (!productUrl) {
        window.location.href = 'supplements.html';
        return;
    }
    
    fetch('nbs_supplements.json')
        .then(response => response.json())
        .then(data => {
            const product = data.products.find(p => p.url === productUrl);
            if (product) {
                renderProductDetail(product, data.products);
            } else {
                showError('Product not found');
                setTimeout(() => window.location.href = 'supplements.html', 2000);
            }
        })
        .catch(error => {
            console.error('Error loading product:', error);
            showError('Failed to load product details');
        });
}

function renderProductDetail(product, allProductsList) {
    document.title = `${product.name} | Supplements`;
    
    const container = document.getElementById('productDetailContainer');
    if (!container) return;
    
    // Build image carousel
    let imageHTML = '';
    if (product.images && product.images.length > 0) {
        imageHTML = `
            <div class="product-image-carousel">
                <div class="main-image">
                    <img id="mainProductImage" src="${product.images[0]}" alt="${product.name}">
                </div>
                ${product.images.length > 1 ? `
                    <div class="image-thumbnails-scroll">
                        ${product.images.map((img, index) => `
                            <img 
                                src="${img}" 
                                alt="${product.name} ${index + 1}"
                                class="thumbnail ${index === 0 ? 'active' : ''}"
                                data-index="${index}"
                            >
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    } else {
        imageHTML = '<div class="product-image-placeholder" style="font-size: 6rem;">💊</div>';
    }
    
    // Get random products for recommendations (excluding current product)
    const relatedProducts = allProductsList
        .filter(p => p.url !== product.url)
        .sort(() => 0.5 - Math.random())
        .slice(0, 4);
    
    // Build related products HTML
    let relatedHTML = '';
    if (relatedProducts.length > 0) {
        relatedHTML = `
            <div class="related-products-section">
                <h2>You May Also Like</h2>
                <div class="related-products-grid">
                    ${relatedProducts.map(relatedProduct => {
                        const relatedImage = relatedProduct.images && relatedProduct.images.length > 0 
                            ? `<img src="${relatedProduct.images[0]}" alt="${relatedProduct.name}">` 
                            : '<div class="product-image-placeholder">💊</div>';
                        
                        return `
                            <div class="product-card" data-product-url="${encodeURIComponent(relatedProduct.url)}">
                                <div class="product-image">${relatedImage}</div>
                                <div class="product-info">
                                    <h3 class="product-name">${relatedProduct.name}</h3>
                                    <div class="product-price">${relatedProduct.price.toFixed(2)} <small>EGP</small></div>
                                    <button class="view-details-btn">View Details</button>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }
    
    // Render complete page
    container.innerHTML = `
        <a href="supplements.html" class="back-link">← Back to Products</a>
        
        <div class="product-detail">
            <div class="product-detail-image">
                ${imageHTML}
            </div>
            
            <div class="product-detail-info">
                <h1>${product.name}</h1>
                
                <div class="product-detail-price">${product.price.toFixed(2)} <small>EGP</small></div>
                
                <span class="stock-badge ${product.in_stock ? 'in-stock' : 'out-of-stock'}">
                    ${product.in_stock ? '✓ In Stock' : '✗ Out of Stock'}
                </span>
                
                <div class="product-detail-description">
                    <h3>Description</h3>
                    <p>${product.description || product.short_description || 'No description available.'}</p>
                </div>
                
                <button class="buy-now-btn" id="buyNowBtn">
                    🛒 Buy Now
                </button>
            </div>
        </div>
        
        ${relatedHTML}
    `;
    
    // Add event listeners after rendering
    setupDetailPageListeners(product);
}

function setupDetailPageListeners(product) {
    // Thumbnail click listeners
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach((thumb, index) => {
        thumb.addEventListener('click', () => {
            const mainImage = document.getElementById('mainProductImage');
            if (mainImage) {
                mainImage.src = thumb.src;
                
                // Update active state
                thumbnails.forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
            }
        });
    });
    
    // Buy now button listener
    const buyNowBtn = document.getElementById('buyNowBtn');
    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', () => buyNow(JSON.stringify(product)));
    }
    
    // Related product click listeners
    const relatedCards = document.querySelectorAll('.related-products-grid .product-card');
    relatedCards.forEach(card => {
        card.addEventListener('click', () => {
            const productUrl = card.getAttribute('data-product-url');
            if (productUrl) {
                window.location.href = `supplement-detail.html?product=${productUrl}`;
            }
        });
    });
}

// Function to change main image when thumbnail is clicked (legacy support)
function changeMainImage(imageSrc, index) {
    const mainImage = document.getElementById('mainProductImage');
    if (mainImage) {
        mainImage.src = imageSrc;
        
        // Update active thumbnail
        const thumbnails = document.querySelectorAll('.thumbnail');
        thumbnails.forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });
    }
}

// Buy Now functionality
async function buyNow(productDataString) {
    let product;
    
    // Parse product data
    try {
        if (typeof productDataString === 'string') {
            product = JSON.parse(productDataString);
        } else {
            product = productDataString;
        }
    } catch (error) {
        console.error('Error parsing product data:', error);
        showError('Invalid product data');
        return;
    }
    
    const button = document.querySelector('.buy-now-btn');
    
    if (!button) return;
    
    // Disable button and show loading state
    button.disabled = true;
    button.classList.add('loading');
    const originalText = button.textContent;
    button.textContent = 'Processing...';
    
    // Prepare order data
    const orderData = {
        product_name: product.name,
        price: product.price,
        quantity: 1,
        product_url: product.url,
        timestamp: new Date().toISOString(),
        total: product.price
    };
    
    try {
        // TODO: Replace with actual endpoint URL when provided
        const endpoint = 'https://your-backend-endpoint.com/api/orders';
        
        // Make HTTP POST request
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData)
        });
        
        if (response.ok) {
            // Success
            button.textContent = '✓ Order Placed!';
            button.style.background = 'linear-gradient(135deg, #00D9FF 0%, #6C63FF 100%)';
            
            // Show success message
            showSuccess('Order placed successfully!');
            
            // Log to console for now (since we don't have a real endpoint)
            console.log('Order Data:', orderData);
            
            // Reset button after 3 seconds
            setTimeout(() => {
                button.disabled = false;
                button.classList.remove('loading');
                button.textContent = originalText;
                button.style.background = '';
            }, 3000);
        } else {
            throw new Error('Order failed');
        }
    } catch (error) {
        console.error('Order error:', error);
        console.log('Order Data (logged for testing):', orderData);
        
        // Show info message
        showInfo('Order data logged to console (endpoint not configured yet)');
        
        // Reset button
        button.disabled = false;
        button.classList.remove('loading');
        button.textContent = originalText;
    }
}

// Utility functions
function showError(message) {
    showNotification(message, 'error');
}

function showSuccess(message) {
    showNotification(message, 'success');
}

function showInfo(message) {
    showNotification(message, 'info');
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'error' ? 'var(--accent-color)' : type === 'success' ? 'var(--secondary-color)' : 'var(--primary-color)'};
        color: white;
        border-radius: 10px;
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on the listing page or detail page
    if (document.getElementById('productsGrid')) {
        // Listing page
        loadProducts();
        
        // Setup event listeners
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => searchProducts(e.target.value));
        }
        
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                currentSort = e.target.value;
                applyFilters();
            });
        }
        
        // Price slider listener
        const maxPrice = document.getElementById('maxPrice');
        const maxPriceDisplay = document.getElementById('maxPriceDisplay');
        
        if (maxPrice && maxPriceDisplay) {
            maxPrice.addEventListener('input', (e) => {
                maxPriceDisplay.textContent = e.target.value;
                applyFilters();
            });
        }
        
    } else if (document.getElementById('productDetailContainer')) {
        // Detail page
        loadProductDetail();
    }
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
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
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
// Modal functions
function openFilterModal() {
    const modal = document.getElementById('filterModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeFilterModal() {
    const modal = document.getElementById('filterModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    const modal = document.getElementById('filterModal');
    if (modal && e.target === modal) {
        closeFilterModal();
    }
});

// Close modal on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeFilterModal();
    }
});
