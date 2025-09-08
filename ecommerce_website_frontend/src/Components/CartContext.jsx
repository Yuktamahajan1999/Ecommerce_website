/* eslint-disable no-undef */
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const token = localStorage.getItem("token");

  const BASE_URL = process.env.REACT_APP_API_URL;
  const API_URL = `${BASE_URL}/cart`;

  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${token}` },
  });

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get(API_URL, getAuthHeaders());
        setCart(res.data.items || []);
      } catch (err) {
        console.error("Error fetching cart:", err);
      }
    };
    if (token) fetchCart();
  }, [token]);

  const addToCart = async (itemId, quantity = 1) => {
    try {
      const res = await axios.post(`${API_URL}/add`, { itemId, quantity }, getAuthHeaders());
      setCart(res.data.cart || res.data.items || []);
    } catch (err) {
      console.error("Error adding to cart:", err);
      throw err;
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const res = await axios.put(`${API_URL}/update`, { itemId, quantity }, getAuthHeaders());
      setCart(res.data.cart || res.data.items || []);
    } catch (err) {
      console.error("Error updating quantity:", err);
      throw err;
    }
  };

  const removeItem = async (itemId) => {
    try {
      const res = await axios.delete(`${API_URL}/remove`, {
        ...getAuthHeaders(),
        data: { itemId },
      });
      setCart(res.data.cart || res.data.items || []);
    } catch (err) {
      console.error("Error removing item:", err);
      throw err;
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, updateQuantity, removeItem, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
