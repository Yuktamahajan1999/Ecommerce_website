import Cart from "../Models/Cart.js";
import Item from "../Models/Item.js";

// Get cart for a user
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.item");
    res.status(200).json({ success: true, items: cart?.items || [] });
  } catch (err) {
    console.error("Get cart error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Add item to cart
export const addToCart = async (req, res) => {
  const { itemId, quantity } = req.body;
  if (!itemId) return res.status(400).json({ success: false, message: "Item ID required" });
  const qty = quantity && quantity > 0 ? quantity : 1;

  try {
    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });
    if (!item.inStock) return res.status(400).json({ success: false, message: "Item out of stock" });

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) cart = new Cart({ user: req.user.id, items: [] });

    const existingIndex = cart.items.findIndex(i => i.item.toString() === itemId);
    if (existingIndex !== -1) {
      cart.items[existingIndex].quantity += qty;
    } else {
      cart.items.push({ item: itemId, quantity: qty });
    }

    await cart.save();
    const populatedCart = await cart.populate("items.item");
    res.status(200).json({ success: true, message: "Item added to cart", cart: populatedCart.items });
  } catch (err) {
    console.error("Add to cart error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update item quantity
export const updateCartItem = async (req, res) => {
  const { itemId, quantity } = req.body;
  if (!itemId || !quantity) return res.status(400).json({ success: false, message: "Item ID and quantity required" });

  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    const index = cart.items.findIndex(i => i.item.toString() === itemId);
    if (index === -1) return res.status(404).json({ success: false, message: "Item not in cart" });

    cart.items[index].quantity = quantity;
    await cart.save();

    const populatedCart = await cart.populate("items.item");
    res.status(200).json({ success: true, message: "Cart updated", cart: populatedCart.items });
  } catch (err) {
    console.error("Update cart error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Remove item from cart
export const removeCartItem = async (req, res) => {
  const { itemId } = req.body;
  if (!itemId) return res.status(400).json({ success: false, message: "Item ID required" });

  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    cart.items = cart.items.filter(i => i.item.toString() !== itemId);
    await cart.save();

    const populatedCart = await cart.populate("items.item");
    res.status(200).json({ success: true, message: "Item removed from cart", cart: populatedCart.items });
  } catch (err) {
    console.error("Remove cart error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
