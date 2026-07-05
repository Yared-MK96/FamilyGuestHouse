import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const schema = z.object({
  email:    z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function Login() {
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await login(data);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="relative h-36 bg-cover bg-center" style={{ backgroundImage: 'url("/hotel_hero.png")' }}>
          <div className="absolute inset-0 bg-primary/80 flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
            <p className="text-gray-200 text-sm mt-1">Sign in to your account</p>
          </div>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" {...register('email')} placeholder="you@example.com"
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border ${errors.email ? 'border-red-400' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPass ? 'text' : 'password'} {...register('password')} placeholder="••••••••"
                  className={`w-full pl-10 pr-10 py-3 rounded-lg border ${errors.password ? 'border-red-400' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary`}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPass ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primaryHover disabled:opacity-60 text-white font-bold py-3 rounded-lg transition-colors shadow-md">
              {isSubmitting ? 'Signing In…' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
