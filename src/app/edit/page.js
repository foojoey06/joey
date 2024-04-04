"use client"
import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react';

export default function SearchBar() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const getname = searchParams.get('name')
  const getdes = searchParams.get('des')
  const getprice = searchParams.get('price')

  const [name, setname] = useState(getname);
  const [des, setdes] = useState(getdes);
  const [price, setprice] = useState(getprice);

  const handlenameChange = (event) => { setname(event.target.value); };
  const handledesChange = (event) => { setdes(event.target.value); };
  const handlepriceChange = (event) => { setprice(event.target.value); };

  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const imageFile = formData.get('img');

    if (imageFile) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      const allowedSize = 60 * 1024;

      if (imageFile.size > 0 && !allowedTypes.includes(imageFile.type)) {
        alert("Please select a valid image file (JPEG/PNG/JPG).");
        return;
      }

      if (imageFile.size > 0 && imageFile.size > allowedSize) {
        alert("Image size exceeds the limit of 60 KB.");
        return;
      }
    }

    try {
      const response = await fetch('/api', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      if (data.message) {
        alert(data.message);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert("Failed to add product: " + error.message);
    }
  };

  return (
    <div>
      {message && <div>{message}</div>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label htmlFor="id">id:</label>{id}<br />
        <input type="hidden" id="id" name="id" value={id} />

        <label htmlFor="name">name:</label>
        <input type="text" id="name" name="name" value={name} onChange={handlenameChange} /><br />

        <label htmlFor="des">des:</label>
        <input type="text" id="des" name="des" value={des} onChange={handledesChange} /><br />

        <label htmlFor="price">price:</label>
        <input type="number" id="price" name="price" step="0.01" value={price} onChange={handlepriceChange} /><br />

        <label htmlFor="img">img:(update if you want else remain same)</label>
        <input type="file" id="img" name="img" accept="image/jpeg, image/png, image/jpg" /><br />

        <button type="submit">Submit</button>
        <input type="hidden" name="action" value="update" />
      </form>
    </div>

  );
}
