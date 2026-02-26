# Liverton Admin Portal

A powerful administration dashboard for managing Liverton applications, monitoring analytics, and handling orders efficiently.

## 🚀 Features

- **Analytics Dashboard** - Real-time insights into application performance with detailed metrics and charts
- **Order Management** - Efficiently manage and track all orders from a centralized interface
- **Secure Authentication** - Enterprise-grade security with Firebase authentication
- **Responsive Design** - Beautiful UI that works seamlessly on all devices
- **Real-time Updates** - Live data updates for monitoring your applications

## 📋 Project Overview

This repository contains the admin panel that was separated from the main Liverton Codes application for better organization and security.

### Admin Pages Included:
- **AdminLogin.tsx** - Secure login page for administrators
- **AdminDashboard.tsx** - Main dashboard with overview and quick actions
- **AdminOrders.tsx** - Comprehensive order management interface
- **AdminAnalytics.tsx** - Detailed analytics and metrics visualization

## 🌐 URLs

- **Repository**: https://github.com/mozemedia5/livertonadmin
- **Main Application**: https://github.com/mozemedia5/Liverton-Codes

## 🛠️ Technology Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Firebase** - Authentication and real-time database
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide Icons** - Beautiful icon library

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/mozemedia5/livertonadmin.git

# Navigate to project directory
cd livertonadmin

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🔧 Configuration

1. Create a `.env` file in the root directory
2. Add your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 🚀 Deployment

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📱 Usage

1. **Landing Page** - Access the home page to view features and information
2. **Admin Login** - Click "Admin Login" or "Access Dashboard" to login
3. **Dashboard** - After authentication, access the main dashboard
4. **Navigate** - Use the sidebar to access different admin sections

## 🔐 Security Features

- Firebase Authentication for secure login
- Protected routes requiring authentication
- Session management
- Secure data handling

## 📊 Features In Progress

- Enhanced analytics with more detailed metrics
- User management interface
- Advanced filtering and search in orders
- Export functionality for reports
- Email notification system

## 🤝 Contributing

This is a private admin panel for Liverton applications. For issues or suggestions, please contact the repository owner.

## 📄 License

Private - All rights reserved by Liverton Codes

## 👤 Author

**mozemedia5**
- GitHub: [@mozemedia5](https://github.com/mozemedia5)

## 📝 Notes

This admin panel was separated from the main Liverton Codes repository on February 26, 2026, to improve code organization and maintain better security practices.

---

Built with ❤️ for Liverton Codes
