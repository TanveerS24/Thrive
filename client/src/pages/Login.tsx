import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import AnimatedBackground from '../components/AnimatedBackground';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
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

    if (!formData.email || !formData.password) {
      setError('All fields are required');
      setIsLoading(false);
      return;
    }

    try {
      const response = await authAPI.login(formData.email, formData.password);

      if (response.message === 'Login successful') {
        // Server returns userId and username in response
        const userId = response.userId;
        const username = response.username;
        if (!userId || !username) {
          setError('No user info received from server');
          return;
        }
        login(userId, username);
        navigate('/dashboard');
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden p-4">
      <AnimatedBackground />
      
      {/* Main Container */}
      <div className={`relative z-10 max-w-full w-full mx-auto px-4 transform transition-all duration-1000 ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}>
        <div className="backdrop-blur-xl bg-green-900/98 rounded-3xl shadow-2xl shadow-green-500/40 overflow-hidden flex flex-row items-center gap-12 py-16">
          
          {/* Left Side - Info */}
          <div className={`flex flex-col justify-center items-center w-full max-w-2xl transform transition-all duration-1000 delay-100 ${
            isVisible ? 'opacity-100 -translate-x-0' : 'opacity-0 -translate-x-10'
          }`}>
            <div className="max-w-sm">
              <h1 className="text-4xl font-bold text-white mb-6 text-center">Welcome Back!</h1>
              <div className="space-y-4">
                <div className="flex gap-3 group">
                  <div className="text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">🎯</div>
                  <div>
                    <h3 className="text-base font-bold text-white mb-1">Build Better Habits</h3>
                    <p className="text-white text-sm leading-relaxed">
                      Transform your life one day at a time
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 group">
                  <div className="text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">📊</div>
                  <div>
                    <h3 className="text-base font-bold text-white mb-1">Track Progress</h3>
                    <p className="text-white text-sm leading-relaxed">
                      Watch your consistency grow
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 group">
                  <div className="text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">⚡</div>
                  <div>
                    <h3 className="text-base font-bold text-white mb-1">Stay Consistent</h3>
                    <p className="text-white text-sm leading-relaxed">
                      Never miss another day
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 group">
                  <div className="text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">🚀</div>
                  <div>
                    <h3 className="text-base font-bold text-white mb-1">Achieve Your Goals</h3>
                    <p className="text-white text-sm leading-relaxed">
                      Reach new heights with daily action
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
              <h2 className="text-3xl font-bold text-white mb-2">Sign In</h2>
              <p className="text-white text-sm">Continue building your habits</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/80 backdrop-blur-sm border-2 border-red-400 text-white rounded-2xl text-sm shadow-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-white mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="px-4 py-2.5 rounded-2xl bg-white/95 backdrop-blur-md border-2 border-blue-400/40 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all shadow-lg text-sm"
                  placeholder="your@email.com"
                  disabled={isLoading}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-semibold text-white mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="px-4 py-2.5 rounded-2xl bg-white/95 backdrop-blur-md border-2 border-blue-400/40 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all shadow-lg text-sm"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-6 bg-gradient-to-r from-gray-800 via-gray-900 to-black text-black rounded-2xl hover:shadow-xl hover:shadow-gray-500/50 disabled:opacity-50 transition-all font-semibold text-sm mt-2"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-white/30">
              <p className="text-center text-white text-sm">
                Don't have an account?{' '}
                <button
                  onClick={() => navigate('/register')}
                  className="text-emerald-300 hover:text-emerald-200 font-semibold transition"
                >
                  Create one
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
