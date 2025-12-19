// Enhanced JavaScript with modern UX interactions

// Initialize EmailJS
(function() {
  emailjs.init("FAE_nIAcE1v619yjf"); // Replace with your EmailJS public key
})();

// Email Verification System
class EmailVerification {
  constructor() {
    this.verificationCode = '';
    this.userEmail = '';
    this.timer = null;
    this.timeLeft = 60;
    this.isEmailVerified = false;
  }

  generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendVerificationEmail(email, name) {
    this.verificationCode = this.generateVerificationCode();
    this.userEmail = email;

    try {
      // EmailJS configuration - replace with your actual service details
      const templateParams = {
        email: email,
        name: name,
        verification_code: this.verificationCode,
        from_name: 'JKS Store',
        reply_to: 'jksstore345@gmail.com'
      };

      // Replace with your EmailJS service ID and template ID
      await emailjs.send('service_bzddknq', 'template_29ckwl4', templateParams);
      
      return { success: true, message: 'Verification code sent successfully' };
    } catch (error) {
      console.error('EmailJS error:', error);
      // Fallback for development - show code in console
      console.log('Verification code (development):', this.verificationCode);
      return { success: true, message: 'Verification code sent (check console for dev)' };
    }
  }

  verifyCode(inputCode) {
    return inputCode === this.verificationCode;
  }

  startTimer(callback) {
    this.timeLeft = 60;
    this.updateTimerDisplay(callback);
    
    this.timer = setInterval(() => {
      this.timeLeft--;
      this.updateTimerDisplay(callback);
      
      if (this.timeLeft <= 0) {
        clearInterval(this.timer);
        callback(true); // Enable resend button
      }
    }, 1000);
  }

  updateTimerDisplay(callback) {
    const timerCount = document.getElementById('timerCount');
    const resendBtn = document.getElementById('resendCode');
    
    if (timerCount) {
      timerCount.textContent = this.timeLeft;
    }
    
    if (resendBtn) {
      resendBtn.disabled = this.timeLeft > 0;
      if (this.timeLeft <= 0) {
        callback(true);
      }
    }
  }

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}

const emailVerification = new EmailVerification();

// Authentication System
class AuthSystem {
  constructor() {
    this.currentUser = null;
    this.initializeAuth();
  }

  initializeAuth() {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      this.currentUser = JSON.parse(userData);
      this.updateUI();
    }
  }

  async register(name, email, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    if (users.find(user => user.email === email)) {
      return { success: false, message: 'Email already registered' };
    }

    // Store temporary user data pending verification
    const tempUser = {
      id: Date.now().toString(),
      name,
      email,
      password: btoa(password),
      createdAt: new Date().toISOString(),
      emailVerified: false
    };

    localStorage.setItem('tempUser', JSON.stringify(tempUser));
    
    return { success: true, message: 'Please verify your email to complete registration', tempUser };
  }

  completeRegistration() {
    const tempUser = JSON.parse(localStorage.getItem('tempUser'));
    if (!tempUser) {
      return { success: false, message: 'No pending registration found' };
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Check if email already exists in main users
    if (users.find(user => user.email === tempUser.email)) {
      localStorage.removeItem('tempUser');
      return { success: false, message: 'Email already registered' };
    }

    // Add verified user to main users list
    const verifiedUser = {
      ...tempUser,
      emailVerified: true,
      verifiedAt: new Date().toISOString()
    };

    users.push(verifiedUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Auto-login after successful registration
    this.currentUser = {
      id: verifiedUser.id,
      name: verifiedUser.name,
      email: verifiedUser.email
    };

    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    localStorage.removeItem('tempUser');
    this.updateUI();
    
    return { success: true, message: 'Registration completed successfully' };
  }

  login(email, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email);

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    if (user.password !== btoa(password)) {
      return { success: false, message: 'Invalid password' };
    }

    this.currentUser = {
      id: user.id,
      name: user.name,
      email: user.email
    };

    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    this.updateUI();
    
    return { success: true, message: 'Login successful' };
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
    this.updateUI();
  }

  updateUI() {
    const userInfo = document.getElementById('userInfo');
    const authButtons = document.getElementById('authButtons');
    const userName = document.querySelector('.user-name');
    const dropdownUsername = document.querySelector('.dropdown-username');
    const cartBtn = document.getElementById('cartBtn');

    if (this.currentUser) {
      userInfo.style.display = 'flex';
      authButtons.style.display = 'none';
      if (cartBtn) cartBtn.style.display = 'flex';
      if (userName) userName.textContent = this.currentUser.name;
      if (dropdownUsername) dropdownUsername.textContent = this.currentUser.name;
    } else {
      userInfo.style.display = 'none';
      authButtons.style.display = 'flex';
      if (cartBtn) cartBtn.style.display = 'none';
    }
  }

  isAuthenticated() {
    return this.currentUser !== null;
  }
}

const auth = new AuthSystem();

// Modal Management
class AuthModal {
  constructor() {
    this.modal = document.getElementById('authModal');
    this.isLoginMode = true;
    this.initializeEventListeners();
  }

  initializeEventListeners() {
    const loginBtn = document.getElementById('loginBtn');
   
    const closeBtn = document.getElementById('authClose');
    const switchBtn = document.getElementById('authSwitchBtn');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const logoutBtn = document.getElementById('logoutBtn');

    loginBtn?.addEventListener('click', () => this.showModal(true));
    
    closeBtn?.addEventListener('click', () => this.hideModal());
    switchBtn?.addEventListener('click', () => this.switchMode());
    logoutBtn?.addEventListener('click', () => this.handleLogout());

    loginForm?.addEventListener('submit', (e) => this.handleLogin(e));
    registerForm?.addEventListener('submit', (e) => this.handleRegister(e));

    this.modal?.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.hideModal();
      }
    });

    // Initialize user dropdown functionality
    this.initializeUserDropdown();
  }

  initializeUserDropdown() {
    const userMenuBtn = document.getElementById('userMenuBtn');
    const userDropdown = document.getElementById('userDropdown');
    const dropdownUsername = document.querySelector('.dropdown-username');

    if (!userMenuBtn || !userDropdown) return;

    // Toggle dropdown
    userMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = userDropdown.classList.contains('show');
      
      // Close all other dropdowns
      document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
        menu.classList.remove('show');
      });
      document.querySelectorAll('.user-menu-btn.active').forEach(btn => {
        btn.classList.remove('active');
      });

      if (!isOpen) {
        userDropdown.classList.add('show');
        userMenuBtn.classList.add('active');
        
        // Update dropdown username
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && dropdownUsername) {
          dropdownUsername.textContent = currentUser.name;
        }
      }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!userDropdown.contains(e.target) && !userMenuBtn.contains(e.target)) {
        userDropdown.classList.remove('show');
        userMenuBtn.classList.remove('active');
      }
    });

    // Close dropdown when escape key is pressed
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        userDropdown.classList.remove('show');
        userMenuBtn.classList.remove('active');
      }
    });
  }

  showModal(isLogin = true) {
    this.isLoginMode = isLogin;
    this.updateModalContent();
    this.modal.style.display = 'flex';
  }

  hideModal() {
    this.modal.style.display = 'none';
    this.clearForms();
  }

  switchMode() {
    this.isLoginMode = !this.isLoginMode;
    this.updateModalContent();
  }

  updateModalContent() {
    const title = document.getElementById('authTitle');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const switchText = document.getElementById('authSwitchText');
    const switchBtn = document.getElementById('authSwitchBtn');

    if (this.isLoginMode) {
      title.textContent = 'Login';
      loginForm.style.display = 'block';
      registerForm.style.display = 'none';
      switchText.textContent = "Don't have an account?";
      switchBtn.textContent = 'Register';
    } else {
      title.textContent = 'Register';
      loginForm.style.display = 'none';
      registerForm.style.display = 'block';
      switchText.textContent = 'Already have an account?';
      switchBtn.textContent = 'Login';
    }
  }

  handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const result = auth.login(email, password);
    if (result.success) {
      this.hideModal();
      this.showNotification('Login successful!', 'success');
    } else {
      this.showNotification(result.message, 'error');
    }
  }

  async handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;

    if (password !== confirmPassword) {
      this.showNotification('Passwords do not match', 'error');
      return;
    }

    if (password.length < 6) {
      this.showNotification('Password must be at least 6 characters', 'error');
      return;
    }

    const result = await auth.register(name, email, password);
    if (result.success) {
      this.hideModal();
      verificationModal.showModal(result.tempUser);
    } else {
      this.showNotification(result.message, 'error');
    }
  }

  handleLogout() {
    this.showConfirmationDialog(
      'Logout Confirmation',
      'Are you sure you want to logout? You will need to login again to access your account.',
      'Logout',
      'Cancel',
      () => {
        auth.logout();
        this.showNotification('Logged out successfully', 'success');
      }
    );
  }

  showConfirmationDialog(title, message, confirmText, cancelText, onConfirm) {
    // Create confirmation modal if it doesn't exist
    let confirmModal = document.getElementById('confirmModal');
    if (!confirmModal) {
      confirmModal = document.createElement('div');
      confirmModal.id = 'confirmModal';
      confirmModal.className = 'auth-modal';
      confirmModal.innerHTML = `
        <div class="auth-modal-content">
          <div class="auth-header">
            <h2 id="confirmTitle">Confirm</h2>
            <button class="auth-close" id="confirmClose">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="auth-body">
            <div class="confirmation-message">
              <i class="fas fa-exclamation-triangle" style="color: #f59e0b; font-size: 48px; margin-bottom: 15px;"></i>
              <p id="confirmMessage">Are you sure?</p>
            </div>
            <div class="confirmation-actions">
              <button id="confirmCancel" class="btn-secondary">Cancel</button>
              <button id="confirmOk" class="btn-primary">Confirm</button>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(confirmModal);
    }

    // Update modal content
    document.getElementById('confirmTitle').textContent = title;
    document.getElementById('confirmMessage').textContent = message;
    document.getElementById('confirmCancel').textContent = cancelText;
    document.getElementById('confirmOk').textContent = confirmText;

    // Add event listeners
    const closeBtn = document.getElementById('confirmClose');
    const cancelBtn = document.getElementById('confirmCancel');
    const okBtn = document.getElementById('confirmOk');

    const closeModal = () => {
      confirmModal.style.display = 'none';
      // Remove event listeners
      closeBtn.removeEventListener('click', closeModal);
      cancelBtn.removeEventListener('click', closeModal);
      okBtn.removeEventListener('click', handleConfirm);
      confirmModal.removeEventListener('click', handleBackdropClick);
    };

    const handleConfirm = () => {
      closeModal();
      onConfirm();
    };

    const handleBackdropClick = (e) => {
      if (e.target === confirmModal) {
        closeModal();
      }
    };

    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    okBtn.addEventListener('click', handleConfirm);
    confirmModal.addEventListener('click', handleBackdropClick);

    // Show modal
    confirmModal.style.display = 'flex';
  }

  clearForms() {
    document.getElementById('loginForm')?.reset();
    document.getElementById('registerForm')?.reset();
  }

  showNotification(message, type = 'info', title = null) {
    // Create notification container if it doesn't exist
    let container = document.querySelector('.notification-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'notification-container';
      document.body.appendChild(container);
    }

    // Determine icon based on type
    const icons = {
      success: 'fas fa-check-circle',
      error: 'fas fa-exclamation-circle',
      warning: 'fas fa-exclamation-triangle',
      info: 'fas fa-info-circle'
    };

    // Determine title based on type if not provided
    const titles = {
      success: title || 'Success',
      error: title || 'Error',
      warning: title || 'Warning',
      info: title || 'Info'
    };

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
      <div class="notification-icon">
        <i class="${icons[type] || icons.info}"></i>
      </div>
      <div class="notification-content">
        <div class="notification-title">${titles[type]}</div>
        <div class="notification-message">${message}</div>
      </div>
      <button class="notification-close" onclick="this.parentElement.remove()">
        <i class="fas fa-times"></i>
      </button>
    `;

    // Add to container
    container.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.classList.add('removing');
        setTimeout(() => {
          if (notification.parentElement) {
            notification.remove();
          }
        }, 300);
      }
    }, 5000);

    // Remove on click
    notification.addEventListener('click', () => {
      notification.classList.add('removing');
      setTimeout(() => {
        if (notification.parentElement) {
          notification.remove();
        }
      }, 300);
    });
  }
}

const authModal = new AuthModal();

// Email Verification Modal
class VerificationModal {
  constructor() {
    this.modal = document.getElementById('verificationModal');
    this.tempUserData = null;
    this.initializeEventListeners();
  }

  initializeEventListeners() {
    const closeBtn = document.getElementById('verificationClose');
    const verificationForm = document.getElementById('verificationForm');
    const resendBtn = document.getElementById('resendCode');
    const changeEmailBtn = document.getElementById('changeEmail');

    closeBtn?.addEventListener('click', () => this.hideModal());
    verificationForm?.addEventListener('submit', (e) => this.handleVerification(e));
    resendBtn?.addEventListener('click', () => this.handleResendCode());
    changeEmailBtn?.addEventListener('click', () => this.handleChangeEmail());

    this.modal?.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.hideModal();
      }
    });
  }

  showModal(tempUserData) {
    this.tempUserData = tempUserData;
    this.updateEmailDisplay();
    this.modal.style.display = 'flex';
    
    // Start verification process
    this.sendVerificationCode();
  }

  hideModal() {
    this.modal.style.display = 'none';
    this.clearForm();
    emailVerification.stopTimer();
  }

  updateEmailDisplay() {
    const emailDisplay = document.getElementById('verificationEmail');
    if (emailDisplay && this.tempUserData) {
      emailDisplay.textContent = this.tempUserData.email;
    }
  }

  async sendVerificationCode() {
    if (!this.tempUserData) return;

    const result = await emailVerification.sendVerificationEmail(
      this.tempUserData.email, 
      this.tempUserData.name
    );

    if (result.success) {
      this.showNotification(result.message, 'success');
      emailVerification.startTimer((canResend) => {
        // Timer callback handled in updateTimerDisplay
      });
    } else {
      this.showNotification('Failed to send verification code', 'error');
    }
  }

  async handleVerification(e) {
    e.preventDefault();
    const code = document.getElementById('verificationCode').value;

    if (emailVerification.verifyCode(code)) {
      const result = auth.completeRegistration();
      if (result.success) {
        this.hideModal();
        authModal.hideModal();
        this.showNotification('Registration successful! Welcome to JKS Store!', 'success');
      } else {
        this.showNotification(result.message, 'error');
      }
    } else {
      this.showNotification('Invalid verification code', 'error');
    }
  }

  async handleResendCode() {
    await this.sendVerificationCode();
  }

  handleChangeEmail() {
    this.hideModal();
    authModal.showModal(false); // Show registration modal again
  }

  clearForm() {
    document.getElementById('verificationForm')?.reset();
  }

  showNotification(message, type = 'info') {
    authModal.showNotification(message, type);
  }
}

const verificationModal = new VerificationModal();

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

    
    // Cart functionality with authentication check
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
      cartBtn.addEventListener('click', () => {
        if (auth.isAuthenticated()) {
          window.location.href = 'cart.html';
        } else {
          authModal.showNotification('Please login to access your cart', 'error');
          authModal.showModal(true);
        }
      });
    }

    // Update cart count
    function updateCartCount() {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      let cart = [];
      
      if (currentUser) {
        // Use user-specific cart
        const userCartKey = `cartItems_${currentUser.email}`;
        cart = JSON.parse(localStorage.getItem(userCartKey)) || [];
      } else {
        // Fallback to general cart
        cart = JSON.parse(localStorage.getItem("cartItems")) || [];
      }
      
      const cartCountElement = document.querySelector(".cart-count");
      if (cartCountElement) {
        cartCountElement.textContent = cart.length;
        cartCountElement.style.display = cart.length > 0 ? 'flex' : 'none';
      }
    }

    // Scroll effect for navbar
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

    // Initialize
    updateCartCount();

    

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
 
}

function clearSearch() {
  if (searchBar) {
    searchBar.value = "";
  }
  if (productList) {
    productList.innerHTML = "";
  }
  if (clearBtn) {
    clearBtn.style.display = "none";
  }
  if (searchBar) {
    searchBar.focus();
  }
}

// Event Listeners for search
if (searchBtn) {
  searchBtn.addEventListener("click", handleSearch);
}

if (searchBar) {
  searchBar.addEventListener("input", () => {
    if (clearBtn) {
      clearBtn.style.display = searchBar.value.trim() ? "block" : "none";
    }
  });
}

if (clearBtn) {
  clearBtn.addEventListener("click", clearSearch);
}

if (searchBar) {
  searchBar.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  });
}

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
      <p>Searching products...</p>
    </div>
  `;
}

// Enhanced search with debouncing
let searchTimeout;
if (searchBar) {
  searchBar.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    const searchValue = searchBar.value.trim();
    
    if (clearBtn) {
      clearBtn.style.display = searchValue ? "block" : "none";
    }
  
  if (searchValue.length > 2) {
    showLoadingState();
    searchTimeout = setTimeout(() => {
      handleSearch();
    }, 500);
  } else if (searchValue.length === 0) {
    productList.innerHTML = '';
  }
  });
}

