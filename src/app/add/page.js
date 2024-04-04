"use client"
import React, { useState } from 'react';

export default function Add() {
    const [message, setMessage] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const imageFile = formData.get('img');

        if (imageFile) {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            const allowedSize = 60 * 1024;

            if (!allowedTypes.includes(imageFile.type)) {
                alert("Please select a valid image file (JPEG/PNG/JPG).");
                return;
            }

            if (imageFile.size > allowedSize) {
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
                <label htmlFor="id">id:</label>
                <input type="number" id="id" name="id" /><br />

                <label htmlFor="name">name:</label>
                <input type="text" id="name" name="name" /><br />

                <label htmlFor="des">des:</label>
                <input type="text" id="des" name="des" /><br />

                <label htmlFor="price">price:</label>
                <input type="number" id="price" name="price" step="0.01" /><br />

                <label htmlFor="img">img:</label>
                <input type="file" id="img" name="img" accept="image/jpeg, image/png, image/jpg" /><br />

                <button type="submit">Submit</button>
                <input type="hidden" name="action" value="add" />
            </form>
        </div>
    );
}
