import React from 'react';
import { CartProvider } from '../contexts/CartContext';

const CartWrapper = ({ children }) => {
  console.log('Rendering CartWrapper with children:', children); // Debugging
  return <CartProvider>{children}</CartProvider>;
};

export default CartWrapper;