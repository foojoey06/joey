"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Links() {
    const [username, setusername] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loginuser = sessionStorage.getItem('username');
        setusername(loginuser);
        setLoading(false);
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem('username');
        setusername(null);
    };

    const links = [
        {
            title: "Home",
            path: "/",
        },
        {
            title: "Cart",
            path: "/cart",
        },
        {
            title: "Login",
            path: "/signin",
            hidden: !!username,
        },
        {
            title: "Logout",
            path: "/#",
            hidden: !username,
            onClick: handleLogout,
        },
        {
            title: "Register",
            path: "/signup",
            hidden: !!username,
        },
        {
            title: "Check Product SQL",
            path: "/api",
        },
        {
            title: "Check User SQL",
            path: "/api2",
        },
    ];

    return (
        <div className="links">
            {links.map((link => (
                !link.hidden && (
                    <Link href={link.path} key={link.title}>
                        {link.onClick ? (
                            <span onClick={link.onClick} className='linktext'>{link.title} | </span>
                        ) : (
                            <span className='linktext'>{link.title} | </span>
                        )}
                    </Link>
                )
            )))}
            {loading ? (
                <span>Loading...</span>
            ) : (
                <>
                    {username ? (
                        <span>Hello {username}</span>
                    ) : (
                        <span>You haven't logged in</span>
                    )}
                </>
            )}
        </div>
    );
};
