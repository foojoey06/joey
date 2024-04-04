"use client"
import Link from "next/link";
import styles from "@/app/component/form.css";

export default function SignUpForm() {
   const handleSubmit = async (event) => {
      event.preventDefault();

      const form = event.target;
      const formData = new FormData(form);

      const username = formData.get("username");
      const email = formData.get("email");
      const password = formData.get("password");

      // Email validation regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
         alert("Please enter a valid email address.");
         return;
      }

      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,}$/;

      if (!passwordRegex.test(password)) {
         alert("Password must contain at least 5 characters, including 1 uppercase letter, 1 digit, and 1 special symbol.");
         return;
      }

      try {
         const response = await fetch('/api2', {
            method: 'POST',
            body: formData
         });

         const responseData = await response.json();

         if (response.ok) {
            alert(responseData.message);
            window.location.href = '/signin';
         } else {
            alert(responseData.message);
         }
      } catch (error) {
         console.error('Error:', error);
         alert("Failed to register: " + error.message);
      }
   };

   return (
      <div className="wrapper">
         <div className="title">
            REGISTER
         </div>
         <form onSubmit={handleSubmit}>
            <div className="field">
               <input type="text" name="username" required />
               <label>username</label>
            </div>
            <div className="field">
               <input type="text" name="email" required />
               <label>email</label>
            </div>
            <div className="field">
               <input type="password" name="password" required />
               <label>password</label>
            </div>
            <div className="field">
               <input type="submit" value="REGISTER" />
            </div>
            <div className="signup-link">
               Already Have Account?&nbsp;
               <Link href="/signin">
                  Login
               </Link>
            </div>
            <input type="hidden" name="action" value="register" />
         </form>
      </div>
   );
}
