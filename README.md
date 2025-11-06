# El Sheikh Ali ☕

A premium coffee shop e-commerce platform built with Next.js 14, inspired by Starbucks' professional design and user experience.

## 🎨 Design Features

### Coffee-Themed Color Palette
- **Primary Colors**: Rich espresso browns and warm coffee tones
- **Accent Colors**: Creamy beige and golden highlights
- **Professional Styling**: Modern, clean interface with smooth transitions
- **Responsive Design**: Optimized for all devices

### Customer-Facing Features
- **Hero Section**: Eye-catching landing page with brand messaging
- **Menu Page**: Organized by categories (Coffee, Tea, Food, Merchandise)
- **About Page**: Company story and values
- **Product Catalog**: Beautiful product cards with hover effects
- **Order System**: Seamless checkout with Stripe integration
- **Order History**: Track past purchases

### Admin Dashboard
- **Modern Analytics**: Real-time sales, customer, and product metrics
- **Product Management**: Full CRUD operations with category support
- **Order Management**: View and manage customer orders
- **Customer Management**: Track customer data and purchase history
- **Professional UI**: Clean, intuitive interface with sidebar navigation

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: SQLite with Prisma ORM
- **Payments**: Stripe
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Email**: React Email + Resend
- **Icons**: Lucide React

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Set up environment variables**
Create a `.env` file in the root directory with your configuration.

3. **Initialize the database**
```bash
npx prisma migrate dev
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Pages & Routes

### Customer-Facing
- `/` - Home page with hero and featured products
- `/menu` - Full menu organized by categories
- `/about` - About us and company values
- `/products` - All products available for order
- `/products/[id]/purchase` - Product purchase page
- `/orders` - Customer order history

### Admin Panel
- `/admin` - Dashboard with analytics
- `/admin/products` - Product management
- `/admin/users` - Customer management
- `/admin/orders` - Order management

## 🎨 Customization

### Colors
The coffee-themed color palette can be customized in `src/app/globals.css`:
```css
:root {
  --coffee-dark: 25 35% 20%;
  --coffee-medium: 30 45% 45%;
  --coffee-light: 35 40% 75%;
  --cream: 35 40% 92%;
  --espresso: 20 30% 15%;
}
```

## 📝 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run email        # Preview email templates
```

## 🚀 Deployment

The easiest way to deploy is using [Vercel](https://vercel.com):
1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

---

**El Sheikh Ali** - Where Every Cup Tells a Story ☕
