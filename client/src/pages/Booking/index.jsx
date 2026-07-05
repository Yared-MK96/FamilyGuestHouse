import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { FaCalendarAlt, FaUser, FaCheckCircle } from 'react-icons/fa';
import { ROOMS_DATA } from '../../constants';
import { calculateNights, formatCurrency } from '../../utils/helpers';

const tomorrow = () => { const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().split('T')[0]; };
const dayAfter = () => { const d = new Date(); d.setDate(d.getDate() + 2); return d.toISOString().split('T')[0]; };

const schema = z.object({
  firstName:   z.string().min(2, 'First name required'),
  lastName:    z.string().min(2, 'Last name required'),
  email:       z.string().email('Valid email required'),
  phone:       z.string().min(7, 'Phone number required'),
  checkIn:     z.string().min(1, 'Check-in date required'),
  checkOut:    z.string().min(1, 'Check-out date required'),
  guests:      z.coerce.number().min(1).max(10),
  specialNote: z.string().optional(),
}).refine(d => new Date(d.checkOut) > new Date(d.checkIn), {
  message: 'Check-out must be after check-in',
  path: ['checkOut'],
});

export default function Booking() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const roomId   = parseInt(params.get('room')) || 1;
  const room     = ROOMS_DATA.find(r => r.id === roomId) || ROOMS_DATA[0];

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { checkIn: tomorrow(), checkOut: dayAfter(), guests: 1 },
  });

  const checkIn  = watch('checkIn');
  const checkOut = watch('checkOut');
  const nights   = checkIn && checkOut ? Math.max(calculateNights(checkIn, checkOut), 0) : 0;
  const total    = nights * room.price;

  const onSubmit = async () => {
    try {
      await new Promise(res => setTimeout(res, 800));
      toast.success('Booking request submitted! We will confirm shortly.');
      navigate('/');
    } catch {
      toast.error('Booking failed. Please try again.');
    }
  };

  const inputCls = (err) =>
    `mt-1 w-full px-4 py-2.5 rounded-lg border ${err ? 'border-red-400' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary`;

  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">Book Your Stay</h1>
          <div className="w-20 h-1 bg-primary mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
              <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2">
                <FaUser className="text-primary" /> Guest Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-medium text-gray-700">First Name</label>
                  <input {...register('firstName')} placeholder="John" className={inputCls(errors.firstName)} />
                  {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Last Name</label>
                  <input {...register('lastName')} placeholder="Doe" className={inputCls(errors.lastName)} />
                  {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <input type="email" {...register('email')} placeholder="john@example.com" className={inputCls(errors.email)} />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Phone</label>
                  <input type="tel" {...register('phone')} placeholder="+251 9XX XXX XXX" className={inputCls(errors.phone)} />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>
              </div>
              <hr />
              <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2">
                <FaCalendarAlt className="text-primary" /> Stay Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="text-sm font-medium text-gray-700">Check-In</label>
                  <input type="date" {...register('checkIn')} className={inputCls(errors.checkIn)} />
                  {errors.checkIn && <p className="text-red-500 text-xs mt-1">{errors.checkIn.message}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Check-Out</label>
                  <input type="date" {...register('checkOut')} className={inputCls(errors.checkOut)} />
                  {errors.checkOut && <p className="text-red-500 text-xs mt-1">{errors.checkOut.message}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Guests</label>
                  <input type="number" min="1" max="10" {...register('guests')} className="mt-1 w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Special Requests (optional)</label>
                <textarea {...register('specialNote')} rows="3" placeholder="Any special requirements..." className="mt-1 w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <button type="submit" disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primaryHover disabled:opacity-60 text-white font-bold py-3.5 rounded-lg transition-colors shadow-md text-lg">
                {isSubmitting ? 'Confirming Booking…' : 'Confirm Booking'}
              </button>
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden sticky top-24">
              <img src={room.image} alt={room.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-1">{room.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{room.description}</p>
                <hr className="mb-4" />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Price per night</span><span className="font-semibold">{formatCurrency(room.price)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Nights</span><span className="font-semibold">{nights > 0 ? nights : '--'}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-gray-800 font-bold text-base">
                    <span>Total</span>
                    <span className="text-primary">{nights > 0 ? formatCurrency(total) : '--'}</span>
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-2 text-xs text-gray-400">
                  <FaCheckCircle className="text-green-500" /> Free cancellation up to 24 hours before check-in.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
