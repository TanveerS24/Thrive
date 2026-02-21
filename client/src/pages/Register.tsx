import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import ThemeToggle from '../components/ThemeToggle';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  React.useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!formData.username || !formData.email || !formData.password) {
      setError('All fields are required');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await authAPI.register(formData.username, formData.email, formData.password);

      if (response.message === 'User created successfully') {
        navigate('/login');
      } else {
        setError(response.message || 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Theme Toggle - Fixed Position */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>
      
      {/* Main Container */}
      <div className={`w-full max-w-6xl transform transition-all duration-1000 ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}>
         <div className="backdrop-blur-xl bg-white/98 dark:bg-ember-coal/98 dark:shadow-ember-lg rounded-3xl shadow-2xl border-2 border-gray-200 dark:border-ember-flame/30 overflow-hidden flex flex-row items-center gap-12 py-16">

          {/* Left Side - Info */}
          <div className={`flex flex-col justify-center items-center w-full max-w-2xl transform transition-all duration-1000 delay-100 ${
            isVisible ? 'opacity-100 -translate-x-0' : 'opacity-0 -translate-x-10'
          }`}>
            <div className="max-w-sm">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-ember-flame mb-6 text-center">Why Thrive?</h1>
              <div className="space-y-4">
                <div className="flex gap-3 group">
                  <div className="text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">📚</div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-text-ember mb-1">Smart Organization</h3>
                    <p className="text-gray-700 dark:text-text-muted text-sm leading-relaxed">
                      Group habits into collections for better focus.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 group">
                  <div className="text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">📈</div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-text-ember mb-1">Visual Progress</h3>
                    <p className="text-gray-700 dark:text-text-muted text-sm leading-relaxed">
                      See your streaks grow with intuitive markers.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 group">
                  <div className="text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">💾</div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-text-ember mb-1">Auto-Save Tech</h3>
                    <p className="text-gray-700 dark:text-text-muted text-sm leading-relaxed">
                      Never lose your progress. Focus on goals.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 group">
                  <div className="text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">🎯</div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-text-ember mb-1">Flexible Targets</h3>
                    <p className="text-gray-700 dark:text-text-muted text-sm leading-relaxed">
                      Personalize your habit journey.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 group">
                  <div className="text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">🔔</div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-text-ember mb-1">Smart Reminders</h3>
                    <p className="text-gray-700 dark:text-text-muted text-sm leading-relaxed">
                      Stay on track with timely notifications.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 group">
                  <div className="text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">🌟</div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-text-ember mb-1">Daily Motivation</h3>
                    <p className="text-gray-700 dark:text-text-muted text-sm leading-relaxed">
                      Boost your productivity with inspiration.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className={`w-full max-w-md transform transition-all duration-1000 delay-200 flex flex-col justify-center ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
          }`}>
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-text-ember mb-2">Join Thrive</h2>
              <p className="text-gray-700 dark:text-text-muted text-sm">Start building better habits today</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/40 border-2 border-red-400 dark:border-red-600 text-red-900 dark:text-red-200 rounded-2xl text-sm font-semibold shadow-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex flex-col">
                <label className="text-sm font-bold text-gray-900 dark:text-text-ember mb-2">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="px-4 py-2.5 rounded-2xl bg-white dark:bg-ember-coal border-2 border-gray-300 dark:border-ember-ash text-gray-900 dark:text-text-dark placeholder-gray-500 dark:placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-ember-flame focus:border-primary dark:focus:border-ember-flame transition-all shadow-lg text-sm font-medium"
                  placeholder="Choose a username"
                  disabled={isLoading}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-bold text-gray-900 dark:text-text-ember mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="px-4 py-2.5 rounded-2xl bg-white dark:bg-ember-coal border-2 border-gray-300 dark:border-ember-ash text-gray-900 dark:text-text-dark placeholder-gray-500 dark:placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-ember-flame focus:border-primary dark:focus:border-ember-flame transition-all shadow-lg text-sm font-medium"
                  placeholder="your@email.com"
                  disabled={isLoading}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-bold text-gray-900 dark:text-text-ember mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="px-4 py-2.5 rounded-2xl bg-white dark:bg-ember-coal border-2 border-gray-300 dark:border-ember-ash text-gray-900 dark:text-text-dark placeholder-gray-500 dark:placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-ember-flame focus:border-primary dark:focus:border-ember-flame transition-all shadow-lg text-sm font-medium"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-bold text-gray-900 dark:text-text-ember mb-2">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="px-4 py-2.5 rounded-2xl bg-white dark:bg-ember-coal border-2 border-gray-300 dark:border-ember-ash text-gray-900 dark:text-text-dark placeholder-gray-500 dark:placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-ember-flame focus:border-primary dark:focus:border-ember-flame transition-all shadow-lg text-sm font-medium"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-6 bg-gradient-to-r from-primary to-accent dark:from-ember-flame dark:to-primary text-white rounded-2xl hover:shadow-ember-lg disabled:opacity-50 transition-all font-bold text-sm mt-2 shadow-lg"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-gray-300 dark:border-ember-ash">
              <p className="text-center text-gray-700 dark:text-text-muted text-sm font-semibold">
                Already have an account?{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="text-primary dark:text-ember-flame hover:text-primary-dark dark:hover:text-accent font-bold transition"
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
