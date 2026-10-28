import React, { useState, useMemo, useEffect } from 'react';
import {
  ShoppingCart, Heart, Search, Sun, Moon, Star, X, Eye, Plus, Minus,
  Trash2, Sliders, Zap, ShieldCheck, Truck, RotateCcw, MessageSquare,
  ArrowRight, CreditCard, Lock, Check, ChevronRight, Cpu, AlertTriangle,
  CheckCircle, Sparkles, Mail, Phone, MapPin, Globe, Linkedin, Github,
  Twitter, Facebook, Instagram, User, LogOut, Wifi, WifiOff
} from 'lucide-react';
import { PRODUCTS_DATA, CATEGORIES } from './data/products';
import { useAuth } from './context/AuthContext';
import Login from './components/Login';
import CustomerDashboard from './components/CustomerDashboard';
import ManagerDashboard from './components/ManagerDashboard';
import OwnerDashboard from './components/OwnerDashboard';
import ToastNotification from './components/ToastNotification';
import useNetworkMonitor from './hooks/useNetworkMonitor';

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState(true);
  
  // Product state - now managed locally to allow adding products
  const [products, setProducts] = useState(PRODUCTS_DATA);
  
  // Product filtering
  const [activeCategory, setActiveCategory] = useState('All Categories');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState(2000);
  const [sortBy, setSortBy] = useState('popular');
  const [onlyInStock, setOnlyInStock] = useState(false);
  
  // Shopping state
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Checkout state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');
  
  // Chat state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: 'Hello! 👋 Welcome to TechMart Support. How can I help you today?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  
  // About modal state
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  
  // Login/Dashboard modal state
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { user, isAuthenticated, logout, hasRole, USER_ROLES } = useAuth();

  // Orders state (for delivery tracking)
  const [orders, setOrders] = useState([
    // Demo order 1 - Preparing
    {
      id: '100001',
      items: [
        { name: 'MacBook Pro 14" M3', quantity: 1, price: 1999.99 },
        { name: 'Magic Mouse', quantity: 1, price: 79.99 }
      ],
      total: 2079.98,
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      deliveryStatus: 'preparing',
      statusTimestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      shippingAddress: '123 Main St, San Francisco, CA 94102',
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      userId: 'customer_001'
    },
    // Demo order 2 - Out for delivery
    {
      id: '100002',
      items: [
        { name: 'iPhone 15 Pro Max', quantity: 1, price: 1199.99 }
      ],
      total: 1199.99,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      deliveryStatus: 'out_for_delivery',
      statusTimestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      shippingAddress: '456 Oak Ave, Los Angeles, CA 90001',
      estimatedDelivery: 'Today',
      userId: 'customer_001',
      courierInfo: {
        name: 'FastExpress Delivery',
        phone: '+1 (555) 123-4567',
        vehicle: 'Van #247'
      }
    },
    // Demo order 3 - Delivered
    {
      id: '100003',
      items: [
        { name: 'Sony WH-1000XM5', quantity: 1, price: 399.99 },
        { name: 'USB-C Cable', quantity: 2, price: 19.99 }
      ],
      total: 439.97,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      deliveryStatus: 'delivered',
      statusTimestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      shippingAddress: '789 Pine Rd, Seattle, WA 98101',
      estimatedDelivery: new Date(Date.now() - 2 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      userId: 'customer_001',
      courierInfo: {
        name: 'FastExpress Delivery',
        phone: '+1 (555) 123-4567',
        vehicle: 'Van #189'
      },
      deliveredTo: 'John Doe',
      deliveryNote: 'Package delivered successfully to front door'
    }
  ]);

  // Notification system
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const showAdvancedNotification = (notificationData) => {
    setNotification(notificationData);
  };

  // Network monitoring
  const networkStatus = useNetworkMonitor((status) => {
    showAdvancedNotification(status);
  });

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = activeCategory === 'All Categories' || p.category === activeCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.subcategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = p.price <= priceRange;
      const matchesStock = onlyInStock ? p.inStock : true;
      return matchesCategory && matchesSearch && matchesPrice && matchesStock;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return b.reviewsCount - a.reviewsCount;
    });
  }, [activeCategory, searchQuery, priceRange, sortBy, onlyInStock, products]);

  // Add product handler
  const handleAddProduct = (newProduct) => {
    setProducts(prev => [newProduct, ...prev]);
    showNotification(`${newProduct.name} added successfully!`);
  };

  // Update order delivery status
  const handleUpdateOrderStatus = (orderId, newStatus, additionalInfo = {}) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          deliveryStatus: newStatus,
          statusTimestamp: new Date().toISOString(),
          ...additionalInfo
        };
      }
      return order;
    }));

    // Show notification
    const statusMessages = {
      'preparing': 'Order is being prepared',
      'out_for_delivery': 'Order is out for delivery',
      'delivered': 'Order has been delivered'
    };

    showAdvancedNotification({
      type: newStatus === 'delivered' ? 'success' : 'info',
      title: 'Delivery Status Updated',
      message: statusMessages[newStatus] || 'Status updated',
      subMessage: `Order #${orderId}`,
      duration: 3000
    });
  };

  // Cart operations
  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    showNotification(`${product.name} added to cart!`);
  };

  const updateCartQuantity = (id, delta) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean)
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    showNotification('Item removed from cart', 'info');
  };

  const toggleWishlist = (id) => {
    setWishlist((prev) => {
      if (prev.includes(id)) {
        showNotification('Removed from wishlist', 'info');
        return prev.filter((item) => item !== id);
      } else {
        showNotification('Added to wishlist!');
        return [...prev, id];
      }
    });
  };

  // Cart totals
  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);
  const discountAmount = (subtotal * discountPercent) / 100;
  const shippingFee = subtotal > 150 || cart.length === 0 ? 0 : 14.99;
  const estimatedTax = (subtotal - discountAmount) * 0.08;
  const grandTotal = subtotal - discountAmount + shippingFee + estimatedTax;

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'TECH10') {
      setDiscountPercent(10);
      setPromoError('');
      showNotification('Promo code applied! 10% discount');
    } else if (promoCode.trim().toUpperCase() === 'BUILD20') {
      setDiscountPercent(20);
      setPromoError('');
      showNotification('Promo code applied! 20% discount');
    } else {
      setPromoError('Invalid promo code. Try TECH10 or BUILD20');
    }
  };

  const handleChatSend = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    const newMsg = { sender: 'user', text: chatInput };
    setChatMessages((prev) => [...prev, newMsg]);
    const userText = chatInput;
    setChatInput('');
    
    setTimeout(() => {
      let botResponse = "Thanks for your message! Our support team is here to help.";
      if (userText.toLowerCase().includes('shipping')) {
        botResponse = "We offer Free Express Shipping on all orders over $150!";
      } else if (userText.toLowerCase().includes('return')) {
        botResponse = "We have a 30-day easy return policy on all products.";
      } else if (userText.toLowerCase().includes('warranty')) {
        botResponse = "All products come with manufacturer warranty. Check product details for specific terms.";
      }
      setChatMessages((prev) => [...prev, { sender: 'bot', text: botResponse }]);
    }, 800);
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* Toast Notification System */}
      <ToastNotification 
        notification={notification} 
        onClose={() => setNotification(null)} 
      />

      {/* Top Promo Bar */}
      <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white text-xs md:text-sm py-2 px-4 text-center font-medium">
        <div className="flex items-center justify-center gap-2">
          <Zap className="w-4 h-4 animate-pulse text-yellow-300" />
          <span>Use code <strong className="bg-white/20 px-1.5 py-0.5 rounded text-yellow-200">TECH10</strong> for 10% Off + Free Shipping over $150!</span>
        </div>
      </div>

      {/* Header */}
      <header className={`sticky top-0 z-30 backdrop-blur-md border-b ${darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setActiveCategory('All Categories'); setSearchQuery(''); }}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">TECHMART</span>
              <span className="block text-[10px] text-cyan-500 font-mono tracking-widest uppercase -mt-1">Electronics Store</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl relative hidden md:block">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className={`w-full pl-11 pr-10 py-2.5 text-sm rounded-xl outline-none border transition-all ${
                darkMode ? 'bg-slate-800/80 border-slate-700 focus:border-cyan-500 text-slate-100' : 'bg-slate-100 border-slate-300 focus:border-blue-500 text-slate-900'
              }`}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Network Status Indicator */}
            {!networkStatus.isOnline && (
              <div className="px-3 py-1.5 bg-rose-500/20 border border-rose-500/30 rounded-lg flex items-center gap-2 text-rose-400 text-xs font-semibold animate-pulse">
                <WifiOff className="w-4 h-4" />
                <span className="hidden sm:inline">Offline</span>
              </div>
            )}
            {networkStatus.isOnline && networkStatus.connectionQuality === 'slow' && (
              <div className="px-3 py-1.5 bg-amber-500/20 border border-amber-500/30 rounded-lg flex items-center gap-2 text-amber-400 text-xs font-semibold">
                <Wifi className="w-4 h-4" />
                <span className="hidden sm:inline">Slow</span>
              </div>
            )}
            
            {/* Login/Profile Section */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className={`px-3 py-2 rounded-xl border text-xs font-semibold transition flex items-center gap-1 ${
                    darkMode ? 'border-slate-800 hover:bg-slate-800 text-slate-300' : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">{user.name}</span>
                </button>
                <button
                  onClick={logout}
                  className={`p-2 rounded-xl border transition ${
                    darkMode ? 'border-slate-800 hover:bg-slate-800 text-slate-300' : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsLoginOpen(true)}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-white font-semibold rounded-xl text-xs transition flex items-center gap-1"
              >
                <User className="w-4 h-4" />
                Login
              </button>
            )}
            
            <button
              onClick={() => setIsAboutOpen(true)}
              className={`px-3 py-2 rounded-xl border text-xs font-semibold transition ${
                darkMode ? 'border-slate-800 hover:bg-slate-800 text-slate-300' : 'border-slate-200 hover:bg-slate-100 text-slate-700'
              }`}
            >
              About
            </button>
            
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2.5 rounded-xl border transition ${
                darkMode ? 'border-slate-800 hover:bg-slate-800 text-amber-400' : 'border-slate-200 hover:bg-slate-100 text-slate-700'
              }`}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              onClick={() => alert(`Wishlist contains ${wishlist.length} item(s).`)}
              className={`p-2.5 rounded-xl border relative transition ${
                darkMode ? 'border-slate-800 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500/20" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold shadow-lg"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden sm:inline">Cart</span>
              <span className="bg-white/20 px-2 py-0.5 rounded-md text-xs font-bold">
                {cart.reduce((total, i) => total + i.quantity, 0)}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="px-4 pb-3 md:hidden">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className={`w-full pl-9 pr-8 py-2 text-xs rounded-lg outline-none border ${
                darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-300'
              }`}
            />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white py-12 md:py-16">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-medium">
                <Sparkles className="w-3.5 h-3.5" /> For Customers, Store Managers, and Store Owners
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                Welcome to my<br />
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">E-commerce</span>
              </h1>
              <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed mx-auto lg:mx-0">
                A complete online store for customers, store managers, and store owners with role-based access, delivery tracking, and comprehensive payment management.
              </p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => setActiveCategory('Laptops')}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm shadow-lg flex items-center gap-2"
                >
                  Shop Now <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-6 border-t border-slate-800 text-xs text-slate-400">
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <Truck className="w-4 h-4 text-cyan-400" /> Fast Shipping
                </div>
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" /> Secure Payment
                </div>
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <RotateCcw className="w-4 h-4 text-cyan-400" /> Easy Returns
                </div>
              </div>
            </div>

            {/* Featured Product */}
            <div className="lg:col-span-5">
              <div className="relative group rounded-2xl bg-gradient-to-b from-slate-800/80 to-slate-900 border border-slate-700/80 p-5 shadow-2xl">
                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                  <Zap className="w-3 h-3" /> Featured
                </div>
                <div className="relative h-60 rounded-xl overflow-hidden mb-4 bg-slate-950">
                  <img src={products[0].image} alt={products[0].name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{products[0].name}</h3>
                <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                  <span className="text-xl font-extrabold">${products[0].price}</span>
                  <button
                    onClick={() => addToCart(products[0], 1)}
                    className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Categories */}
        <div className="mb-8 overflow-x-auto pb-2 scrollbar-none">
          <div className="flex items-center gap-2 min-w-max">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeCategory === cat
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                    : darkMode
                    ? 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className={`p-4 rounded-2xl border mb-8 ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'} flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4`}>
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2 text-slate-400 font-medium">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>Max Price: <strong className={darkMode ? 'text-slate-100' : 'text-slate-900'}>${priceRange}</strong></span>
            </div>
            <input
              type="range"
              min="100"
              max="2000"
              step="50"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="accent-cyan-500 cursor-pointer w-32 sm:w-48"
            />
            <label className="flex items-center gap-2 cursor-pointer text-slate-400">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="rounded text-cyan-500"
              />
              In Stock Only
            </label>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={`p-2 rounded-lg border outline-none text-xs font-medium ${
              darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-300'
            }`}
          >
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className={`text-center py-16 rounded-2xl border ${darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
            <Search className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold">No Products Found</h3>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your filters</p>
            <button
              onClick={() => {
                setActiveCategory('All Categories');
                setSearchQuery('');
                setPriceRange(2000);
                setOnlyInStock(false);
              }}
              className="mt-4 px-4 py-2 bg-cyan-500 text-slate-950 font-bold text-xs rounded-lg"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const isWishlisted = wishlist.includes(product.id);
              return (
                <div
                  key={product.id}
                  className={`group rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col overflow-hidden ${
                    darkMode ? 'bg-slate-900/80 border-slate-800 hover:border-cyan-500/50' : 'bg-white border-slate-200 hover:border-blue-400'
                  }`}
                >
                  <div className="relative">
                    <div className="absolute top-3 left-3 z-10">
                      <span className="bg-slate-950/80 backdrop-blur text-cyan-400 border border-cyan-500/30 text-[10px] font-bold px-2.5 py-1 rounded-md">
                        {product.badge}
                      </span>
                    </div>
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur transition ${
                        isWishlisted ? 'bg-rose-500 text-white' : 'bg-slate-950/60 text-slate-300 hover:text-white'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
                    </button>
                    <div className="h-48 overflow-hidden bg-slate-950 relative">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-slate-900/90 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 backdrop-blur border border-slate-700"
                      >
                        <Eye className="w-3.5 h-3.5 text-cyan-400" /> Quick View
                      </button>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-1">
                        <span>{product.subcategory}</span>
                      </div>
                      <h3
                        onClick={() => setSelectedProduct(product)}
                        className="font-bold text-sm line-clamp-2 cursor-pointer hover:text-cyan-400 transition"
                      >
                        {product.name}
                      </h3>
                    </div>

                    <div>
                      <div className="flex items-center gap-1 text-xs mb-2">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span className="font-bold">{product.rating}</span>
                        <span className="text-slate-400">({product.reviewsCount})</span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/50">
                        <div>
                          <span className="text-base font-black">${product.price}</span>
                          {product.originalPrice > product.price && (
                            <span className="text-xs text-slate-500 line-through ml-1.5">${product.originalPrice}</span>
                          )}
                        </div>
                        <button
                          onClick={() => addToCart(product, 1)}
                          className="px-3 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-lg text-xs flex items-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" /> Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className={`relative w-full max-w-3xl rounded-2xl border shadow-2xl overflow-hidden max-h-[90vh] flex flex-col ${
            darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="h-64 rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                  <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded bg-slate-800 text-cyan-400 font-mono border border-slate-700">
                    {selectedProduct.category}
                  </span>
                  <span className="px-2.5 py-1 rounded bg-slate-800 text-emerald-400 font-mono border border-slate-700 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> In Stock ({selectedProduct.stockCount})
                  </span>
                </div>
              </div>

              <div className="space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-cyan-500/20 text-cyan-400 text-[10px] font-bold px-2 py-0.5 rounded border border-cyan-500/30">
                      {selectedProduct.badge}
                    </span>
                    <div className="flex items-center text-xs text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                      <span className="font-bold">{selectedProduct.rating}</span>
                      <span className="text-slate-400 ml-1">({selectedProduct.reviewsCount} reviews)</span>
                    </div>
                  </div>
                  <h2 className="text-xl font-bold leading-snug">{selectedProduct.name}</h2>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{selectedProduct.description}</p>

                  <div className="mt-4 pt-3 border-t border-slate-800">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">Specifications</h4>
                    <div className="space-y-1.5 text-xs font-mono">
                      {Object.entries(selectedProduct.specs).map(([key, val]) => (
                        <div key={key} className="flex justify-between py-1 border-b border-slate-800/40">
                          <span className="text-slate-400">{key}:</span>
                          <span className="font-medium text-slate-200">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-2xl font-extrabold">${selectedProduct.price}</span>
                    {selectedProduct.originalPrice > selectedProduct.price && (
                      <span className="text-xs text-slate-500 line-through ml-2">${selectedProduct.originalPrice}</span>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      addToCart(selectedProduct, 1);
                      setSelectedProduct(null);
                      setIsCartOpen(true);
                    }}
                    className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" /> Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className={`w-screen max-w-md border-l shadow-2xl flex flex-col ${
              darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-cyan-400" />
                  <h2 className="font-bold text-base">Your Cart ({cart.reduce((sum, i) => sum + i.quantity, 0)})</h2>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-200">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm font-medium">Your cart is empty</p>
                    <button onClick={() => setIsCartOpen(false)} className="mt-3 text-xs text-cyan-400 hover:underline">
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className={`p-3 rounded-xl border flex gap-3 items-center ${
                      darkMode ? 'bg-slate-800/50 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg bg-slate-950 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold truncate">{item.name}</h4>
                        <div className="text-xs font-mono text-cyan-400 mt-0.5">${item.price}</div>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateCartQuantity(item.id, -1)}
                            className="p-1 rounded bg-slate-700/50 hover:bg-slate-700 text-slate-300"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold font-mono px-2">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.id, 1)}
                            className="p-1 rounded bg-slate-700/50 hover:bg-slate-700 text-slate-300"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="p-2 text-slate-500 hover:text-rose-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-4 border-t border-slate-800 space-y-3 bg-slate-950/40">
                  <div className="space-y-1.5 text-xs text-slate-300 font-mono">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-400">
                        <span>Discount ({discountPercent}%):</span>
                        <span>-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Shipping:</span>
                      <span>{shippingFee === 0 ? <strong className="text-emerald-400">FREE</strong> : `$${shippingFee.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between font-bold text-sm text-white pt-2 border-t border-slate-800">
                      <span>Total:</span>
                      <span className="text-cyan-400">${grandTotal.toFixed(2)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      setIsCheckoutOpen(true);
                      setCheckoutStep(1);
                    }}
                    className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2"
                  >
                    Proceed to Checkout <Lock className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className={`w-full max-w-xl rounded-2xl border shadow-2xl overflow-hidden p-6 ${
            darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-base">Secure Checkout</h3>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span className={checkoutStep === 1 ? 'text-cyan-400 font-bold' : ''}>1. Shipping</span> &gt;
                <span className={checkoutStep === 2 ? 'text-cyan-400 font-bold' : ''}>2. Payment</span> &gt;
                <span className={checkoutStep === 3 ? 'text-cyan-400 font-bold' : ''}>3. Complete</span>
              </div>
              <button onClick={() => setIsCheckoutOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            {checkoutStep === 1 && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">Shipping Information</h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <input type="text" placeholder="First Name" className={`p-2.5 rounded-lg border outline-none ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-300'}`} defaultValue="John" />
                  <input type="text" placeholder="Last Name" className={`p-2.5 rounded-lg border outline-none ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-300'}`} defaultValue="Doe" />
                  <input type="email" placeholder="Email" className={`col-span-2 p-2.5 rounded-lg border outline-none ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-300'}`} defaultValue="john@example.com" />
                  <input type="text" placeholder="Address" className={`col-span-2 p-2.5 rounded-lg border outline-none ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-300'}`} defaultValue="123 Main St" />
                </div>

                <form onSubmit={handleApplyPromo} className="pt-2">
                  <label className="text-xs text-slate-400 block mb-1">Promo Code</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="TECH10 or BUILD20"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className={`flex-1 p-2 text-xs rounded-lg border outline-none font-mono ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-300'}`}
                    />
                    <button type="submit" className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg border border-slate-700 text-cyan-400">
                      Apply
                    </button>
                  </div>
                  {promoError && <p className="text-[11px] text-rose-400 mt-1">{promoError}</p>}
                  {discountPercent > 0 && <p className="text-[11px] text-emerald-400 mt-1">✓ {discountPercent}% discount applied</p>}
                </form>

                <div className="pt-4 flex justify-between items-center border-t border-slate-800">
                  <div className="text-xs text-slate-400">Total: <strong className="text-white">${grandTotal.toFixed(2)}</strong></div>
                  <button
                    onClick={() => setCheckoutStep(2)}
                    className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1"
                  >
                    Continue <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {checkoutStep === 2 && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">Payment Method</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 border rounded-xl border-cyan-500 bg-cyan-500/10 text-center cursor-pointer">
                    <CreditCard className="w-5 h-5 mx-auto mb-1 text-cyan-400" />
                    <span className="text-xs font-semibold">Card</span>
                  </div>
                </div>
                <div className="space-y-3 text-xs pt-2">
                  <input type="text" placeholder="Cardholder Name" className={`w-full p-2.5 rounded-lg border outline-none ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-300'}`} defaultValue="John Doe" />
                  <input type="text" placeholder="Card Number" className={`w-full p-2.5 rounded-lg border outline-none font-mono ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-300'}`} defaultValue="4532 •••• •••• 8892" />
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder="MM/YY" className={`p-2.5 rounded-lg border outline-none ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-300'}`} defaultValue="12/26" />
                    <input type="text" placeholder="CVV" className={`p-2.5 rounded-lg border outline-none ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-300'}`} defaultValue="123" />
                  </div>
                </div>
                <div className="pt-4 flex justify-between items-center border-t border-slate-800">
                  <button onClick={() => setCheckoutStep(1)} className="text-xs text-slate-400 hover:text-slate-200">Back</button>
                  <button
                    onClick={() => {
                      // Show processing notification
                      showAdvancedNotification({
                        type: 'loading',
                        title: 'Processing Payment',
                        message: 'Please wait while we process your payment...',
                        duration: 2000
                      });

                      // Simulate payment processing
                      setTimeout(() => {
                        // Check network status
                        if (!networkStatus.isOnline) {
                          showAdvancedNotification({
                            type: 'error',
                            title: 'Payment Failed',
                            message: 'No internet connection.',
                            subMessage: 'Please check your connection and try again.',
                            duration: 5000
                          });
                          return;
                        }

                        // Simulate slow connection delay
                        if (networkStatus.connectionQuality === 'slow') {
                          showAdvancedNotification({
                            type: 'warning',
                            title: 'Slow Connection',
                            message: 'Processing may take longer due to slow internet.',
                            duration: 3000
                          });
                        }

                        // Random success/failure for demo (90% success rate)
                        const isSuccess = Math.random() > 0.1;

                        setTimeout(() => {
                          if (isSuccess) {
                            // Create order with delivery tracking
                            const newOrder = {
                              id: Math.floor(100000 + Math.random() * 900000).toString(),
                              items: [...cart],
                              total: grandTotal,
                              createdAt: new Date().toISOString(),
                              deliveryStatus: 'preparing',
                              statusTimestamp: new Date().toISOString(),
                              shippingAddress: '123 Main St, City, State 12345',
                              estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                              userId: isAuthenticated ? user.id : 'guest'
                            };
                            setOrders(prev => [newOrder, ...prev]);

                            showAdvancedNotification({
                              type: 'success',
                              title: 'Payment Successful! 🎉',
                              message: `Your payment of $${grandTotal.toFixed(2)} has been processed.`,
                              subMessage: 'Thank you for your purchase!',
                              duration: 5000
                            });
                            setCheckoutStep(3);
                            setCart([]);
                          } else {
                            showAdvancedNotification({
                              type: 'error',
                              title: 'Payment Failed',
                              message: 'Your payment could not be processed.',
                              subMessage: 'Please check your card details and try again.',
                              duration: 5000
                            });
                          }
                        }, networkStatus.connectionQuality === 'slow' ? 3000 : 1500);
                      }, 2000);
                    }}
                    className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs rounded-xl"
                  >
                    Pay ${grandTotal.toFixed(2)}
                  </button>
                </div>
              </div>
            )}

            {checkoutStep === 3 && (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-extrabold">Order Confirmed!</h3>
                <p className="text-xs text-slate-300 max-w-sm mx-auto">
                  Thank you for your purchase. Order <strong className="text-cyan-400">#{Math.floor(100000 + Math.random() * 900000)}</strong> confirmed.
                </p>
                <button
                  onClick={() => setIsCheckoutOpen(false)}
                  className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold text-xs rounded-xl border border-slate-700"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Live Chat */}
      <div className="fixed bottom-5 right-5 z-40">
        {isChatOpen ? (
          <div className={`w-80 sm:w-96 rounded-2xl border shadow-2xl overflow-hidden flex flex-col h-96 ${
            darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="p-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                <span className="font-bold text-xs">Live Support</span>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="hover:opacity-80">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 p-3 overflow-y-auto space-y-3 text-xs">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-2.5 rounded-xl ${
                    msg.sender === 'user'
                      ? 'bg-cyan-500 text-slate-950 font-medium'
                      : darkMode ? 'bg-slate-800 border border-slate-700 text-slate-200' : 'bg-slate-100 border border-slate-300'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleChatSend} className="p-2 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className={`flex-1 p-2 text-xs rounded-lg border outline-none ${
                  darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-300'
                }`}
              />
              <button type="submit" className="px-3 py-2 bg-cyan-500 text-slate-950 font-bold text-xs rounded-lg hover:bg-cyan-400">
                Send
              </button>
            </form>
          </div>
        ) : (
          <button
            onClick={() => setIsChatOpen(true)}
            className="p-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-full shadow-2xl flex items-center gap-2 font-bold text-xs hover:scale-105 transition"
          >
            <MessageSquare className="w-5 h-5" />
            <span className="hidden sm:inline">Support</span>
          </button>
        )}
      </div>

      {/* Dashboard / Login Modal */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn overflow-y-auto">
          <div className={`relative w-full max-w-6xl rounded-2xl border shadow-2xl my-8 ${
            darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <button
              onClick={() => setIsLoginOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 overflow-y-auto max-h-[85vh]">
              {!isAuthenticated ? (
                <Login onClose={() => setIsLoginOpen(false)} />
              ) : (
                <>
                  {hasRole(USER_ROLES.CUSTOMER) && !hasRole(USER_ROLES.MANAGER) && !hasRole(USER_ROLES.OWNER) && (
                    <CustomerDashboard user={user} darkMode={darkMode} orders={orders} />
                  )}
                  {hasRole(USER_ROLES.MANAGER) && !hasRole(USER_ROLES.OWNER) && (
                    <ManagerDashboard 
                      user={user} 
                      darkMode={darkMode} 
                      onAddProduct={handleAddProduct}
                      orders={orders}
                      onUpdateOrderStatus={handleUpdateOrderStatus}
                    />
                  )}
                  {hasRole(USER_ROLES.OWNER) && (
                    <OwnerDashboard user={user} darkMode={darkMode} />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* About Modal */}
      {isAboutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn overflow-y-auto">
          <div className={`relative w-full max-w-4xl rounded-2xl border shadow-2xl my-8 ${
            darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            {/* Close Button */}
            <button
              onClick={() => setIsAboutOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 md:p-8 overflow-y-auto max-h-[85vh]">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
                    <Cpu className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                      About TechMart
                    </h2>
                  </div>
                </div>
                <p className="text-slate-400 text-sm max-w-2xl mx-auto">
                  Your trusted destination for premium electronics and accessories
                </p>
              </div>

              {/* About Project Section */}
              <div className={`mb-8 p-6 rounded-xl border ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-xl font-bold">About Our Store</h3>
                </div>
                <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
                  <p>
                    <strong className="text-white">TechMart</strong> is a modern e-commerce platform specializing in premium electronics, 
                    computer components, and technology accessories. We bring you the latest and greatest products from top brands 
                    with competitive prices and exceptional customer service.
                  </p>
                  <p>
                    Our mission is to make high-quality technology accessible to everyone. Whether you're a professional content creator, 
                    a gaming enthusiast, or someone looking for reliable electronics, we have carefully curated products that meet your needs.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                    <div className="text-center p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                      <div className="text-2xl font-bold text-cyan-400">500+</div>
                      <div className="text-xs text-slate-400">Products</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                      <div className="text-2xl font-bold text-blue-400">50K+</div>
                      <div className="text-xs text-slate-400">Customers</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                      <div className="text-2xl font-bold text-indigo-400">4.9★</div>
                      <div className="text-xs text-slate-400">Rating</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <div className="text-2xl font-bold text-emerald-400">24/7</div>
                      <div className="text-xs text-slate-400">Support</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Categories */}
              <div className={`mb-8 p-6 rounded-xl border ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center gap-2 mb-4">
                  <ShoppingCart className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-xl font-bold">Our Product Range</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                      <Cpu className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1">Laptops & Computers</h4>
                      <p className="text-slate-400 text-xs">Premium laptops, desktops, and workstations from top brands like Dell, Apple, HP, and more.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <Star className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1">Smartphones & Tablets</h4>
                      <p className="text-slate-400 text-xs">Latest smartphones and tablets with cutting-edge technology and features.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                      <Zap className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1">Components & Parts</h4>
                      <p className="text-slate-400 text-xs">CPUs, GPUs, RAM, storage solutions, and cooling systems for custom builds.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <Heart className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1">Accessories & Audio</h4>
                      <p className="text-slate-400 text-xs">Keyboards, mice, headphones, speakers, and all the accessories you need.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className={`mb-8 p-6 rounded-xl border ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-xl font-bold">Contact Information</h3>
                </div>
                
                {/* Personal & Contact Information */}
                <div className="mb-6">
                  <h4 className="text-sm font-bold mb-3 text-cyan-400 uppercase tracking-wider">Personal & Contact Information</h4>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 text-sm">
                      <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 mb-0.5">Full Name</div>
                        <p className="text-white font-medium">Narith Chhoeurt (ឈឿត ណារិទ្ធ)</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 text-sm">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 mb-0.5">Phone Number</div>
                        <a href="tel:+85596842177" className="text-white font-medium hover:text-cyan-400 transition">
                          +855 96 842 1774
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 text-sm">
                      <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 mb-0.5">Email Address</div>
                        <a href="mailto:narithby225@gmail.com" className="text-white font-medium hover:text-cyan-400 transition">
                          narithby225@gmail.com
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 text-sm">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                        <MessageSquare className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 mb-0.5">Telegram</div>
                        <a href="https://t.me/NARITH_CH" target="_blank" rel="noopener noreferrer" className="text-white font-medium hover:text-cyan-400 transition">
                          @NARITH_CH
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Addresses */}
                <div>
                  <h4 className="text-sm font-bold mb-3 text-cyan-400 uppercase tracking-wider">Addresses</h4>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 text-sm">
                      <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 mb-0.5">Residential Address</div>
                        <p className="text-white font-medium leading-relaxed">
                          Krong Thmey Village, Kok Khleang Commune,<br />
                          Sen Sok District, Phnom Penh, Cambodia
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 text-sm">
                      <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                        <ShoppingCart className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 mb-0.5">Business Address</div>
                        <p className="text-white font-medium leading-relaxed">
                          Khmer Mart, #15, NR6,<br />
                          Phnom Penh 12112, Cambodia
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links - Keep existing social media section if you want */}
              <div className={`mb-8 p-6 rounded-xl border ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center gap-2 mb-4">
                  <Globe className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-xl font-bold">Connect With Us</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <a href="https://t.me/NARITH_CH" target="_blank" rel="noopener noreferrer"
                     className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition ${
                       darkMode ? 'border-slate-700 hover:border-emerald-500 hover:bg-slate-800' : 'border-slate-200 hover:border-emerald-400 hover:bg-slate-50'
                     }`}>
                    <MessageSquare className="w-6 h-6 text-emerald-400" />
                    <span className="text-xs font-medium">Telegram</span>
                  </a>
                  <a href="mailto:narithby225@gmail.com" target="_blank" rel="noopener noreferrer"
                     className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition ${
                       darkMode ? 'border-slate-700 hover:border-cyan-500 hover:bg-slate-800' : 'border-slate-200 hover:border-cyan-400 hover:bg-slate-50'
                     }`}>
                    <Mail className="w-6 h-6 text-cyan-400" />
                    <span className="text-xs font-medium">Email</span>
                  </a>
                  <a href="tel:+85596842177" target="_blank" rel="noopener noreferrer"
                     className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition ${
                       darkMode ? 'border-slate-700 hover:border-blue-500 hover:bg-slate-800' : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50'
                     }`}>
                    <Phone className="w-6 h-6 text-blue-400" />
                    <span className="text-xs font-medium">Phone</span>
                  </a>
                  <a href="https://maps.google.com/?q=Khmer+Mart+NR6+Phnom+Penh+Cambodia" target="_blank" rel="noopener noreferrer"
                     className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition ${
                       darkMode ? 'border-slate-700 hover:border-indigo-500 hover:bg-slate-800' : 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50'
                     }`}>
                    <MapPin className="w-6 h-6 text-indigo-400" />
                    <span className="text-xs font-medium">Location</span>
                  </a>
                </div>
              </div>

              {/* Business Hours */}
              <div className={`p-6 rounded-xl border ${darkMode ? 'bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/30' : 'bg-gradient-to-br from-cyan-50 to-blue-50 border-blue-200'}`}>
                <h4 className="text-sm font-bold mb-3 text-cyan-400">Business Hours</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Monday - Friday:</span>
                    <span className="font-bold text-white">9:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Saturday:</span>
                    <span className="font-bold text-white">10:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Sunday:</span>
                    <span className="font-bold text-white">12:00 PM - 5:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Support:</span>
                    <span className="font-bold text-emerald-400">24/7 Online</span>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsAboutOpen(false)}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm rounded-xl shadow-lg transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className={`mt-20 border-t ${darkMode ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'} text-xs py-12`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              <span className="font-extrabold text-sm text-white tracking-wider">TECHMART</span>
            </div>
            <p className="leading-relaxed">Premium electronics store with the latest tech products and accessories.</p>
          </div>
          <div>
            <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider mb-3">Categories</h4>
            <ul className="space-y-2">
              {CATEGORIES.slice(1, 5).map(cat => (
                <li key={cat}><button onClick={() => setActiveCategory(cat)} className="hover:text-cyan-400 transition">{cat}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider mb-3">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-cyan-400 transition">Shipping Info</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition">Returns</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition">Warranty</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider mb-3">Newsletter</h4>
            <p className="mb-2">Get updates on new products and deals</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Email..." className={`flex-1 p-2 rounded-lg border outline-none ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300'}`} />
              <button className="px-3 py-2 bg-cyan-500 text-slate-950 font-bold rounded-lg hover:bg-cyan-400">Join</button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-slate-800/60 text-center text-[11px]">
          © 2024 TechMart. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
