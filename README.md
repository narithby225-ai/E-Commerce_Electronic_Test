# TechMart - Advanced React E-Commerce Application

A modern, feature-rich e-commerce web application built with React, Vite, and Tailwind CSS.

## 🚀 Features

### Core Functionality
- ✅ **Product Catalog** - Browse 12+ premium electronics products
- ✅ **Advanced Filtering** - Category, price range, stock availability, and search
- ✅ **Shopping Cart** - Add, update quantities, remove items with live totals
- ✅ **Wishlist** - Save favorite products for later
- ✅ **Product Details** - Quick view modal with full specifications
- ✅ **Checkout Flow** - Multi-step checkout with promo code support
- ✅ **Live Chat** - Customer support chat widget
- ✅ **Dark/Light Mode** - Toggle between themes with persistent state

### Visual Features
- 🎨 Modern gradient-based UI design
- 🎭 Smooth animations and transitions
- 📱 Fully responsive (mobile, tablet, desktop)
- 💫 Interactive hover effects
- 🔔 Toast notifications for user actions
- ⭐ Product ratings and reviews display
- 🏷️ Sale badges and discount labels

### Shopping Features
- 🛒 Real-time cart updates
- 💳 Secure checkout simulation
- 🎁 Promo code system (TECH10 for 10%, BUILD20 for 20%)
- 🚚 Free shipping on orders over $150
- 💰 Tax calculation
- 📊 Order summary with itemized totals

## 🛠️ Technologies

- **React 18** - Modern React with Hooks
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **Modern JavaScript (ES6+)** - Latest JavaScript features

## 📦 Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Start development server:**
```bash
npm run dev
```

3. **Build for production:**
```bash
npm run build
```

4. **Preview production build:**
```bash
npm run preview
```

## 🎯 Usage

### Product Filtering
- Click category tabs to filter by product type
- Use the search bar to find specific products
- Adjust price range slider to filter by budget
- Toggle "In Stock Only" to show available items
- Sort by popularity, rating, or price

### Shopping Cart
- Click "Add to Cart" on any product
- Click cart icon to view/edit cart
- Adjust quantities with +/- buttons
- Remove items with trash icon
- Proceed to checkout when ready

### Checkout Process
1. **Step 1 - Shipping:** Enter shipping info and apply promo codes
2. **Step 2 - Payment:** Enter payment details
3. **Step 3 - Confirmation:** Order confirmed with tracking number

### Promo Codes
- `TECH10` - 10% discount
- `BUILD20` - 20% discount

## 📁 Project Structure

```
├── src/
│   ├── App.jsx              # Main application component
│   ├── main.jsx             # React entry point
│   ├── index.css            # Global styles
│   └── data/
│       └── products.js      # Product data and categories
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── postcss.config.js        # PostCSS configuration
```

## 🎨 Customization

### Adding Products
Edit `src/data/products.js` and add new product objects:

```javascript
{
  id: 'prod-13',
  name: 'Product Name',
  category: 'Category',
  subcategory: 'Subcategory',
  price: 99.99,
  originalPrice: 129.99,
  rating: 4.5,
  reviewsCount: 100,
  badge: 'New',
  inStock: true,
  stockCount: 25,
  image: 'https://image-url.jpg',
  description: 'Product description...',
  specs: {
    'Spec 1': 'Value 1',
    'Spec 2': 'Value 2'
  }
}
```

### Changing Colors
Edit `src/App.jsx` and modify Tailwind classes:
- Primary: `cyan-500`, `cyan-600`
- Secondary: `blue-500`, `blue-600`
- Accent: `indigo-500`, `indigo-600`
- Dark mode: `slate-900`, `slate-950`

### Adding Categories
Edit `src/data/products.js` and add to `CATEGORIES` array:

```javascript
export const CATEGORIES = [
  'All Categories',
  'Laptops',
  'Your New Category',
  ...
];
```

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📝 License

MIT License - Free to use for personal and commercial projects.

## 🤝 Contributing

Contributions welcome! Feel free to submit issues and pull requests.

---

**Built with ❤️ using React + Vite + Tailwind CSS**
