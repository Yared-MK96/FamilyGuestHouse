import { Router } from 'express';
import { supabase } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// GET /api/bookings - admin
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*, rooms(name)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/bookings - public
router.post('/', async (req, res) => {
  try {
    const { room_id, guest_name, guest_email, guest_phone, check_in, check_out, total_price, special_requests } = req.body;

    const { data, error } = await supabase
      .from('bookings')
      .insert([{
        room_id,
        guest_name,
        guest_email,
        guest_phone,
        check_in,
        check_out,
        total_price: parseFloat(total_price),
        special_requests,
        status: 'pending'
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/bookings/:id/status - admin
router.patch('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    
    const { data, error } = await supabase
      .from('bookings')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Booking not found' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
