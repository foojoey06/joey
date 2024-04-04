"use client"
import React, { useState, useEffect } from 'react';

function cart() {
  const [cartItems, setCartItems] = useState([]);
  const [quantity, setQuantity] = useState(1); 
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedCartItems = localStorage.getItem('cartItems');
    if (storedCartItems) {
      setCartItems(JSON.parse(storedCartItems));
    }
    const loginuser = sessionStorage.getItem('username');
    setUsername(loginuser);
    setLoading(false); // Set loading to false once everything is initialized
  }, []);

  const removeFromCart = (index) => {
    const updatedCartItems = [...cartItems];
    updatedCartItems.splice(index, 1);
    setCartItems(updatedCartItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
  };

  const handleDecreaseQuantity = (index) => {
    const updatedCartItems = [...cartItems];
    if (updatedCartItems[index].quantity > 1) {
      updatedCartItems[index].quantity--;
      setCartItems(updatedCartItems);
      localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    }
  };

  const handleIncreaseQuantity = (index) => {
    const updatedCartItems = [...cartItems];
    updatedCartItems[index].quantity++;
    setCartItems(updatedCartItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
  };

  const calculateTotal = (price, quantity) => {
    return (price * quantity).toFixed(2); // Convert to string with 2 decimal places
  };
  
  const calculateTotalPrice = () => {
    const totalPrice = cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
    return totalPrice.toFixed(2); 
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {username ? (
            <>
              <h1>Cart</h1>
              {cartItems.length > 0 ? (
                <div>
                  <table>
                    <thead>
                      <tr>
                        <th>id</th>
                        <th>name</th>
                        <th>Price</th>
                        <th>image</th>
                        <th>quantity</th>
                        <th>actions</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map((item, index) => (
                        <tr key={index}>
                          <td>{item.id}</td>
                          <td>{item.name}</td>
                          <td>{item.price}</td>
                          <td>
                            <img src={item.img} alt={item.name} height={100} width={100} />
                          </td>
                          <td>
                            <button onClick={() => handleDecreaseQuantity(index)}>-</button>
                            {item.quantity}
                            <button onClick={() => handleIncreaseQuantity(index)}>+</button>
                          </td>
                          <td>
                            <button onClick={() => removeFromCart(index)}>Remove</button>
                          </td>
                          <td>{calculateTotal(item.price, item.quantity)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p>Total Price: {calculateTotalPrice()}</p>
                  <button>BUY</button>
                </div>
              ) : (
                <p>Your cart is empty.</p>
              )}
            </>
          ) : (
            <p>Please log in first.</p>
          )}
        </>
      )}
    </div>
  );
}

export default cart;
