import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import Signup from "./Components/Signup";
import Login from "./Components/Login";
import Cart from "./Components/Cart";
import ProductsPage from "./Components/Products";

function App() {
  const [currentUser, setCurrentUser] = useState(localStorage.getItem("user") || null);
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  const updateCartItems = (newCart) => {
    setCartItems(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const handleAddToCart = (product, quantity) => {
    const existingItem = cartItems.find((cartItem) => cartItem.id === product.id);
    if (existingItem) {
      updateCartItems(
        cartItems.map((cartItem) =>
          cartItem.id === product.id ? { ...cartItem, qty: cartItem.qty + quantity } : cartItem
        )
      );
    } else {
      updateCartItems([...cartItems, { ...product, qty: quantity }]);
    }
  };

  const handleRemoveFromCart = (productId) => {
    updateCartItems(cartItems.filter((cartItem) => cartItem.id !== productId));
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setCurrentUser(null);
  };

  return (
    <Router>
      <div className="app-container">
        <h1>E-Commerce Website - Snapzy</h1>

        {currentUser ? (
          <div className="nav-buttons">
            <Link to="/items">
              <button className="nav-btn">Products</button>
            </Link>
            <Link to="/cart">
              <button className="nav-btn">Cart ({cartItems.length})</button>
            </Link>
            <button className="nav-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <div className="auth-buttons">
            <Link to="/signup">
              <button className="auth-btn">Signup</button>
            </Link>
            <Link to="/login">
              <button className="auth-btn">Login</button>
            </Link>
          </div>
        )}

        <Routes>
          <Route path="/" element={<Navigate to={currentUser ? "/items" : "/login"} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login setUser={setCurrentUser} />} />
          <Route
            path="/items"
            element={
              currentUser ? <ProductsPage onAddToCart={handleAddToCart} /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/cart"
            element={
              currentUser ? (
                <Cart cartItems={cartItems} onRemoveFromCart={handleRemoveFromCart} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
