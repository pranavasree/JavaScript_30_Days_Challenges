// Amazon Clone JavaScript
class AmazonClone {
  constructor() {
    this.cart = JSON.parse(localStorage.getItem("amazonCart")) || [];
    this.products = [];
    this.currentFilter = "all";
    this.currentSlide = 0;
    this.productsPerPage = 12;
    this.currentPage = 1;

    this.initializeElements();
    this.setupEventListeners();
    this.loadProducts();
    this.updateCartUI();
    this.startHeroSlider();
    this.startDealTimer();
  }

  initializeElements() {
    // Header elements
    this.searchInput = document.getElementById("searchInput");
    this.searchBtn = document.getElementById("searchBtn");
    this.cartSection = document.getElementById("cartSection");
    this.cartCount = document.getElementById("cartCount");

    // Hero slider elements
    this.heroSlider = document.getElementById("heroSlider");
    this.heroPrev = document.getElementById("heroPrev");
    this.heroNext = document.getElementById("heroNext");
    this.heroIndicators = document.querySelectorAll(".indicator");

    // Product elements
    this.productsGrid = document.getElementById("productsGrid");
    this.filterBtns = document.querySelectorAll(".filter-btn");
    this.loadMoreBtn = document.getElementById("loadMoreBtn");

    // Category elements
    this.categoryCards = document.querySelectorAll(".category-card");

    // Cart modal elements
    this.cartModal = document.getElementById("cartModal");
    this.closeCart = document.getElementById("closeCart");
    this.cartBody = document.getElementById("cartBody");
    this.cartFooter = document.getElementById("cartFooter");
    this.totalAmount = document.getElementById("totalAmount");
    this.checkoutBtn = document.getElementById("checkoutBtn");
    this.continueShopping = document.getElementById("continueShopping");

    // Other elements
    this.backToTop = document.getElementById("backToTop");
    this.dealTimer = document.getElementById("dealTimer");
  }

  setupEventListeners() {
    // Search functionality
    this.searchBtn.addEventListener("click", () => this.handleSearch());
    this.searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.handleSearch();
    });

    // Hero slider controls
    this.heroPrev.addEventListener("click", () => this.previousSlide());
    this.heroNext.addEventListener("click", () => this.nextSlide());
    this.heroIndicators.forEach((indicator, index) => {
      indicator.addEventListener("click", () => this.goToSlide(index));
    });

    // Product filters
    this.filterBtns.forEach((btn) => {
      btn.addEventListener("click", () =>
        this.filterProducts(btn.dataset.filter)
      );
    });

    // Category cards
    this.categoryCards.forEach((card) => {
      card.addEventListener("click", () => {
        const category = card.dataset.category;
        this.filterProducts(category);
        document
          .querySelector(".products-section")
          .scrollIntoView({ behavior: "smooth" });
      });
    });

    // Load more products
    this.loadMoreBtn.addEventListener("click", () => this.loadMoreProducts());

    // Cart functionality
    this.cartSection.addEventListener("click", () => this.openCart());
    this.closeCart.addEventListener("click", () => this.closeCartModal());
    this.continueShopping.addEventListener("click", () =>
      this.closeCartModal()
    );
    this.checkoutBtn.addEventListener("click", () => this.handleCheckout());

    // Close cart modal on outside click
    this.cartModal.addEventListener("click", (e) => {
      if (e.target === this.cartModal) this.closeCartModal();
    });

    // Back to top
    this.backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // Show/hide back to top button
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        this.backToTop.style.display = "block";
      } else {
        this.backToTop.style.display = "none";
      }
    });
  }

  // Product data
  generateProducts() {
    const categories = [
      "electronics",
      "books",
      "clothing",
      "home",
      "sports",
      "beauty",
    ];
    const products = [];

    const productTemplates = {
      electronics: [
        {
          name: "Wireless Bluetooth Headphones",
          price: 79.99,
          originalPrice: 129.99,
          rating: 4.5,
        },
        {
          name: "Smart Watch Series 8",
          price: 299.99,
          originalPrice: 399.99,
          rating: 4.7,
        },
        {
          name: "Portable Bluetooth Speaker",
          price: 49.99,
          originalPrice: 79.99,
          rating: 4.3,
        },
        {
          name: "4K Webcam for Streaming",
          price: 89.99,
          originalPrice: 119.99,
          rating: 4.6,
        },
        {
          name: "Wireless Charging Pad",
          price: 24.99,
          originalPrice: 39.99,
          rating: 4.2,
        },
        {
          name: "Gaming Mechanical Keyboard",
          price: 129.99,
          originalPrice: 179.99,
          rating: 4.8,
        },
      ],
      books: [
        {
          name: "The Psychology of Money",
          price: 14.99,
          originalPrice: 19.99,
          rating: 4.6,
        },
        {
          name: "Atomic Habits",
          price: 12.99,
          originalPrice: 17.99,
          rating: 4.8,
        },
        {
          name: "The Silent Patient",
          price: 11.99,
          originalPrice: 15.99,
          rating: 4.4,
        },
        {
          name: "Educated: A Memoir",
          price: 13.99,
          originalPrice: 18.99,
          rating: 4.7,
        },
        {
          name: "Where the Crawdads Sing",
          price: 10.99,
          originalPrice: 14.99,
          rating: 4.5,
        },
        {
          name: "The Seven Husbands of Evelyn Hugo",
          price: 12.99,
          originalPrice: 16.99,
          rating: 4.6,
        },
      ],
      clothing: [
        {
          name: "Premium Cotton T-Shirt",
          price: 19.99,
          originalPrice: 29.99,
          rating: 4.3,
        },
        {
          name: "Slim Fit Jeans",
          price: 49.99,
          originalPrice: 79.99,
          rating: 4.5,
        },
        {
          name: "Casual Button-Down Shirt",
          price: 34.99,
          originalPrice: 54.99,
          rating: 4.4,
        },
        {
          name: "Comfortable Hoodie",
          price: 39.99,
          originalPrice: 59.99,
          rating: 4.6,
        },
        {
          name: "Athletic Running Shoes",
          price: 89.99,
          originalPrice: 129.99,
          rating: 4.7,
        },
        {
          name: "Winter Jacket",
          price: 79.99,
          originalPrice: 119.99,
          rating: 4.5,
        },
      ],
      home: [
        {
          name: "Stainless Steel Coffee Maker",
          price: 89.99,
          originalPrice: 129.99,
          rating: 4.4,
        },
        {
          name: "Memory Foam Pillow Set",
          price: 34.99,
          originalPrice: 49.99,
          rating: 4.6,
        },
        {
          name: "LED Desk Lamp",
          price: 24.99,
          originalPrice: 39.99,
          rating: 4.3,
        },
        {
          name: "Non-Stick Cookware Set",
          price: 79.99,
          originalPrice: 119.99,
          rating: 4.5,
        },
        {
          name: "Essential Oil Diffuser",
          price: 29.99,
          originalPrice: 44.99,
          rating: 4.4,
        },
        {
          name: "Bamboo Cutting Board Set",
          price: 19.99,
          originalPrice: 29.99,
          rating: 4.7,
        },
      ],
      sports: [
        {
          name: "Yoga Mat with Carrying Strap",
          price: 24.99,
          originalPrice: 39.99,
          rating: 4.5,
        },
        {
          name: "Adjustable Dumbbells Set",
          price: 149.99,
          originalPrice: 199.99,
          rating: 4.6,
        },
        {
          name: "Resistance Bands Kit",
          price: 19.99,
          originalPrice: 29.99,
          rating: 4.4,
        },
        {
          name: "Water Bottle with Time Marker",
          price: 14.99,
          originalPrice: 22.99,
          rating: 4.3,
        },
        {
          name: "Foam Roller for Recovery",
          price: 29.99,
          originalPrice: 44.99,
          rating: 4.5,
        },
        {
          name: "Bluetooth Fitness Tracker",
          price: 59.99,
          originalPrice: 89.99,
          rating: 4.7,
        },
      ],
      beauty: [
        {
          name: "Vitamin C Serum",
          price: 19.99,
          originalPrice: 29.99,
          rating: 4.6,
        },
        {
          name: "Moisturizing Face Cream",
          price: 24.99,
          originalPrice: 34.99,
          rating: 4.5,
        },
        {
          name: "Professional Hair Dryer",
          price: 79.99,
          originalPrice: 119.99,
          rating: 4.4,
        },
        {
          name: "Makeup Brush Set",
          price: 29.99,
          originalPrice: 44.99,
          rating: 4.7,
        },
        {
          name: "Gentle Cleanser",
          price: 16.99,
          originalPrice: 24.99,
          rating: 4.3,
        },
        {
          name: "Anti-Aging Night Cream",
          price: 34.99,
          originalPrice: 49.99,
          rating: 4.6,
        },
      ],
    };

    let id = 1;
    categories.forEach((category) => {
      productTemplates[category].forEach((template) => {
        products.push({
          id: id++,
          ...template,
          category,
          image: `https://picsum.photos/300/200?random=${id}`,
          badge: Math.random() > 0.7 ? "Best Seller" : null,
          reviews: Math.floor(Math.random() * 1000) + 100,
        });
      });
    });

    return products;
  }

  getCategoryColor(category) {
    const colors = {
      electronics: "FF9900",
      books: "232F3E",
      clothing: "146EB4",
      home: "B12704",
      sports: "067D62",
      beauty: "E47911",
    };
    return colors[category] || "FF9900";
  }

  loadProducts() {
    this.products = this.generateProducts();
    this.renderProducts();
  }

  renderProducts() {
    const filteredProducts =
      this.currentFilter === "all"
        ? this.products
        : this.products.filter(
            (product) => product.category === this.currentFilter
          );

    const startIndex = 0;
    const endIndex = this.currentPage * this.productsPerPage;
    const productsToShow = filteredProducts.slice(startIndex, endIndex);

    this.productsGrid.innerHTML = "";

    productsToShow.forEach((product) => {
      const productCard = this.createProductCard(product);
      this.productsGrid.appendChild(productCard);
    });

    // Show/hide load more button
    if (endIndex >= filteredProducts.length) {
      this.loadMoreBtn.style.display = "none";
    } else {
      this.loadMoreBtn.style.display = "block";
    }

    // Add fade-in animation
    this.productsGrid.classList.add("fade-in");
    setTimeout(() => this.productsGrid.classList.remove("fade-in"), 500);
  }

  createProductCard(product) {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${
      product.name
    }" loading="lazy">
                ${
                  product.badge
                    ? `<div class="product-badge">${product.badge}</div>`
                    : ""
                }
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-rating">
                    <div class="stars">
                        ${this.generateStars(product.rating)}
                    </div>
                    <span class="rating-count">(${product.reviews})</span>
                </div>
                <div class="product-price">
                    <span class="current-price">$${product.price}</span>
                    ${
                      product.originalPrice
                        ? `<span class="original-price">$${product.originalPrice}</span>`
                        : ""
                    }
                    ${
                      product.originalPrice
                        ? `<span class="price-discount">${Math.round(
                            (1 - product.price / product.originalPrice) * 100
                          )}% off</span>`
                        : ""
                    }
                </div>
                <div class="product-actions">
                    <button class="add-to-cart-btn" onclick="amazonClone.addToCart(${
                      product.id
                    })">
                        Add to Cart
                    </button>
                    <button class="wishlist-btn" onclick="amazonClone.toggleWishlist(${
                      product.id
                    })">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
            </div>
        `;
    return card;
  }

  generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    let starsHTML = "";

    for (let i = 0; i < fullStars; i++) {
      starsHTML += '<i class="fas fa-star star"></i>';
    }

    if (hasHalfStar) {
      starsHTML += '<i class="fas fa-star-half-alt star"></i>';
    }

    for (let i = 0; i < emptyStars; i++) {
      starsHTML += '<i class="far fa-star star empty"></i>';
    }

    return starsHTML;
  }

  filterProducts(filter) {
    this.currentFilter = filter;
    this.currentPage = 1;

    // Update filter buttons
    this.filterBtns.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.filter === filter);
    });

    this.renderProducts();
  }

  loadMoreProducts() {
    this.currentPage++;
    this.renderProducts();
  }

  handleSearch() {
    const query = this.searchInput.value.trim().toLowerCase();
    if (!query) return;

    const filteredProducts = this.products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
    );

    this.productsGrid.innerHTML = "";

    if (filteredProducts.length === 0) {
      this.productsGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                    <h3>No products found for "${query}"</h3>
                    <p>Try searching for something else.</p>
                </div>
            `;
      this.loadMoreBtn.style.display = "none";
      return;
    }

    filteredProducts.forEach((product) => {
      const productCard = this.createProductCard(product);
      this.productsGrid.appendChild(productCard);
    });

    this.loadMoreBtn.style.display = "none";

    // Scroll to products section
    document
      .querySelector(".products-section")
      .scrollIntoView({ behavior: "smooth" });
  }

  // Hero slider functionality
  startHeroSlider() {
    setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  nextSlide() {
    const slides = document.querySelectorAll(".hero-slide");
    this.currentSlide = (this.currentSlide + 1) % slides.length;
    this.updateSlider();
  }

  previousSlide() {
    const slides = document.querySelectorAll(".hero-slide");
    this.currentSlide =
      this.currentSlide === 0 ? slides.length - 1 : this.currentSlide - 1;
    this.updateSlider();
  }

  goToSlide(index) {
    this.currentSlide = index;
    this.updateSlider();
  }

  updateSlider() {
    const slides = document.querySelectorAll(".hero-slide");
    const indicators = document.querySelectorAll(".indicator");

    slides.forEach((slide, index) => {
      slide.classList.toggle("active", index === this.currentSlide);
    });

    indicators.forEach((indicator, index) => {
      indicator.classList.toggle("active", index === this.currentSlide);
    });
  }

  // Cart functionality
  addToCart(productId) {
    const product = this.products.find((p) => p.id === productId);
    if (!product) return;

    const existingItem = this.cart.find((item) => item.id === productId);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cart.push({
        ...product,
        quantity: 1,
      });
    }

    this.saveCart();
    this.updateCartUI();
    this.showAddToCartFeedback();
  }

  removeFromCart(productId) {
    this.cart = this.cart.filter((item) => item.id !== productId);
    this.saveCart();
    this.updateCartUI();
    this.renderCartItems();
  }

  updateQuantity(productId, change) {
    const item = this.cart.find((item) => item.id === productId);
    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
      this.removeFromCart(productId);
    } else {
      this.saveCart();
      this.updateCartUI();
      this.renderCartItems();
    }
  }

  saveCart() {
    localStorage.setItem("amazonCart", JSON.stringify(this.cart));
  }

  updateCartUI() {
    const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
    this.cartCount.textContent = totalItems;

    if (totalItems > 0) {
      this.cartCount.style.display = "flex";
    } else {
      this.cartCount.style.display = "none";
    }
  }

  openCart() {
    this.cartModal.classList.add("active");
    this.renderCartItems();
    document.body.style.overflow = "hidden";
  }

  closeCartModal() {
    this.cartModal.classList.remove("active");
    document.body.style.overflow = "auto";
  }

  renderCartItems() {
    if (this.cart.length === 0) {
      this.cartBody.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                    <button class="continue-shopping" onclick="amazonClone.closeCartModal()">Continue Shopping</button>
                </div>
            `;
      this.cartFooter.style.display = "none";
      return;
    }

    this.cartBody.innerHTML = "";

    this.cart.forEach((item) => {
      const cartItem = document.createElement("div");
      cartItem.className = "cart-item";
      cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">$${item.price}</div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn" onclick="amazonClone.updateQuantity(${item.id}, -1)">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn" onclick="amazonClone.updateQuantity(${item.id}, 1)">+</button>
                        <button class="remove-item" onclick="amazonClone.removeFromCart(${item.id})">Remove</button>
                    </div>
                </div>
            `;
      this.cartBody.appendChild(cartItem);
    });

    const total = this.cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    this.totalAmount.textContent = `$${total.toFixed(2)}`;
    this.cartFooter.style.display = "block";
  }

  showAddToCartFeedback() {
    // Create a temporary notification
    const notification = document.createElement("div");
    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #067D62;
            color: white;
            padding: 12px 20px;
            border-radius: 4px;
            z-index: 3000;
            animation: slideIn 0.3s ease;
        `;
    notification.textContent = "Added to cart!";

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 2000);
  }

  handleCheckout() {
    alert(
      "Checkout functionality would be implemented here. Total: " +
        this.totalAmount.textContent
    );
  }

  toggleWishlist(productId) {
    // Wishlist functionality would be implemented here
    console.log("Toggle wishlist for product:", productId);
  }

  // Deal timer functionality
  startDealTimer() {
    const timer = this.dealTimer.querySelector(".timer-time");
    if (!timer) return;

    let hours = 12;
    let minutes = 34;
    let seconds = 56;

    setInterval(() => {
      seconds--;

      if (seconds < 0) {
        seconds = 59;
        minutes--;

        if (minutes < 0) {
          minutes = 59;
          hours--;

          if (hours < 0) {
            hours = 23;
          }
        }
      }

      const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
      timer.textContent = formattedTime;
    }, 1000);
  }
}

// Initialize the application
let amazonClone;
document.addEventListener("DOMContentLoaded", () => {
  amazonClone = new AmazonClone();
});

// Add CSS for notification animation
const style = document.createElement("style");
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
`;
document.head.appendChild(style);
