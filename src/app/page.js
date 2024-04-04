"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

function homepage() {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [username, setusername] = useState(null);

  useEffect(() => {
    fetch('/api')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch');
        }
        return res.json();
      })
      .then((data) => {
        setData(data.result);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });

      const loginuser = sessionStorage.getItem('username');
      setusername(loginuser);
  }, []);

  const handleDelete = async (id, name) => {
    const confirmation = window.confirm(`Are you sure you want to delete this Product: ${name}?`);

    if (confirmation) {
      await axios.post('/api', new URLSearchParams({ action: 'delete', id }));
      window.location.reload();
    } else {
      console.log("Deletion canceled by user.");
    }
  };

  const handleAddToCart = (item) => {
    if (!username) {
      alert("Please log in first before you want to add an item into the cart.");
      return;
    }

    let cartItems = localStorage.getItem('cartItems');
    cartItems = cartItems ? JSON.parse(cartItems) : [];

    const existingItemIndex = cartItems.findIndex(cartItem => cartItem.id === item.id);

    if (existingItemIndex !== -1) {
      alert("Item already added");
      return;
    }

    const itemToAdd = { ...item, quantity: 1 };
    cartItems.push(itemToAdd);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  let filteredData = data;

  if (data) {
    filteredData = data.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>There is some problem when connecting. Please try again.</p>;
  if (data.length === 0) return <div><p>There is no data.</p><button><Link href="/add">add</Link></button></div>;
  if (filteredData.length === 0) return <div> <h1>Product</h1> <input type="text" placeholder="Search Name" value={searchQuery} onChange={handleSearchChange} /><p>No matching products found.</p></div>;

  return (
    <div>
      <h1>Product</h1>
      <input type="text" placeholder="Search Name" value={searchQuery} onChange={handleSearchChange} />
      <table>
        <thead>
          <tr>
            <th>id</th>
            <th>name</th>
            <th>description</th>
            <th>price</th>
            <th>image</th>
            <th>actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.des}</td>
              <td>{item.price}</td>
              <td><img src={item.img} alt={item.name} height={100} width={100} /></td>
              <td>
                <button onClick={() => handleDelete(item.id, item.name)}>Delete</button>
                <Link href={{ pathname: '/edit', query: { id: item.id, name: item.name, des: item.des, price: item.price } }}><button>Edit</button></Link>
                <button onClick={() => handleAddToCart(item)}>Add to Cart</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link href="/add"><button>add</button></Link>
    </div>
  );
}

export default homepage;
