# TechMart - Advanced E-Commerce Platform

A comprehensive, production-ready e-commerce web application built with React, Vite, and Tailwind CSS featuring role-based access control, delivery tracking, and secure payment management.

## 🚀 Features

### 🛍️ Core E-Commerce Functionality
- ✅ **52+ Products** - Premium electronics across 8 categories
- ✅ **Advanced Filtering** - Category, price range, stock availability, search
- ✅ **Shopping Cart** - Real-time cart management with live totals
- ✅ **Wishlist** - Save favorite products
- ✅ **Product Details** - Quick view modal with specifications
- ✅ **Multi-Step Checkout** - Streamlined checkout flow
- ✅ **Promo Codes** - TECH10 (10% off), BUILD20 (20% off)
- ✅ **Dark/Light Mode** - Theme toggle with persistence

### 👥 Role-Based Access Control (RBAC)
- 🔐 **Customer Role** - Browse, shop, track orders
- 👨‍💼 **Manager Role** - Manage products, orders, inventory, delivery status
- 👑 **Owner Role** - Full system access, analytics, financial reports

### 📦 Delivery Tracking System
- 📍 **3 Delivery Stages**:
  - Preparing Items (Blue)
  - Out for Delivery (Amber)
  - Delivered (Green)
- 🚛 **Visual Timeline** - Beautiful progress indicator
- 📱 **Real-Time Updates** - Status notifications
- 🚚 **Courier Information** - Track delivery details

### 💳 Payment Management
- 💰 **Secure Checkout** - Payment simulation with validation
- 🔒 **PCI Compliant** - Ready for Stripe/PayPal integration
- 📊 **Role-Based Refunds**:
  - Manager: Up to $500
  - Owner: Unlimited
- 📈 **Financial Reporting** - Owner analytics dashboard

### 🔔 Notification System
- ✅ **Real-Time Alerts** - Payment status, delivery updates
- 🌐 **Network Monitoring** - Online/offline detection
- ⚡ **Connection Quality** - Slow network warnings
- 🎯 **Toast Notifications** - 6 types (success, error, warning, etc.)

## 🎨 Visual Design

- 🎭 Modern gradient-based UI
- 💫 Smooth animations and transitions
- 📱 Fully responsive (mobile, tablet, desktop)
- 🌙 Dark mode with Tailwind CSS
- ⭐ Interactive hover effects
- 🏷️ Badge system for products

## 🛠️ Technology Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Context API
- **Authentication**: JWT-ready architecture
- **Security**: RBAC, PCI compliance ready

## 📦 Quick Start

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Demo Accounts

**Customer:**
```
Email: customer@demo.com
Password: customer123
```

**Manager:**
```
Email: manager@demo.com
Password: manager123
```

**Owner:**
```
Email: owner@demo.com
Password: owner123
```

## 📚 Documentation

- 📋 [Role-Based Access Guide](ROLE_BASED_ACCESS_GUIDE.md)
- 🚚 [Delivery Tracking Guide](DELIVERY_TRACKING_GUIDE.md)
- 🔔 [Notification System Guide](NOTIFICATION_SYSTEM_GUIDE.md)
- 🔒 [Security Architecture](SECURITY_ARCHITECTURE.md)

## 🎯 Key Features by Role

### Customer Features:
- Browse and purchase products
- Track order delivery status
- View order history
- Manage wishlist
- Real-time notifications

### Manager Features:
- Add/edit products
- Update order statuses:
  - Ship out orders
  - Mark as delivered
- Process refunds (<$500)
- View order statistics
- Monitor inventory

### Owner Features:
- Complete system access
- Financial analytics dashboard
- Revenue and sales reports
- Staff management
- Unlimited refund authority
- System configuration

## 📁 Project Structure

```
├── src/
│   ├── components/
│   │   ├── CustomerDashboard.jsx    # Customer interface
│   │   ├── ManagerDashboard.jsx     # Manager interface
│   │   ├── OwnerDashboard.jsx       # Owner interface
│   │   ├── DeliveryTracker.jsx      # Delivery tracking
│   │   ├── ToastNotification.jsx    # Notification system
│   │   ├── AddProduct.jsx           # Product management
│   │   └── Login.jsx                # Authentication
│   ├── context/
│   │   └── AuthContext.jsx          # RBAC context
│   ├── hooks/
│   │   └── useNetworkMonitor.js     # Network monitoring
│   ├── data/
│   │   └── products.js              # Product catalog (52 items)
│   ├── App.jsx                      # Main application
│   ├── main.jsx                     # Entry point
│   └── index.css                    # Global styles
├── public/                          # Static assets
├── docs/                            # Documentation files
├── package.json                     # Dependencies
├── vite.config.js                   # Vite configuration
└── tailwind.config.js               # Tailwind configuration
```

## 🔒 Security Features

- ✅ Password hashing ready (Argon2id/Bcrypt)
- ✅ Role-based permission system
- ✅ Input validation and sanitization
- ✅ HTTPS/TLS encryption ready
- ✅ XSS and CSRF protection ready
- ✅ Payment tokenization architecture
- ✅ Audit logging system
- ✅ Rate limiting ready

## 🚀 Deployment

### Vite Build

```bash
npm run build
```

### Environment Setup

Create `.env` file:

```env
VITE_API_URL=your_api_url
VITE_STRIPE_KEY=your_stripe_key
```

### Hosting Options

- Vercel
- Netlify
- GitHub Pages
- AWS Amplify
- Azure Static Web Apps

## 🎨 Customization

### Adding Products

Edit `src/data/products.js`:

```javascript
{
  id: 'prod-new',
  name: 'Product Name',
  category: 'Category',
  price: 999.99,
  // ... other properties
}
```

### Changing Theme Colors

Edit `tailwind.config.js` or modify classes in components:
- Primary: `cyan-500`
- Secondary: `blue-600`
- Accent: `indigo-500`

### Adding New Roles

Edit `src/context/AuthContext.jsx` and add role to `USER_ROLES`.

## 📊 Analytics & Reporting

- Revenue tracking (Owner dashboard)
- Sales analytics
- Order statistics
- Customer metrics
- Delivery performance

## 🌐 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers

## 🤝 Contributing

Contributions welcome! Please read our contributing guidelines.

## 📄 License

MIT License - Free for personal and commercial use.

## 👤 Author

**Narith Chhoeurt** (ឈឿត ណារិទ្ធ)
- 📧 Email: narithby225@gmail.com
- 📱 Phone: +855 96 842 1774
- 💬 Telegram: @NARITH_CH
- 🏢 Business: Khmer Mart, #15, NR6, Phnom Penh 12112, Cambodia

## 🙏 Acknowledgments

Built with modern web technologies:
- React Team
- Vite Team
- Tailwind CSS Team
- Lucide Icons

---

**⚡ Built with React + Vite + Tailwind CSS**

**🚀 Production-Ready E-Commerce Platform**

**🔒 Secure • 📦 Feature-Rich • 🎨 Beautiful**
