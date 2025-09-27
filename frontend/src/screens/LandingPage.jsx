import React, { useState } from 'react';
import config from '../constants.js';

const LandingPage = ({ onLogin, onSignup }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoginView) {
      onLogin(email, password);
    } else {
      onSignup(name, email, password);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">FlavorFind</h1>
          <a href={`${config.BACKEND_URL}/admin`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Admin Panel</a>
        </nav>
      </header>

      <main className="flex-grow flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid md:grid-cols-2 gap-16 items-center">
          <div className="text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">Discover Your Next Favorite Meal</h2>
            <p className="mt-4 text-lg text-gray-600">Browse local restaurants, explore menus, and find the food you love. All in one place.</p>
             <button 
              onClick={() => onLogin('customer@demo.com', 'password123')}
              className="mt-8 w-full md:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
            >
              Try Demo
            </button>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md mx-auto">
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-2">{isLoginView ? 'Welcome Back' : 'Create Account'}</h3>
            <p className="text-center text-gray-500 mb-6">{isLoginView ? 'Sign in to continue' : 'Join FlavorFind today'}</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLoginView && (
                <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
              )}
              <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
              <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors font-semibold">{isLoginView ? 'Login' : 'Sign Up'}</button>
            </form>
            <p className="text-center text-sm text-gray-500 mt-6">
              {isLoginView ? "Don't have an account?" : "Already have an account?"}
              <button onClick={() => setIsLoginView(!isLoginView)} className="font-medium text-blue-600 hover:underline ml-1">{isLoginView ? 'Sign up' : 'Login'}</button>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
