## vorium

Online store platform is built with React and TypeScript. Using Vite as the build tool for fast development and optimized production builds.

For styling, the project uses Tailwind CSS with a custom theme configuration. UI components are custom-built with accessibility in mind, using Lucide React icons.

State management handled by Zustand. The store is organized into separate modules for products, cart, authentication, and settings.


---

## 🔧 Backend Overview

This project is built on a modern backend powered by Supabase, offering:

- A PostgreSQL database for managing products and orders  
- Real-time updates for a dynamic user experience  
- A built-in authentication system  
- Storage for product images and media  

## ⚙️ Technical Features

- Type-safe database operations using generated TypeScript types  
- Persistent cart and wishlist with local storage support  
- Responsive images with lazy loading for better performance  
- Protected routes to restrict access for authenticated users  
- An admin dashboard with real-time data updates  
- Full-text search powered by PostgreSQL  
- A complete order management system with status tracking  

## 🧱 Architecture

The project follows a component-based architecture, structured around:

- Reusable UI components like `Button`, `Input`, and `ProductCard`  
- Layout components for consistent page structure  
- Page components mapped to individual routes  
- Store modules for centralized state management  
- Utility functions for handling shared logic  
