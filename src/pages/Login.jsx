// src/pages/Login.jsx - COMBINED LOGIN & SIGNUP
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { signUp, signIn } = useAuth();
  
  const [isSignUp, setIsSignUp] = useState(true); // Toggle between signup/login
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [form, setForm] = useState({
    email: '',
    name: '',
    surname: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(''); // Clear errors on input
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        // SIGN UP MODE
        if (form.password !== form.confirmPassword) {
          setError("Passwords don't match!");
          setLoading(false);
          return;
        }

        if (form.password.length < 6) {
          setError("Password must be at least 6 characters");
          setLoading(false);
          return;
        }

        const { data, error } = await signUp(form.email, form.password, {
          name: form.name,
          surname: form.surname,
          phone: form.phone
        });

        if (error) {
          setError(error.message);
          setLoading(false);
          return;
        }

        // Show success message with custom styling
        const successDiv = document.createElement('div');
        successDiv.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50';
        successDiv.innerHTML = `
          <div class="bg-white rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl">
            <div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold mb-2">Welcome to Scotty Uzi!</h3>
            <p class="text-gray-600 mb-4">Your account has been created successfully.</p>
            <p class="text-sm text-gray-500">You're now part of the exclusive family!</p>
          </div>
        `;
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
          document.body.removeChild(successDiv);
          navigate('/');
        }, 2000);
        
        
      } else {
        // LOGIN MODE
        const { data, error } = await signIn(form.email, form.password);

        if (error) {
          setError('Invalid email or password');
          setLoading(false);
          return;
        }

        // Redirect and force refresh to update UI
        navigate('/');
        window.location.reload();
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <section className="max-padd-container py-20">
      <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-2">
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h2>
        <p className="text-center text-gray-600 mb-8">
          {isSignUp 
            ? 'Join Scotty Uzi for exclusive benefits' 
            : 'Login to your account'}
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-black transition"
          />

          {isSignUp && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="First Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-black transition"
                />
                <input
                  type="text"
                  name="surname"
                  placeholder="Surname"
                  value={form.surname}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-black transition"
                />
              </div>

              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-black transition"
              />
            </>
          )}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-black transition"
          />

          {isSignUp && (
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-black transition"
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Login')}
          </button>
        </form>

        {isSignUp && (
          <p className="text-xs text-gray-500 mt-4 text-center">
            By creating an account, you'll receive exclusive offers, early access to new drops, and special member benefits.
          </p>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
              setForm({
                email: '',
                name: '',
                surname: '',
                phone: '',
                password: '',
                confirmPassword: ''
              });
            }}
            className="text-sm text-gray-600"
          >
            {isSignUp ? (
              <>
                Already have an account?{' '}
                <span className="text-black font-semibold underline">Login</span>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <span className="text-black font-semibold underline">Sign Up</span>
              </>
            )}
          </button>
        </div>

        <button
          onClick={() => navigate('/')}
          className="w-full mt-4 text-sm text-gray-500 hover:text-black transition"
        >
          ← Back to Home
        </button>
      </div>
    </section>
  );
};

export default Login;