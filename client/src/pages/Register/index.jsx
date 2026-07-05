import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const schema = z.object({
  name:            z.string().min(2, 'Name must be at least 2 characters'),
  email:           z.string().email('Invalid email address'),
  password:        z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export default function Register() {
  const [showPass, setShowPass] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async ({ name, email, password }) => {
    try {
      await registerUser({ name, email, password });
      toast.success('Account created! Welcome!');
      navigate('/');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header Banner */}
        <div className="relative h-36 bg-cover bg-center" style={{ backgroundImage: 'url("/hotel_hero.png")' }}>
          <div className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold text-white">Create Account</h1>
            <p className="text-gray-300 text-sm mt-1">Join Family Guest House</p>
          </div>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" {...register('name')} placeholder="John Doe"
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border ${errors.name ? 'border-red-400' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#a58641]`}
                />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" {...register('email')} placeholder="you@example.com"
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border ${errors.email ? 'border-red-400' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#a58641]`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPass ? 'text' : 'password'} {...register('password')} placeholder="••••••••"
                  className={`w-full pl-10 pr-10 py-3 rounded-lg border ${errors.password ? 'border-red-400' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#a58641]`}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPass ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPass ? 'text' : 'password'} {...register('confirmPassword')} placeholder="••••••••"
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border ${errors.confirmPassword ? 'border-red-400' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#a58641]`}
                />
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <button type="submit" disabled={isSubmitting}
              className="w-full bg-[#a58641] hover:bg-[#8b6e32] disabled:opacity-60 text-white font-bold py-3 rounded-lg transition-colors shadow-md"
            >
              {isSubmitting ? 'Creating Account…' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-[#a58641] font-semibold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
