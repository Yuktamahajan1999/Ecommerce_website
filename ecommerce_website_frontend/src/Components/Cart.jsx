import React, { useContext } from "react";
import { CartContext } from "./CartContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CartPage() {
  const { cart, updateQuantity, removeItem, clearCart } = useContext(CartContext);


  const totalAmount = cart.reduce((sum, product) => sum + product.item.price * product.quantity, 0);

  const incrementQuantity = (itemId, currentQuantity) => {
    updateQuantity(itemId, currentQuantity + 1);
  };

  const decrementQuantity = (itemId, currentQuantity) => {
    if (currentQuantity > 1) {
      updateQuantity(itemId, currentQuantity - 1);
    }
  };
  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.warning("Your cart is empty!");
      return;
    }
    toast.success("Thank you for shopping with us!");
    clearCart();
  };


  return (
    <div className="cart-container">
      <h2 className="cart-title">Shopping Cart</h2>
      <ToastContainer position="top-right" autoClose={2000} />
      {cart.length === 0 ? (
        <p className="cart-empty">Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-table-container">
            <table className="cart-table">
              <thead>
                <tr>
                  <th className="cart-header">Product</th>
                  <th className="cart-header">Price</th>
                  <th className="cart-header">Quantity</th>
                  <th className="cart-header">Total</th>
                  <th className="cart-header">Action</th>
                </tr>
              </thead>
              <tbody>
                {cart.map(product => (
                  <tr key={product.item._id} className="cart-row">
                    <td className="cart-item">
                      <div className="cart-item-info">
                        <img
                          src={product.item.image}
                          alt={product.item.name}
                          className="cart-item-image"
                        />
                        <span className="cart-item-name">{product.item.name}</span>
                      </div>
                    </td>
                    <td className="cart-price">₹{product.item.price}</td>
                    <td className="cart-quantity">
                      <div className="quantity-controls">
                        <button
                          className="qty-btn"
                          onClick={() => decrementQuantity(product.item._id, product.quantity)}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={product.quantity}
                          onChange={e => updateQuantity(product.item._id, Number(e.target.value))}
                          className="qty-input"
                        />
                        <button
                          className="qty-btn"
                          onClick={() => incrementQuantity(product.item._id, product.quantity)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="cart-total">₹{product.item.price * product.quantity}</td>
                    <td className="cart-action">
                      <button
                        className="remove-btn"
                        onClick={() => removeItem(product.item._id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="cart-summary">
            <div className="total-section">
              <h3 className="total-text">Total Amount: ₹{totalAmount}</h3>
            </div>
            <button className="checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}