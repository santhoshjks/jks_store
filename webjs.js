// Enhanced JavaScript with modern UX interactions
const products = [
    {
      name: "Vivo X200 Pro 5g Mobile",
      image: "pic/vivo.jpeg",
      link:"web21.html"
    },
    {
        name: "Apple 16 Pro Max 5g Mobile",
        image: "pic/apple.jpeg",
        link:"web22.html"
    },
    {
        name: "Samsung S24 Ultra 5g Mobile",
        image: "pic/samsung.jpeg",
        link:"web23.html"
    },
    {
      name: "Msi Creator Pro Laptop",
      image: "pic/m1.jpeg",
      link:"web31.html"
  },
  {
    name: "Asus Rog Strix Scar 17 SE Laptop",
    image: "pic/as2.jpeg",
    link:"web32.html"
  },
  {
    name: "Apple MacBook Pro m3 Max Laptop",
    image: "pic/a3.jpeg",
    link:"web33.html"
  },
  {
    name: "Samsung QA98QN990CK 98 inch Neo QLED 8K UHD Tv",
    image: "pic/s1.jpeg",
    link:"web41.html"
  },
  {
    name: "LG OLED97G2PSA 97 inch OLED evo 4K Tv",
    image: "pic/lg1.jpeg",
    link:"web42.html"
  },
  {
    name: "SONY Bravia 210.82 cm OLED 4K Ultra HD Tv",
    image: "pic/so1.jpeg",
    link:"web43.html"
  },
  {
    name: "Sony WI-1000XM2 Neckband",
    image: "pic/son1.jpeg",
    link:"web51.html"
  },
  {
    name: "Denon PerL Pro Earbuds",
    image: "pic/d1.jpeg",
    link:"web52.html"
  },
  {
    name: "Shure SE846 IEM",
    image: "pic/sh1.jpeg",
    link:"web53.html"
  },
  {
    name: "SENNHEISER AMBEO Max Soundbar",
    image: "pic/se1.jpeg",
    link:"web54.html"
  },
  {
    name: "SanDisk Extreme 4TB USB Type-C SSD",
    image: "pic/sa1.jpeg",
    link:"web55.html"
  },
  {
    name: "BANG & OLUFSEN Beoplay H95 Headphone",
    image: "pic/ba1.jpeg",
    link:"web56.html"
  }
];

// DOM Elements
const searchBar = document.getElementById("searchBar");
const clearBtn = document.getElementById("clearBtn");
const searchBtn = document.getElementById("searchBtn");
const productList = document.getElementById("productList");
const cartBtn = document.getElementById("cartBtn");

// Cart functionality
let cartCount = 0;
function updateCartCount() {
  const cartCountElement = document.querySelector(".cart-count");
  if (cartCountElement) {
    cartCountElement.textContent = cartCount;
    cartCountElement.style.display = cartCount > 0 ? 'flex' : 'none';
  }
}

// Search functionality
function displayProducts(filtered) {
  productList.innerHTML = "";

  if (filtered.length === 0) {
    productList.innerHTML = `
      <div class="no-results">
        <i class="fas fa-search"></i>
        <h3>No products found</h3>
        <p>Try searching with different keywords</p>
      </div>
    `;
    return;
  }

  filtered.forEach((product, index) => {
    const div = document.createElement("div");
    div.className = "product";
    div.style.animationDelay = `${index * 0.1}s`;

    div.innerHTML = `
      <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy">
      <div class="product-details">
        <strong>${product.name}</strong>
        <button class="view-product-btn">
          <i class="fas fa-arrow-right"></i>
          View Product
        </button>
      </div>
    `;

    // Navigate to product page on click
    const img = div.querySelector(".product-img");
    const viewBtn = div.querySelector(".view-product-btn");
    
    const navigateToProduct = () => {
      window.location.href = product.link;
    };

    img.addEventListener("click", navigateToProduct);
    viewBtn.addEventListener("click", navigateToProduct);

    productList.appendChild(div);
  });
}

function handleSearch() {
  const search = searchBar.value.trim().toLowerCase();

  if (search === "") {
    productList.innerHTML = `
      <div class="search-prompt">
        <i class="fas fa-search"></i>
        <h3>Start searching</h3>
        <p>Enter a product name to find what you're looking for</p>
      </div>
    `;
    return;
  }

  const filtered = products.filter(p => {
    const productName = p.name.toLowerCase();
    return search.split(" ").every(word => productName.includes(word)); 
  });
  
  displayProducts(filtered);
  clearBtn.style.display = "none";
}

function clearSearch() {
  searchBar.value = "";
  productList.innerHTML = "";
  clearBtn.style.display = "none";
  searchBar.focus();
}

// Event Listeners for search
searchBtn.addEventListener("click", handleSearch);

searchBar.addEventListener("input", () => {
  clearBtn.style.display = searchBar.value.trim() ? "block" : "none";
});

clearBtn.addEventListener("click", clearSearch);

searchBar.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    handleSearch();
  }
});

// Category navigation
document.addEventListener('DOMContentLoaded', () => {
  // Category card clicks
  const categoryCards = document.querySelectorAll('.category-card');
  categoryCards.forEach(card => {
    card.addEventListener('click', function() {
      const category = this.dataset.category;
      const categoryPages = {
        'mobile': 'web2.html',
        'laptop': 'web3.html', 
        'tv': 'web4.html',
        'accessories': 'web5.html'
      };
      
      if (categoryPages[category]) {
        window.location.href = categoryPages[category];
      }
    });
  });

  // Cart button click
  const cartBtn = document.getElementById('cartBtn');
  if (cartBtn) {
    cartBtn.addEventListener('click', () => {
      window.location.href = 'cart.html';
    });
  }

  // Smooth scroll for navigation
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Add scroll effect to navbar
  window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
      navbar.style.background = 'rgba(15, 23, 42, 0.98)';
      navbar.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)';
    } else {
      navbar.style.background = 'rgba(15, 23, 42, 0.95)';
      navbar.style.boxShadow = 'none';
    }
  });

  // Initialize animations on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe elements for animation
  document.querySelectorAll('.category-card, .value-item, .contact-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
  });
});

// Loading state management
function showLoadingState() {
  productList.innerHTML = `
    <div class="loading">
      <div class="spinner"></div>
      <p>Searching products...</p>
    </div>
  `;
}

// Enhanced search with debouncing
let searchTimeout;
searchBar.addEventListener('input', () => {
  clearTimeout(searchTimeout);
  const searchValue = searchBar.value.trim();
  
  clearBtn.style.display = searchValue ? "block" : "none";
  
  if (searchValue.length > 2) {
    showLoadingState();
    searchTimeout = setTimeout(() => {
      handleSearch();
    }, 500);
  } else if (searchValue.length === 0) {
    productList.innerHTML = '';
  }
});

