import { Router } from 'express';
import { supabase } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();

// Multer setup for room photo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `room-${Date.now()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) return cb(null, true);
    cb(new Error('Only image files (jpg, png, gif, webp) are allowed'));
  }
});

// GET /api/rooms - public
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/rooms/:id
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Room not found' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/rooms - admin
router.post('/', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, badge, bed_type, is_featured, sort_order, amenities } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    const roomData = {
      name,
      description,
      price: parseFloat(price),
      badge,
      bed_type,
      is_featured: is_featured === 'true' || is_featured === true,
      sort_order: parseInt(sort_order) || 0,
      amenities: amenities || null,
      image_url
    };

    const { data, error } = await supabase
      .from('rooms')
      .insert([roomData])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/rooms/:id - admin
router.put('/:id', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, badge, bed_type, is_featured, sort_order, amenities } = req.body;

    const roomData = {};
    if (name !== undefined) roomData.name = name;
    if (description !== undefined) roomData.description = description;
    if (price !== undefined) roomData.price = parseFloat(price);
    if (badge !== undefined) roomData.badge = badge;
    if (bed_type !== undefined) roomData.bed_type = bed_type;
    if (is_featured !== undefined) roomData.is_featured = is_featured === 'true' || is_featured === true;
    if (sort_order !== undefined) roomData.sort_order = parseInt(sort_order);
    if (amenities !== undefined) roomData.amenities = amenities;
    if (req.file) roomData.image_url = `/uploads/${req.file.filename}`;

    roomData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('rooms')
      .update(roomData)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Room not found' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/rooms/:id/price - admin (quick price update)
router.patch('/:id/price', authenticateToken, async (req, res) => {
  try {
    const { price } = req.body;
    if (price === undefined || isNaN(parseFloat(price))) {
      return res.status(400).json({ error: 'Valid price required' });
    }

    const { data, error } = await supabase
      .from('rooms')
      .update({ price: parseFloat(price), updated_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Room not found' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/rooms/:id/description - admin (quick description update)
router.patch('/:id/description', authenticateToken, async (req, res) => {
  try {
    const { description } = req.body;
    if (description === undefined) {
      return res.status(400).json({ error: 'Description required' });
    }

    const { data, error } = await supabase
      .from('rooms')
      .update({ description, updated_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Room not found' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/rooms/:id - admin
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('rooms')
      .delete()
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Room not found' });
    res.json({ message: 'Room deleted', room: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
