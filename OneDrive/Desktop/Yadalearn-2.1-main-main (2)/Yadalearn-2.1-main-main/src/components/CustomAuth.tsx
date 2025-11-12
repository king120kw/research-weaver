import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

export default function CustomAuth() {
  const [isActive, setIsActive] = useState(false);
  const [signInData, setSignInData] = useState({ email: '', password: '' });
  const [signUpData, setSignUpData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
      if (signInData.email && signInData.password) {
        localStorage.setItem('user', JSON.stringify({
          email: signInData.email
        }));
        navigate("/role-selection");
      } else {
        setError("Please fill in all fields");
      }
    }, 1000);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate registration
    setTimeout(() => {
      setIsLoading(false);
      if (signUpData.name && signUpData.email && signUpData.password) {
        localStorage.setItem('user', JSON.stringify({
          email: signUpData.email,
          name: signUpData.name
        }));
        navigate("/role-selection");
      } else {
        setError("Please fill in all fields");
      }
    }, 1000);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Montserrat', sans-serif;
        }
        
        body {
          margin: 0;
          padding: 0;
        }
        
        .main-wrapper {
          background: linear-gradient(to right, #e2e2e2, #c9d6ff);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        
        .container {
          background-color: #fff;
          border-radius: 30px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.35);
          position: relative;
          overflow: hidden;
          width: 768px;
          max-width: 100%;
          min-height: 480px;
        }
        
        .form-container {
          position: absolute;
          top: 0;
          height: 100%;
          transition: all 0.6s ease-in-out;
        }
        
        .sign-in {
          left: 0;
          width: 50%;
          z-index: 2;
        }
        
        .container.active .sign-in {
          transform: translateX(100%);
        }
        
        .sign-up {
          left: 0;
          width: 50%;
          opacity: 0;
          z-index: 1;
        }
        
        .container.active .sign-up {
          transform: translateX(100%);
          opacity: 1;
          z-index: 5;
          animation: move 0.6s;
        }
        
        @keyframes move {
          0%, 49.99% {
            opacity: 0;
            z-index: 1;
          }
          50%, 100% {
            opacity: 1;
            z-index: 5;
          }
        }
        
        .form-content {
          background-color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          padding: 0 40px;
          height: 100%;
        }
        
        h1 {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 20px;
        }
        
        .social-icons {
          margin: 20px 0;
          display: flex;
          gap: 12px;
        }
        
        .social-icons a {
          border: 1px solid #ccc;
          border-radius: 20%;
          display: inline-flex;
          justify-content: center;
          align-items: center;
          width: 40px;
          height: 40px;
          text-decoration: none;
          transition: all 0.3s;
        }
        
        .social-icons a:hover {
          border-color: #512da8;
        }
        
        .social-icons a.google {
          color: #4285F4;
        }
        
        .social-icons a.facebook {
          color: #1877F2;
        }
        
        span {
          font-size: 12px;
          margin-bottom: 10px;
        }
        
        input {
          background-color: #eee;
          border: none;
          margin: 8px 0;
          padding: 10px 15px;
          font-size: 13px;
          border-radius: 8px;
          width: 100%;
          outline: none;
        }
        
        a {
          color: #333;
          font-size: 13px;
          text-decoration: none;
          margin: 15px 0 10px;
        }
        
        a:hover {
          color: #512da8;
        }
        
        button {
          background-color: #512da8;
          color: #fff;
          font-size: 12px;
          padding: 10px 45px;
          border: 1px solid transparent;
          border-radius: 8px;
          font-weight: 600;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          margin-top: 10px;
          cursor: pointer;
          transition: all 0.3s;
        }
        
        button:hover {
          background-color: #6a3fb8;
        }
        
        button.hidden-btn {
          background-color: transparent;
          border-color: #fff;
        }
        
        button.hidden-btn:hover {
          background-color: #fff;
          color: #512da8;
        }
        
        .toggle-container {
          position: absolute;
          top: 0;
          left: 50%;
          width: 50%;
          height: 100%;
          overflow: hidden;
          transition: all 0.6s ease-in-out;
          border-radius: 150px 0 0 100px;
          z-index: 1000;
        }
        
        .container.active .toggle-container {
          transform: translateX(-100%);
          border-radius: 0 150px 100px 0;
        }
        
        .toggle {
          background: linear-gradient(to right, #5c6bc0, #512da8);
          height: 100%;
          color: #fff;
          position: relative;
          left: -100%;
          width: 200%;
          transform: translateX(0);
          transition: all 0.6s ease-in-out;
        }
        
        .container.active .toggle {
          transform: translateX(50%);
        }
        
        .toggle-panel {
          position: absolute;
          width: 50%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          padding: 0 30px;
          text-align: center;
          top: 0;
          transform: translateX(0);
          transition: all 0.6s ease-in-out;
        }
        
        .toggle-left {
          transform: translateX(-200%);
        }
        
        .container.active .toggle-left {
          transform: translateX(0);
        }
        
        .toggle-right {
          right: 0;
          transform: translateX(0);
        }
        
        .container.active .toggle-right {
          transform: translateX(200%);
        }
        
        .toggle-panel h1 {
          color: #fff;
        }
        
        .toggle-panel p {
          font-size: 14px;
          line-height: 20px;
          letter-spacing: 0.3px;
          margin: 20px 0;
        }
      `}</style>
      
      <link 
        rel="stylesheet" 
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
      />
      
      <div className="main-wrapper">
        <div className={`container ${isActive ? 'active' : ''}`}>
          
          <div className="form-container sign-in">
            <form className="form-content" onSubmit={handleSignIn}>
              <h1>Sign In</h1>
              <div className="social-icons">
                <a href="#" className="google"><i className="fa-brands fa-google"></i></a>
                <a href="#" className="facebook"><i className="fa-brands fa-facebook-f"></i></a>
              </div>
              <span>or use your email password</span>
              <input 
                type="email" 
                placeholder="Email" 
                value={signInData.email}
                onChange={(e) => setSignInData({...signInData, email: e.target.value})}
                required
              />
              <input 
                type="password" 
                placeholder="Password" 
                value={signInData.password}
                onChange={(e) => setSignInData({...signInData, password: e.target.value})}
                required
              />
              {error && <p style={{ color: "red", fontSize: "12px" }}>{error}</p>}
              <a href="#">Forget Your Password?</a>
              <button type="submit" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </div>

          <div className="form-container sign-up">
            <form className="form-content" onSubmit={handleSignUp}>
              <h1>Create Account</h1>
              <div className="social-icons">
                <a href="#" className="google"><i className="fa-brands fa-google"></i></a>
                <a href="#" className="facebook"><i className="fa-brands fa-facebook-f"></i></a>
              </div>
              <span>or use your email for registration</span>
              <input 
                type="text" 
                placeholder="Name" 
                value={signUpData.name}
                onChange={(e) => setSignUpData({...signUpData, name: e.target.value})}
                required
              />
              <input 
                type="email" 
                placeholder="Email" 
                value={signUpData.email}
                onChange={(e) => setSignUpData({...signUpData, email: e.target.value})}
                required
              />
              <input 
                type="password" 
                placeholder="Password" 
                value={signUpData.password}
                onChange={(e) => setSignUpData({...signUpData, password: e.target.value})}
                required
              />
              {error && <p style={{ color: "red", fontSize: "12px" }}>{error}</p>}
              <button type="submit" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Sign Up"}
              </button>
            </form>
          </div>

          <div className="toggle-container">
            <div className="toggle">
              <div className="toggle-panel toggle-left">
                <h1>Welcome Back!</h1>
                <p>Enter your personal details to use all of site features</p>
                <button className="hidden-btn" onClick={() => setIsActive(false)}>
                  Sign In
                </button>
              </div>
              <div className="toggle-panel toggle-right">
                <h1>Hello, Friend!</h1>
                <p>Register with your personal details to use all of site features</p>
                <button className="hidden-btn" onClick={() => setIsActive(true)}>
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}