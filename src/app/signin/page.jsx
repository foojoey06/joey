"use client"
import { useState } from 'react';
import Link from "next/link";
import styles from "@/app/component/form.css";

export default function SignInForm() {
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const form = event.target;
            const data = new FormData(form);

            // Send form data with fetch request
            const response = await fetch('/api2', {
                method: 'POST',
                body: data
            });

            const responseData = await response.json();

            if (response.ok) {
                sessionStorage.setItem('username', responseData.username);
                alert(responseData.message);
                window.location.href = '/';
            } else {
                alert(responseData.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert("Failed to login: " + error.message);
        }
    };

    return (
        <div className="wrapper">
            <div className="title">
                LOGIN
            </div>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="field">
                    <input type="text" name="username" required />
                    <label>username</label>
                </div>
                <div className="field">
                    <input type="password" name="password" required />
                    <label>password</label>
                </div>
                <div className="content">
                    <div className="checkbox">
                        <input type="checkbox" id="remember-me" />
                        <label htmlFor="remember-me">Remember me</label>
                    </div>
                </div>
                <div className="field">
                    <input type="submit" value="LOGIN" />
                </div>
                <div className="signup-link">
                    Want to Register?&nbsp;
                    <Link href="/signup">
                        Register
                    </Link>
                </div>
                <input type="hidden" name="action" value="login" />
            </form>
        </div>
    )
}
