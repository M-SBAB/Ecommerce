import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the Cart Context
const CartContext = createContext(null);

// Custom hook to use the Cart Context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// CartProvider component to wrap the app
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load cart from localStorage on mount
  useEffect(() => {
    const loadCart = () => {
      try {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
          const cartData = JSON.parse(storedCart);
          setCartItems(cartData);
        }
      } catch (error) {
        console.error('Error parsing cart data from localStorage:', error);
        localStorage.removeItem('cart');
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem('cart', JSON.stringify(cartItems));
      } catch (error) {
        console.error('Error saving cart data to localStorage:', error);
      }
    }
  }, [cartItems, isLoading]);

  // Add item to cart
  const addToCart = (product, quantity = 1) => {
    try {
      setCartItems((prevItems) => {
        // Check if product already exists in cart
        const existingItemIndex = prevItems.findIndex(
          (item) => item._id === product._id
        );

        if (existingItemIndex !== -1) {
          // Product exists, update quantity
          const updatedItems = [...prevItems];
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity + quantity,
          };
          return updatedItems;
        } else {
          // Product doesn't exist, add new item
          return [
            ...prevItems,
            {
              _id: product._id,
              productName: product.productName,
              category: product.category,
              price: product.price,
              image: product.image,
              quantity: quantity,
              stock: product.stock,
            },
          ];
        }
      });
      return true;
    } catch (error) {
      console.error('Error adding item to cart:', error);
      return false;
    }
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    try {
      setCartItems((prevItems) =>
        prevItems.filter((item) => item._id !== productId)
      );
      return true;
    } catch (error) {
      console.error('Error removing item from cart:', error);
      return false;
    }
  };

  // Update item quantity
  const updateQuantity = (productId, newQuantity) => {
    try {
      if (newQuantity <= 0) {
        // If quantity is 0 or less, remove the item
        return removeFromCart(productId);
      }

      setCartItems((prevItems) => {
        const updatedItems = prevItems.map((item) => {
          if (item._id === productId) {
            // Check if new quantity exceeds stock
            const finalQuantity = item.stock
              ? Math.min(newQuantity, item.stock)
              : newQuantity;
            return { ...item, quantity: finalQuantity };
          }
          return item;
        });
        return updatedItems;
      });
      return true;
    } catch (error) {
      console.error('Error updating item quantity:', error);
      return false;
    }
  };

  // Clear entire cart
  const clearCart = () => {
    try {
      setCartItems([]);
      return true;
    } catch (error) {
      console.error('Error clearing cart:', error);
      return false;
    }
  };

  // Get total number of items in cart
  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Get cart subtotal (before tax and shipping)
  const getCartSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  // Get cart total with tax and shipping
  const getCartTotal = (taxRate = 0.1, shippingCost = 50) => {
    const subtotal = getCartSubtotal();
    const tax = subtotal * taxRate;
    const total = subtotal + tax + shippingCost;
    return {
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      shipping: shippingCost.toFixed(2),
      total: total.toFixed(2),
    };
  };

  // Check if cart is empty
  const isCartEmpty = () => {
    return cartItems.length === 0;
  };

  // Get specific item from cart
  const getCartItem = (productId) => {
    return cartItems.find((item) => item._id === productId);
  };

  const value = {
    cartItems,
    isLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartItemCount,
    getCartSubtotal,
    getCartTotal,
    isCartEmpty,
    getCartItem,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;
