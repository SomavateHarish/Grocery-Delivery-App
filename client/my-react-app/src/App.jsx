import React, { useEffect, useState, createContext, useContext } from 'react';
import { motion } from 'framer-motion';
import { Search, ShoppingCart, X, Trash2, User, Clock, Home, Package, Heart, ChevronDown, Star, Menu, ChevronLeft, ChevronRight } from 'lucide-react';

// --- Grocery Delivery App ---
const GROCERY_STORE = {
  id: 1,
  name: 'FreshMart Grocery',
  description: 'Fresh produce, pantry staples & household essentials delivered to your door',
  rating: 4.8,
  etaMin: 30,
  etaMax: 45,
  minOrder: 100,
  deliveryFee: 29,
  banner: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400&q=80'
};

const CATEGORIES = [
  { id: 1, name: 'Fruits & Vegetables', icon: '🍎' },
  { id: 2, name: 'Dairy & Eggs', icon: '🥛' },
  { id: 3, name: 'Meat & Seafood', icon: '🍗' },
  { id: 4, name: 'Bakery', icon: '🍞' },
  { id: 5, name: 'Beverages', icon: '🥤' },
  { id: 6, name: 'Snacks', icon: '🍿' },
  { id: 7, name: 'Household', icon: '🏠' },
  { id: 8, name: 'Personal Care', icon: '🧴' }
];

const PRODUCTS = [
  { 
    id: 101, 
    name: 'Fresh Apples', 
    price: 120, 
    category: 'Fruits & Vegetables', 
    unit: 'kg', 
    img: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80', 
    stock: 50, 
    popular: true, 
    discount: 10 
  },
  { 
    id: 102, 
    name: 'Bananas', 
    price: 40, 
    category: 'Fruits & Vegetables', 
    unit: 'dozen', 
    img: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80', 
    stock: 80, 
    popular: true 
  },
  { 
    id: 103, 
    name: 'Milk', 
    price: 60, 
    category: 'Dairy & Eggs', 
    unit: 'liter', 
    img: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80', 
    stock: 100, 
    essential: true 
  },
  { 
    id: 104, 
    name: 'Eggs', 
    price: 80, 
    category: 'Dairy & Eggs', 
    unit: 'dozen', 
    img: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80', 
    stock: 60, 
    essential: true 
  },
  { 
    id: 105, 
    name: 'Chicken Breast', 
    price: 250, 
    category: 'Meat & Seafood', 
    unit: 'kg', 
    img: 'https://images.unsplash.com/photo-1604503468506-8e6a6c0c2d78?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80', 
    stock: 30 
  },
  { 
    id: 106, 
    name: 'Fresh Bread', 
    price: 45, 
    category: 'Bakery', 
    unit: 'pack', 
    img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80', 
    stock: 70, 
    popular: true 
  },
  { 
    id: 107, 
    name: 'Coca Cola', 
    price: 90, 
    category: 'Beverages', 
    unit: '1.5L', 
    img: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80', 
    stock: 120 
  },
  { 
    id: 108, 
    name: 'Potato Chips', 
    price: 50, 
    category: 'Snacks', 
    unit: 'pack', 
    img: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80', 
    stock: 90 
  },
  { 
    id: 109, 
    name: 'Toilet Paper', 
    price: 150, 
    category: 'Household', 
    unit: 'pack of 4', 
    img: 'https://images.unsplash.com/photo-1584556812956-c9cf6c6e23c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80', 
    stock: 40, 
    essential: true 
  },
  { 
    id: 110, 
    name: 'Shampoo', 
    price: 180, 
    category: 'Personal Care', 
    unit: 'bottle', 
    img: 'https://images.unsplash.com/photo-1556228578-9c360e1d8d34?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80', 
    stock: 35 
  },
  { 
    id: 111, 
    name: 'Rice', 
    price: 85, 
    category: 'Pantry', 
    unit: 'kg', 
    img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80', 
    stock: 60, 
    essential: true 
  },
  { 
    id: 112, 
    name: 'Tomatoes', 
    price: 35, 
    category: 'Fruits & Vegetables', 
    unit: 'kg', 
    img: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80', 
    stock: 75 
  },
  { 
    id: 113, 
    name: 'Orange Juice', 
    price: 110, 
    category: 'Beverages', 
    unit: '1L', 
    img: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80', 
    stock: 45, 
    popular: true 
  },
  { 
    id: 114, 
    name: 'Potatoes', 
    price: 30, 
    category: 'Fruits & Vegetables', 
    unit: 'kg', 
    img: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80', 
    stock: 120, 
    essential: true 
  },
  { 
    id: 115, 
    name: 'Coffee', 
    price: 200, 
    category: 'Beverages', 
    unit: '250g', 
    img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80', 
    stock: 25, 
    popular: true 
  },
  { 
    id: 116, 
    name: 'Butter', 
    price: 95, 
    category: 'Dairy & Eggs', 
    unit: '250g', 
    img: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80', 
    stock: 40 
  },
];

// Mock API functions
async function fetchProducts() { return new Promise(res => setTimeout(() => res(PRODUCTS), 200)); }
async function placeOrder(payload) { return new Promise(res => setTimeout(() => res({ ok: true, orderId: Math.floor(Math.random()*900000)+100000, deliveryTime: new Date(Date.now() + 45*60000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }), 700)); }

function safeParse(raw, fallback) { try { return JSON.parse(raw); } catch { return fallback; } }

function useLocalStorage(key, initial) {
  const [state, setState] = useState(() => {
    try { const raw = typeof window !== 'undefined' ? localStorage.getItem(key) : null; return raw ? safeParse(raw, initial) : initial; } catch { return initial; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(state)); } catch {} }, [key, state]);
  return [state, setState];
}

function useLocalUser() {
  const [user, setUser] = useState(() => {
    try { const raw = typeof window !== 'undefined' ? localStorage.getItem('grocery_user_v1') : null; return raw ? safeParse(raw, null) : null; } catch { return null; }
  });
  useEffect(() => { try { localStorage.setItem('grocery_user_v1', JSON.stringify(user)); } catch {} }, [user]);
  return [user, setUser];
}

const CartContext = createContext(null);
function CartProvider({ children }) {
  const [cart, setCart] = useLocalStorage('grocery_cart_v1', {});

  const addToCart = (item, qty = 1) => {
    if (!item || item.id == null) return;
    setCart(prev => {
      const existing = prev[item.id] ? { ...prev[item.id] } : { ...item, qty: 0 };
      const newQty = (Number(existing.qty) || 0) + (Number(qty) || 0);
      const maxStock = Number(item.stock) || 99;
      const finalQty = Math.min(newQty, maxStock);
      return { ...prev, [item.id]: { ...existing, qty: finalQty } };
    });
  };

  const updateQty = (id, qty) => {
    setCart(prev => {
      const it = prev[id]; if (!it) return prev; 
      const q = Number(qty);
      const maxStock = Number(it.stock) || 99;
      
      if (!Number.isFinite(q) || q < 1) { 
        const copy = { ...prev }; 
        delete copy[id]; 
        return copy; 
      }
      
      return { ...prev, [id]: { ...it, qty: Math.min(q, maxStock) } };
    });
  };

  const removeFromCart = id => setCart(prev => { if (!prev[id]) return prev; const copy = { ...prev }; delete copy[id]; return copy; });
  const clearCart = () => setCart({});

  const items = Object.values(cart).map(i => ({ ...i, qty: Number(i.qty) }));
  const subtotal = items.reduce((s, it) => s + (Number(it.price) || 0) * (Number(it.qty) || 0), 0);
  const deliveryFee = subtotal >= GROCERY_STORE.minOrder ? 0 : GROCERY_STORE.deliveryFee;
  const total = subtotal + deliveryFee;

  return <CartContext.Provider value={{ cart, items, subtotal, deliveryFee, total, addToCart, updateQty, removeFromCart, clearCart }}>{children}</CartContext.Provider>;
}
function useCart() { return useContext(CartContext); }

// --- CSS Styles ---
const styles = `
  .grocery-delivery-app {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    background-color: #f9fafb;
    min-height: 100vh;
    width:130%;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  .header {
    background-color: #10b981;
    color: white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 40;
  }

  .header-container {
    max-width: 100%;
    margin: 0 auto;
    padding: 0.75rem 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  @media (min-width: 768px) {
    .header-container {
      max-width: 72rem;
      padding: 0.75rem 1.5rem;
    }
  }

  .logo-section {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
    min-width: 0;
  }

  @media (min-width: 640px) {
    .logo-section {
      gap: 0.75rem;
    }
  }

  .store-logo {
    width: 2rem;
    height: 2rem;
    border-radius: 0.375rem;
    object-fit: cover;
    background: white;
    padding: 0.125rem;
    flex-shrink: 0;
  }

  @media (min-width: 640px) {
    .store-logo {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 0.5rem;
      padding: 0.25rem;
    }
  }

  .store-name {
    font-size: 1rem;
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  @media (min-width: 640px) {
    .store-name {
      font-size: 1.125rem;
    }
  }

  .store-description {
    font-size: 0.6875rem;
    color: rgba(255, 255, 255, 0.9);
    display: none;
  }

  @media (min-width: 640px) {
    .store-description {
      display: block;
      font-size: 0.75rem;
    }
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  @media (min-width: 640px) {
    .header-actions {
      gap: 0.75rem;
    }
  }

  .delivery-info {
    display: none;
    align-items: center;
    gap: 0.375rem;
    padding: 0.25rem 0.5rem;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 0.375rem;
    background-color: rgba(255, 255, 255, 0.1);
  }

  @media (min-width: 768px) {
    .delivery-info {
      display: flex;
    }
  }

  .delivery-icon {
    width: 0.875rem;
    height: 0.875rem;
  }

  .delivery-text {
    font-size: 0.8125rem;
    white-space: nowrap;
  }

  .user-info {
    display: none;
    align-items: center;
    gap: 0.375rem;
  }

  @media (min-width: 768px) {
    .user-info {
      display: flex;
    }
  }

  .user-icon {
    width: 1.125rem;
    height: 1.125rem;
  }

  @media (min-width: 768px) {
    .user-icon {
      width: 1.25rem;
      height: 1.25rem;
    }
  }

  .username {
    font-size: 0.8125rem;
    white-space: nowrap;
  }

  .signin-button {
    padding: 0.25rem 0.5rem;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 0.375rem;
    font-size: 0.8125rem;
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
    cursor: pointer;
    white-space: nowrap;
  }

  @media (min-width: 640px) {
    .signin-button {
      padding: 0.25rem 0.75rem;
      font-size: 0.875rem;
    }
  }

  .cart-button {
    position: relative;
    padding: 0.375rem;
    border-radius: 0.375rem;
    background: none;
    border: none;
    cursor: pointer;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .cart-button:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .cart-icon {
    width: 1.25rem;
    height: 1.25rem;
  }

  @media (min-width: 640px) {
    .cart-icon {
      width: 1.5rem;
      height: 1.5rem;
    }
  }

  .cart-count {
    position: absolute;
    top: -0.25rem;
    right: -0.25rem;
    background-color: #ef4444;
    color: white;
    font-size: 0.6875rem;
    border-radius: 9999px;
    min-width: 1.125rem;
    height: 1.125rem;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 0.25rem;
  }

  @media (min-width: 640px) {
    .cart-count {
      min-width: 1.25rem;
      height: 1.25rem;
      font-size: 0.75rem;
    }
  }

  .hero {
    background-size: cover;
    background-position: center;
    position: relative;
    min-height: 12rem;
  }

  @media (min-width: 640px) {
    .hero {
      min-height: 16rem;
    }
  }

  @media (min-width: 1024px) {
    .hero {
      min-height: 20rem;
    }
  }

  .hero-overlay {
    background-color: rgba(0, 0, 0, 0.4);
    backdrop-filter: brightness(0.6);
    width: 100%;
    height: 100%;
  }

  .hero-content {
    max-width: 100%;
    margin: 0 auto;
    padding: 2rem 1rem;
    color: white;
  }

  @media (min-width: 768px) {
    .hero-content {
      max-width: 72rem;
      padding: 3rem 1.5rem;
    }
  }

  .hero-title {
    font-size: 1.5rem;
    font-weight: bold;
    line-height: 1.2;
  }

  @media (min-width: 640px) {
    .hero-title {
      font-size: 1.875rem;
    }
  }

  .hero-description {
    margin-top: 0.5rem;
    font-size: 0.875rem;
    line-height: 1.4;
  }

  @media (min-width: 640px) {
    .hero-description {
      font-size: 1rem;
    }
  }

  .hero-info {
    margin-top: 1rem;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background-color: rgba(0, 0, 0, 0.3);
    padding: 0.5rem 0.75rem;
    border-radius: 0.375rem;
    flex-wrap: wrap;
  }

  @media (min-width: 640px) {
    .hero-info {
      gap: 0.75rem;
    }
  }

  .rating {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-weight: 600;
    font-size: 0.875rem;
  }

  @media (min-width: 640px) {
    .rating {
      font-size: 1rem;
    }
  }

  .star-icon {
    width: 0.875rem;
    height: 0.875rem;
    fill: currentColor;
  }

  @media (min-width: 640px) {
    .star-icon {
      width: 1rem;
      height: 1rem;
    }
  }

  .eta {
    font-size: 0.8125rem;
  }

  @media (min-width: 640px) {
    .eta {
      font-size: 0.875rem;
    }
  }

  .min-order {
    font-size: 0.8125rem;
  }

  @media (min-width: 640px) {
    .min-order {
      font-size: 0.875rem;
    }
  }

  .main-content {
    max-width: 100%;
    margin: 0 auto;
    padding: 1rem;
  }

  @media (min-width: 768px) {
    .main-content {
      max-width: 72rem;
      padding: 1.5rem;
    }
  }

  .search-bar {
    background-color: white;
    padding: 1rem;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  @media (min-width: 768px) {
    .search-bar {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  }

  .search-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    background-color: #f9fafb;
    padding: 0.5rem 0.75rem;
    border-radius: 0.5rem;
    border: 1px solid #e5e7eb;
  }

  @media (min-width: 768px) {
    .search-container {
      width: 24rem;
    }
  }

  .search-icon {
    width: 1.125rem;
    height: 1.125rem;
    color: #6b7280;
    flex-shrink: 0;
  }

  @media (min-width: 640px) {
    .search-icon {
      width: 1.25rem;
      height: 1.25rem;
    }
  }

  .search-input {
    background: transparent;
    border: none;
    outline: none;
    width: 100%;
    font-size: 0.9375rem;
  }

  @media (min-width: 640px) {
    .search-input {
      font-size: 1rem;
    }
  }

  .category-scroll {
    display: flex;
    gap: 0.5rem;
    overflow-x: auto;
    padding: 0.5rem 0;
    margin-bottom: 1.5rem;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .category-scroll::-webkit-scrollbar {
    display: none;
  }

  @media (min-width: 640px) {
    .category-scroll {
      gap: 0.75rem;
    }
  }

  .category-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    padding: 0.5rem 0.75rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    background-color: white;
    min-width: 4.5rem;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
    flex-shrink: 0;
  }

  @media (min-width: 640px) {
    .category-button {
      padding: 0.75rem 1rem;
      min-width: 5rem;
    }
  }

  .category-button:hover {
    border-color: #10b981;
    background-color: #f0fdf4;
  }

  .category-button.active {
    border-color: #10b981;
    background-color: #10b981;
    color: white;
  }

  .category-icon {
    font-size: 1.25rem;
    margin-bottom: 0.125rem;
  }

  @media (min-width: 640px) {
    .category-icon {
      font-size: 1.5rem;
      margin-bottom: 0.25rem;
    }
  }

  .category-name {
    font-size: 0.6875rem;
    text-align: center;
    line-height: 1.2;
  }

  @media (min-width: 640px) {
    .category-name {
      font-size: 0.75rem;
    }
  }

  .section-title {
    font-size: 1.125rem;
    font-weight: 600;
    margin: 1rem 0;
  }

  @media (min-width: 640px) {
    .section-title {
      font-size: 1.25rem;
      margin: 1.5rem 0 1rem 0;
    }
  }

  .products-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }

  @media (min-width: 640px) {
    .products-grid {
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
    }
  }

  @media (min-width: 768px) {
    .products-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  @media (min-width: 1024px) {
    .products-grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  @media (min-width: 1200px) {
    .products-grid {
      grid-template-columns: repeat(5, 1fr);
    }
  }

  .product-card {
    background-color: white;
    border-radius: 0.75rem;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.2s ease;
    border: 1px solid #e5e7eb;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .product-card:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .product-image {
    height: 7rem;
    width: 100%;
    overflow: hidden;
    position: relative;
    flex-shrink: 0;
  }

  @media (min-width: 640px) {
    .product-image {
      height: 8rem;
    }
  }

  @media (min-width: 768px) {
    .product-image {
      height: 9rem;
    }
  }

  .product-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .product-card:hover .product-image img {
    transform: scale(1.05);
  }

  .badge {
    position: absolute;
    top: 0.5rem;
    left: 0.5rem;
    background-color: #ef4444;
    color: white;
    font-size: 0.6875rem;
    padding: 0.125rem 0.375rem;
    border-radius: 9999px;
    z-index: 1;
  }

  @media (min-width: 640px) {
    .badge {
      font-size: 0.75rem;
      padding: 0.125rem 0.5rem;
    }
  }

  .product-content {
    padding: 0.75rem;
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .product-header {
    margin-bottom: 0.5rem;
    flex: 1;
  }

  .product-name {
    font-weight: 500;
    font-size: 0.8125rem;
    margin-bottom: 0.25rem;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  @media (min-width: 640px) {
    .product-name {
      font-size: 0.875rem;
    }
  }

  .product-unit {
    font-size: 0.6875rem;
    color: #6b7280;
  }

  @media (min-width: 640px) {
    .product-unit {
      font-size: 0.75rem;
    }
  }

  .product-price-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }

  .price-container {
    display: flex;
    align-items: baseline;
    gap: 0.25rem;
    flex-wrap: wrap;
  }

  .current-price {
    font-size: 1rem;
    font-weight: bold;
    color: #10b981;
  }

  @media (min-width: 640px) {
    .current-price {
      font-size: 1.125rem;
    }
  }

  .original-price {
    font-size: 0.8125rem;
    color: #9ca3af;
    text-decoration: line-through;
  }

  @media (min-width: 640px) {
    .original-price {
      font-size: 0.875rem;
    }
  }

  .discount-percent {
    font-size: 0.6875rem;
    color: #ef4444;
    font-weight: 600;
  }

  @media (min-width: 640px) {
    .discount-percent {
      font-size: 0.75rem;
    }
  }

  .product-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: auto;
  }

  .stock-info {
    font-size: 0.6875rem;
    color: #4b5563;
    white-space: nowrap;
  }

  @media (min-width: 640px) {
    .stock-info {
      font-size: 0.75rem;
    }
  }

  .add-to-cart-btn {
    padding: 0.375rem 0.5rem;
    background-color: #10b981;
    color: white;
    border: none;
    border-radius: 0.375rem;
    font-size: 0.75rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    white-space: nowrap;
    transition: background-color 0.2s;
  }

  @media (min-width: 640px) {
    .add-to-cart-btn {
      padding: 0.375rem 0.75rem;
      font-size: 0.875rem;
    }
  }

  .add-to-cart-btn:hover {
    background-color: #0da271;
  }

  .cart-panel {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 50;
    display: flex;
    justify-content: flex-end;
  }

  .cart-panel.hidden {
    display: none;
  }

  .cart-sidebar {
    width: 100%;
    background-color: white;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  @media (min-width: 480px) {
    .cart-sidebar {
      width: 24rem;
    }
  }

  @media (min-width: 640px) {
    .cart-sidebar {
      width: 28rem;
    }
  }

  .cart-header {
    padding: 1rem;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #f9fafb;
  }

  .cart-title {
    font-weight: 600;
    font-size: 1.125rem;
    color: #10b981;
  }

  .cart-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .clear-cart {
    font-size: 0.75rem;
    color: #dc2626;
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  @media (min-width: 640px) {
    .clear-cart {
      font-size: 0.875rem;
    }
  }

  .clear-icon {
    width: 0.875rem;
    height: 0.875rem;
  }

  @media (min-width: 640px) {
    .clear-icon {
      width: 1rem;
      height: 1rem;
    }
  }

  .close-cart {
    padding: 0.375rem;
    border-radius: 0.375rem;
    background: none;
    border: none;
    cursor: pointer;
  }

  @media (min-width: 640px) {
    .close-cart {
      padding: 0.5rem;
    }
  }

  .close-cart:hover {
    background-color: #f3f4f6;
  }

  .close-icon {
    width: 1.125rem;
    height: 1.125rem;
  }

  @media (min-width: 640px) {
    .close-icon {
      width: 1.25rem;
      height: 1.25rem;
    }
  }

  .cart-items {
    padding: 1rem;
    overflow-y: auto;
    flex: 1;
  }

  .cart-empty {
    text-align: center;
    color: #6b7280;
    padding: 2rem 0;
  }

  .cart-empty-icon {
    width: 2.5rem;
    height: 2.5rem;
    color: #d1d5db;
    margin: 0 auto 1rem auto;
  }

  @media (min-width: 640px) {
    .cart-empty-icon {
      width: 3rem;
      height: 3rem;
    }
  }

  .cart-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem;
    border-bottom: 1px solid #e5e7eb;
    background-color: white;
    border-radius: 0.5rem;
    margin-bottom: 0.5rem;
  }

  @media (min-width: 640px) {
    .cart-item {
      gap: 0.75rem;
    }
  }

  .cart-item-image {
    width: 3rem;
    height: 3rem;
    object-fit: cover;
    border-radius: 0.375rem;
    flex-shrink: 0;
  }

  @media (min-width: 640px) {
    .cart-item-image {
      width: 3.5rem;
      height: 3.5rem;
    }
  }

  .cart-item-details {
    flex: 1;
    min-width: 0;
  }

  .cart-item-name {
    font-weight: 500;
    font-size: 0.8125rem;
    margin-bottom: 0.125rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  @media (min-width: 640px) {
    .cart-item-name {
      font-size: 0.875rem;
    }
  }

  .cart-item-unit {
    font-size: 0.6875rem;
    color: #6b7280;
    margin-bottom: 0.25rem;
  }

  @media (min-width: 640px) {
    .cart-item-unit {
      font-size: 0.75rem;
    }
  }

  .cart-item-price {
    font-size: 0.8125rem;
    color: #10b981;
    font-weight: 600;
  }

  @media (min-width: 640px) {
    .cart-item-price {
      font-size: 0.875rem;
    }
  }

  .cart-item-controls {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  @media (min-width: 640px) {
    .cart-item-controls {
      gap: 0.5rem;
    }
  }

  .quantity-button {
    padding: 0.25rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    background: none;
    cursor: pointer;
    font-size: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 1.25rem;
    height: 1.25rem;
  }

  @media (min-width: 640px) {
    .quantity-button {
      padding: 0.25rem 0.5rem;
      font-size: 0.875rem;
      min-width: 1.5rem;
      height: 1.5rem;
    }
  }

  .quantity-display {
    padding: 0 0.25rem;
    font-size: 0.75rem;
    min-width: 1.5rem;
    text-align: center;
  }

  @media (min-width: 640px) {
    .quantity-display {
      padding: 0 0.5rem;
      font-size: 0.875rem;
    }
  }

  .remove-item {
    margin-left: 0.25rem;
    font-size: 0.6875rem;
    color: #dc2626;
    background: none;
    border: none;
    cursor: pointer;
    white-space: nowrap;
  }

  @media (min-width: 640px) {
    .remove-item {
      margin-left: 0.5rem;
      font-size: 0.75rem;
    }
  }

  .cart-summary {
    padding: 1rem;
    border-top: 1px solid #e5e7eb;
    background-color: #f9fafb;
  }

  .summary-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    font-size: 0.8125rem;
  }

  @media (min-width: 640px) {
    .summary-row {
      font-size: 0.875rem;
    }
  }

  .subtotal-label {
    color: #6b7280;
  }

  .delivery-label {
    color: #6b7280;
  }

  .delivery-note {
    font-size: 0.6875rem;
    color: #059669;
    margin-top: -0.25rem;
    margin-bottom: 0.5rem;
    line-height: 1.3;
  }

  @media (min-width: 640px) {
    .delivery-note {
      font-size: 0.75rem;
    }
  }

  .total-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 0.5rem;
    padding-top: 0.5rem;
    border-top: 1px solid #e5e7eb;
    font-weight: 600;
    font-size: 1rem;
  }

  @media (min-width: 640px) {
    .total-row {
      font-size: 1.125rem;
    }
  }

  .checkout-buttons {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 1rem;
  }

  @media (min-width: 480px) {
    .checkout-buttons {
      flex-direction: row;
    }
  }

  .place-order-button {
    flex: 1;
    padding: 0.75rem;
    background-color: #10b981;
    color: white;
    border: none;
    border-radius: 0.375rem;
    cursor: pointer;
    font-size: 0.9375rem;
    font-weight: 600;
    width: 100%;
  }

  @media (min-width: 640px) {
    .place-order-button {
      font-size: 1rem;
    }
  }

  .place-order-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .close-cart-button {
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    background: none;
    cursor: pointer;
    font-size: 0.9375rem;
    width: 100%;
  }

  @media (min-width: 640px) {
    .close-cart-button {
      font-size: 1rem;
    }
  }

  .login-suggestion {
    margin-top: 0.75rem;
    font-size: 0.8125rem;
    color: #6b7280;
    text-align: center;
    line-height: 1.4;
  }

  @media (min-width: 640px) {
    .login-suggestion {
      font-size: 0.875rem;
    }
  }

  .login-link {
    color: #10b981;
    cursor: pointer;
    text-decoration: underline;
  }

  .login-modal-overlay {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
    padding: 1rem;
  }

  .login-modal {
    background-color: white;
    border-radius: 0.5rem;
    padding: 1.5rem;
    width: 100%;
    max-width: 28rem;
  }

  .login-title {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #10b981;
  }

  .login-subtitle {
    font-size: 0.875rem;
    color: #6b7280;
    margin-bottom: 1rem;
  }

  .login-input {
    width: 100%;
    border: 1px solid #d1d5db;
    padding: 0.75rem;
    border-radius: 0.375rem;
    margin-bottom: 1rem;
    font-size: 1rem;
  }

  .login-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .cancel-button {
    padding: 0.5rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    background: none;
    cursor: pointer;
    font-size: 0.875rem;
  }

  .signin-button-modal {
    padding: 0.5rem 1rem;
    background-color: #10b981;
    color: white;
    border: none;
    border-radius: 0.375rem;
    cursor: pointer;
    font-size: 0.875rem;
  }

  .order-notification {
    position: fixed;
    bottom: 1rem;
    left: 1rem;
    right: 1rem;
    background-color: white;
    border: 1px solid #e5e7eb;
    padding: 1rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    max-width: 100%;
    z-index: 60;
  }

  @media (min-width: 640px) {
    .order-notification {
      bottom: 1.5rem;
      right: 1.5rem;
      left: auto;
      max-width: 24rem;
    }
  }

  .notification-success {
    border-left: 4px solid #10b981;
  }

  .notification-error {
    border-left: 4px solid #ef4444;
  }

  .notification-title {
    font-weight: 600;
    margin-bottom: 0.25rem;
    font-size: 0.9375rem;
  }

  @media (min-width: 640px) {
    .notification-title {
      font-size: 1rem;
    }
  }

  .notification-message {
    font-size: 0.8125rem;
    color: #6b7280;
    line-height: 1.4;
  }

  @media (min-width: 640px) {
    .notification-message {
      font-size: 0.875rem;
    }
  }

  .loading, .no-results {
    text-align: center;
    color: #6b7280;
    padding: 2rem;
    grid-column: 1 / -1;
    font-size: 0.9375rem;
  }

  @media (min-width: 640px) {
    .loading, .no-results {
      font-size: 1rem;
    }
  }

  .promo-banner {
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
    padding: 1rem;
    border-radius: 0.5rem;
    margin-bottom: 1.5rem;
    text-align: center;
    font-size: 0.875rem;
    line-height: 1.4;
  }

  @media (min-width: 640px) {
    .promo-banner {
      font-size: 0.9375rem;
    }
  }

  .footer {
    padding: 1.5rem 0;
    font-size: 0.8125rem;
    color: #6b7280;
    text-align: center;
    border-top: 1px solid #e5e7eb;
    margin-top: 2rem;
  }

  @media (min-width: 640px) {
    .footer {
      padding: 2rem 0;
      font-size: 0.875rem;
    }
  }

  .mobile-menu-button {
    display: block;
    padding: 0.375rem;
    background: none;
    border: none;
    color: white;
    cursor: pointer;
  }

  @media (min-width: 768px) {
    .mobile-menu-button {
      display: none;
    }
  }

  .mobile-delivery-info {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.5rem;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 0.375rem;
    font-size: 0.8125rem;
    margin-top: 0.5rem;
    width: 100%;
  }

  @media (min-width: 768px) {
    .mobile-delivery-info {
      display: none;
    }
  }
`;

// --- UI components ---
function Header({ onToggleCart, onOpenLogin, user, cartCount }) {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-section">
          <button className="mobile-menu-button">
            <Menu size={20} />
          </button>
          <img 
            src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80&q=80" 
            alt="FreshMart Grocery Logo" 
            className="store-logo" 
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="store-name">{GROCERY_STORE.name}</div>
            <div className="store-description">{GROCERY_STORE.description}</div>
          </div>
        </div>

        <div className="header-actions">
          <div className="delivery-info">
            <Clock className="delivery-icon" />
            <div className="delivery-text">{GROCERY_STORE.etaMin}-{GROCERY_STORE.etaMax} mins</div>
          </div>

          <div className="user-info">
            {user && user.email ? (
              <div className="user-info">
                <User className="user-icon"/>
                <span className="username">{user.email.split('@')[0]}</span>
              </div>
            ) : (
              <button onClick={onOpenLogin} className="signin-button">Sign in</button>
            )}
          </div>

          <button onClick={onToggleCart} aria-label="Cart" className="cart-button">
            <ShoppingCart className="cart-icon" />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </button>
        </div>
        
        <div className="mobile-delivery-info">
          <Clock size={14} />
          <span>{GROCERY_STORE.etaMin}-{GROCERY_STORE.etaMax} mins • Min. order: ₹{GROCERY_STORE.minOrder}</span>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <div className="hero" style={{ backgroundImage: `url(${GROCERY_STORE.banner})` }}>
      <div className="hero-overlay">
        <div className="hero-content">
          <h1 className="hero-title">{GROCERY_STORE.name}</h1>
          <p className="hero-description">{GROCERY_STORE.description}</p>
          <div className="hero-info">
            <div className="rating">
              <Star className="star-icon" />
              {GROCERY_STORE.rating} ★
            </div>
            <div className="eta">Delivery {GROCERY_STORE.etaMin}-{GROCERY_STORE.etaMax} mins</div>
            <div className="min-order">Min. order: ₹{GROCERY_STORE.minOrder}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CategoryBar({ activeCategory, setActiveCategory }) {
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const scrollRef = React.useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
      <div ref={scrollRef} className="category-scroll">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            className={`category-button ${activeCategory === cat.name ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.name)}
          >
            <span className="category-icon">{cat.icon}</span>
            <span className="category-name">{cat.name}</span>
          </button>
        ))}
      </div>
      <div className="hidden-sm" style={{ 
        position: 'absolute', 
        right: 0, 
        top: 0, 
        bottom: 0, 
        display: 'flex', 
        alignItems: 'center',
        background: 'linear-gradient(90deg, transparent, #f9fafb)',
        padding: '0 0.5rem',
        pointerEvents: 'none'
      }}>
        <button 
          onClick={() => scroll('right')}
          style={{
            pointerEvents: 'auto',
            padding: '0.5rem',
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '50%',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

function ProductCard({ product, onAdd }) {
  const hasDiscount = product.discount && product.discount > 0;
  const discountedPrice = hasDiscount ? product.price * (1 - product.discount / 100) : product.price;
  
  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.img} alt={product.name} loading="lazy" />
        {product.popular && <span className="badge">🔥 Popular</span>}
        {product.essential && <span className="badge" style={{backgroundColor: '#10b981'}}>⭐ Essential</span>}
        {hasDiscount && <span className="badge">{product.discount}% OFF</span>}
      </div>
      <div className="product-content">
        <div className="product-header">
          <div className="product-name">{product.name}</div>
          <div className="product-unit">{product.unit}</div>
        </div>
        <div className="product-price-section">
          <div className="price-container">
            <div className="current-price">₹{Math.round(discountedPrice)}</div>
            {hasDiscount && (
              <>
                <div className="original-price">₹{product.price}</div>
                <div className="discount-percent">{product.discount}% off</div>
              </>
            )}
          </div>
        </div>
        <div className="product-footer">
          <div className="stock-info">{product.stock} in stock</div>
          <button 
            onClick={() => onAdd && onAdd(product)} 
            className="add-to-cart-btn"
          >
            <ShoppingCart size={14} />
            <span className="hidden-sm">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function CartPanel({ open, onClose, onCheckout, user, onOpenLogin }) {
  const { items, subtotal, deliveryFee, total, updateQty, removeFromCart, clearCart } = useCart();

  return (
    <div className={`cart-panel ${open ? '' : 'hidden'}`}>
      <div className="cart-sidebar">
        <div className="cart-header">
          <div className="cart-title">Your Shopping Cart</div>
          <div className="cart-actions">
            <button onClick={clearCart} className="clear-cart">
              <Trash2 className="clear-icon" />
              <span className="hidden-sm">Clear All</span>
            </button>
            <button onClick={onClose} className="close-cart">
              <X className="close-icon" />
            </button>
          </div>
        </div>

        <div className="cart-items">
          {items.length === 0 ? (
            <div className="cart-empty">
              <ShoppingCart className="cart-empty-icon" />
              <div>Your cart is empty</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
                Add items to get started
              </div>
            </div>
          ) : (
            items.map(it => (
              <div key={it.id} className="cart-item">
                <img src={it.img} alt={it.name} className="cart-item-image" loading="lazy" />
                <div className="cart-item-details">
                  <div className="cart-item-name">{it.name}</div>
                  <div className="cart-item-unit">{it.unit}</div>
                  <div className="cart-item-price">₹{it.price} × {it.qty} = ₹{it.price * it.qty}</div>
                  <div className="cart-item-controls">
                    <button onClick={() => updateQty(it.id, Math.max(1, it.qty-1))} className="quantity-button">-</button>
                    <div className="quantity-display">{it.qty}</div>
                    <button onClick={() => updateQty(it.id, it.qty+1)} className="quantity-button">+</button>
                    <button onClick={() => removeFromCart(it.id)} className="remove-item">Remove</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-summary">
            <div className="summary-row">
              <div className="subtotal-label">Subtotal</div>
              <div>₹{subtotal}</div>
            </div>
            <div className="summary-row">
              <div className="delivery-label">Delivery Fee</div>
              <div>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</div>
            </div>
            {deliveryFee === 0 && subtotal >= GROCERY_STORE.minOrder ? (
              <div className="delivery-note">
                ✓ Free delivery on orders above ₹{GROCERY_STORE.minOrder}
              </div>
            ) : subtotal < GROCERY_STORE.minOrder ? (
              <div className="delivery-note">
                Add ₹{GROCERY_STORE.minOrder - subtotal} more for free delivery
              </div>
            ) : null}
            
            <div className="total-row">
              <div>Total</div>
              <div>₹{total}</div>
            </div>
            
            <div className="checkout-buttons">
              <button 
                disabled={items.length === 0} 
                onClick={onCheckout} 
                className="place-order-button"
              >
                Place Order • ₹{total}
              </button>
              <button onClick={onClose} className="close-cart-button">
                Continue Shopping
              </button>
            </div>
            
            {!user && (
              <div className="login-suggestion">
                <span onClick={onOpenLogin} className="login-link">Sign in</span> for order tracking & history
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function LoginModal({ open, onClose, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  useEffect(() => { 
    if (open) {
      setEmail('');
      setPassword('');
    }
  }, [open]);
  
  if (!open) return null;
  
  const handleLogin = () => {
    if (email.trim() && password.trim()) {
      onLogin({ email: email.trim(), name: email.trim().split('@')[0] });
      onClose();
    }
  };
  
  return (
    <div className="login-modal-overlay">
      <div className="login-modal">
        <div className="login-title">Sign in to FreshMart</div>
        <div className="login-subtitle">Manage your orders, addresses, and preferences</div>
        
        <input 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          className="login-input" 
          placeholder="Email address" 
          type="email"
        />
        
        <input 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          className="login-input" 
          placeholder="Password" 
          type="password"
        />
        
        <div className="login-buttons">
          <button onClick={onClose} className="cancel-button">
            Cancel
          </button>
          <button 
            onClick={handleLogin} 
            className="signin-button-modal"
            disabled={!email.trim() || !password.trim()}
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Main App ---
function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Categories');
  const [orderMsg, setOrderMsg] = useState(null);

  const [user, setUser] = useLocalUser();
  const { items, addToCart, subtotal, clearCart } = useCart();

  useEffect(() => {
    let mounted = true;
    fetchProducts().then(res => { 
      if (mounted) setProducts(res || []); 
    }).finally(() => { 
      if (mounted) setLoading(false); 
    });
    return () => { mounted = false; };
  }, []);

  const categories = ['All Categories', ...Array.from(new Set(products.map(p => p.category))).filter(Boolean)];
  
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                         p.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All Categories' || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = product => {
    addToCart(product, 1);
    setCartOpen(true);
  };

  const handleCheckout = async () => {
    if (items.length === 0) return;
    
    setOrderMsg({ type: 'processing', message: 'Processing your order...' });
    
    try {
      const cartData = localStorage.getItem('grocery_cart_v1');
      const orderItems = Object.values(cartData ? safeParse(cartData, {}) : {}).map(i => ({
        productId: i.id,
        name: i.name,
        qty: i.qty,
        price: i.price
      }));
      
      const res = await placeOrder({
        storeId: GROCERY_STORE.id,
        user: user || { guest: true },
        items: orderItems,
        subtotal: subtotal,
        deliveryFee: subtotal >= GROCERY_STORE.minOrder ? 0 : GROCERY_STORE.deliveryFee,
        total: subtotal + (subtotal >= GROCERY_STORE.minOrder ? 0 : GROCERY_STORE.deliveryFee),
        deliveryTime: new Date(Date.now() + 45*60000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      });
      
      if (res && res.ok) {
        setOrderMsg({ 
          type: 'success', 
          message: `Order #${res.orderId} placed successfully!`,
          details: `Estimated delivery by ${res.deliveryTime}`
        });
        clearCart();
        setCartOpen(false);
      } else {
        setOrderMsg({ type: 'error', message: 'Order failed. Please try again.' });
      }
    } catch (error) {
      setOrderMsg({ type: 'error', message: 'Order failed. Please try again.' });
    }
    
    setTimeout(() => setOrderMsg(null), 5000);
  };

  const handleSignOut = () => {
    setUser(null);
  };

  return (
    <div className="grocery-delivery-app">
      <style>{styles}</style>
      
      <Header 
        onToggleCart={() => setCartOpen(v => !v)} 
        onOpenLogin={() => setLoginOpen(true)} 
        user={user} 
        cartCount={items.length} 
      />
      
      <Hero />
      
      <main className="main-content">
        <div className="promo-banner">
          🚚 Free delivery on orders above ₹{GROCERY_STORE.minOrder} • 📦 Same-day delivery available
        </div>
        
        <div className="search-bar">
          <div className="search-container">
            <Search className="search-icon" />
            <input 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              placeholder="Search for groceries, fruits, vegetables..." 
              className="search-input" 
            />
          </div>
          
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              <div className="username">Hi, {user.name}</div>
              <button 
                onClick={handleSignOut}
                className="signin-button"
                style={{ color: '#10b981', backgroundColor: 'white' }}
              >
                Sign out
              </button>
            </div>
          )}
        </div>
        
        <CategoryBar 
          activeCategory={activeCategory} 
          setActiveCategory={setActiveCategory} 
        />
        
        <h2 className="section-title">
          {activeCategory === 'All Categories' ? 'All Products' : activeCategory}
          <span style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 'normal', marginLeft: '0.5rem' }}>
            ({filteredProducts.length} items)
          </span>
        </h2>
        
        <div className="products-grid">
          {loading ? (
            <div className="loading">Loading products...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="no-results">
              No products found matching "{search}"
              {search && <div style={{ marginTop: '0.5rem' }}>Try a different search term</div>}
            </div>
          ) : (
            filteredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAdd={handleAddToCart} 
              />
            ))
          )}
        </div>
        
        <footer className="footer">
          <div>© {new Date().getFullYear()} {GROCERY_STORE.name} — Grocery Delivery App</div>
          <div style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: '#9ca3af' }}>
            Built with React.js & MySQL • Jan 2024–Jun 2024
          </div>
        </footer>
      </main>
      
      <CartPanel 
        open={cartOpen} 
        onClose={() => setCartOpen(false)} 
        onCheckout={handleCheckout} 
        user={user}
        onOpenLogin={() => {
          setCartOpen(false);
          setTimeout(() => setLoginOpen(true), 300);
        }}
      />
      
      <LoginModal 
        open={loginOpen} 
        onClose={() => setLoginOpen(false)} 
        onLogin={setUser} 
      />
      
      {orderMsg && (
        <div className={`order-notification ${orderMsg.type === 'success' ? 'notification-success' : 'notification-error'}`}>
          <div className="notification-title">
            {orderMsg.type === 'success' ? '🎉 Order Successful!' : 
             orderMsg.type === 'processing' ? '⏳ Processing...' : '❌ Order Failed'}
          </div>
          <div className="notification-message">{orderMsg.message}</div>
          {orderMsg.details && <div className="notification-message" style={{ marginTop: '0.25rem' }}>{orderMsg.details}</div>}
        </div>
      )}
    </div>
  );
}

export default function GroceryDeliveryAppWithProvider() {
  return (
    <CartProvider>
      <App />
    </CartProvider>
  );
}