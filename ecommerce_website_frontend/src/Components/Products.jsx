import React, { useState, useEffect, useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CartContext } from "./CartContext";
import axios from "axios";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  const { cart, addToCart, updateQuantity, removeItem } = useContext(CartContext);
  const [quantities, setQuantities] = useState({});

  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/items`);
        const fetchedProducts = response.data.items.map(product => ({
          ...product,
          _id: product._id.toString(),
        }));
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Failed to fetch products:", error.response?.data || error.message);
        toast.error("Failed to load products");
      }
    };
    fetchProducts();
  }, [BASE_URL]);

  useEffect(() => {
    const initialQuantities = {};
    cart.forEach(cartItem => {
      initialQuantities[cartItem.item._id] = cartItem.quantity;
    });
    setQuantities(initialQuantities);
  }, [cart]);

  const handleAddToCart = async (productId) => {
    try {
      const quantity = quantities[productId] || 1;
      await addToCart(productId, quantity);
      toast.success("Item added to cart!");
    } catch (error) {
      console.error("Add to cart failed:", error.response?.data || error.message);
      toast.error("Failed to add item to cart");
    }
  };

  const handleRemoveFromCart = async (productId) => {
    try {
      await removeItem(productId);
      setQuantities(prev => {
        const updated = { ...prev };
        delete updated[productId];
        return updated;
      });
      toast.info("Item removed from cart");
    } catch {
      toast.error("Failed to remove item from cart");
    }
  };

  const incrementQuantity = async (productId) => {
    try {
      const newQuantity = (quantities[productId] || 1) + 1;
      setQuantities(prev => ({ ...prev, [productId]: newQuantity }));
      if (cart.some(cartItem => cartItem.item._id === productId)) {
        await updateQuantity(productId, newQuantity);
      }
    } catch {
      toast.error("Failed to update quantity");
    }
  };

  const decrementQuantity = async (productId) => {
    try {
      const newQuantity = Math.max(1, (quantities[productId] || 1) - 1);
      setQuantities(prev => ({ ...prev, [productId]: newQuantity }));
      if (cart.some(cartItem => cartItem.item._id === productId)) {
        await updateQuantity(productId, newQuantity);
      }
    } catch {
      toast.error("Failed to update quantity");
    }
  };

  const categories = ["All", ...new Set(products.map(product => product.category))];

  const clearFilters = () => {
    setCategory("All");
    setMinPrice("");
    setMaxPrice("");
    setSearch("");
    setSortOrder("");
  };

  const filteredProducts = products
    .filter(product => {
      if (category !== "All" && product.category !== category) return false;
      if (minPrice && product.price < Number(minPrice)) return false;
      if (maxPrice && product.price > Number(maxPrice)) return false;
      if (search && !product.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortOrder === "asc") return a.price - b.price;
      if (sortOrder === "desc") return b.price - a.price;
      return 0;
    });

  const isInCart = (productId) => cart.some(cartItem => cartItem.item._id === productId);

  return (
    <div className="products-page">
      <ToastContainer position="top-right" autoClose={2000} />
      <h2 className="products-title">Products</h2>

      <div className="filters">
        <select className="filter-select" value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map(categoryName => (
            <option key={categoryName} value={categoryName}>{categoryName}</option>
          ))}
        </select>

        <input
          className="filter-input"
          type="number"
          placeholder="Min price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <input
          className="filter-input"
          type="number"
          placeholder="Max price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
        <input
          className="filter-input"
          type="search"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select className="filter-select" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="">Sort by</option>
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </select>

        <button className="clear-btn" onClick={clearFilters}>Clear Filters</button>
      </div>

      <div className="products-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <div className="product-card" key={product._id}>
              <div className="product-image-container">
                <img className="product-image" src={product.image} alt={product.name} />
              </div>
              <div className="product-info">
                <h4 className="product-name">{product.name}</h4>
                <p className="product-price">₹{product.price}</p>
                <p className="product-category">{product.category}</p>
                <p className="product-rating">Rating: {product.rating || "N/A"} ⭐</p>

                {product.inStock ? (
                  <div className="qty-add-container">
                    {isInCart(product._id) ? (
                      <>
                        <div className="qty-controls">
                          <button onClick={() => decrementQuantity(product._id)}>-</button>
                          <span>{quantities[product._id] || 1}</span>
                          <button onClick={() => incrementQuantity(product._id)}>+</button>
                        </div>
                        <button className="add-btn in-stock-btn" onClick={() => handleRemoveFromCart(product._id)}>
                          Remove
                        </button>
                      </>
                    ) : (
                      <button className="add-btn in-stock-btn" onClick={() => handleAddToCart(product._id)}>
                        Add to Cart
                      </button>
                    )}
                  </div>
                ) : (
                  <button className="add-btn out-of-stock-btn" disabled>Out of Stock</button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="no-products">
            <p>No products found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
