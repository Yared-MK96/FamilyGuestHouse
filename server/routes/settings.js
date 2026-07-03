import { Router } from 'express';
import { supabase } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `hero-${Date.now()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) return cb(null, true);
    cb(new Error('Only image files allowed'));
  }
});

// GET /api/settings - public
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*');

    if (error) throw error;

    const settings = {};
    (data || []).forEach(s => {
      settings[s.key] = s.value;
    });

    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/settings - admin (bulk update)
router.put('/', authenticateToken, async (req, res) => {
  try {
    const updates = req.body;

    for (const [key, value] of Object.entries(updates)) {
      const { error: upsertError } = await supabase
        .from('settings')
        .upsert({ key, value }, { onConflict: 'key' });

      if (upsertError) throw upsertError;
    }

    const { data, error } = await supabase.from('settings').select('*');
    if (error) throw error;

    const settings = {};
    (data || []).forEach(s => { settings[s.key] = s.value; });

    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/settings/hero-image - admin (upload hero image)
router.post('/hero-image', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image uploaded' });

    const imageUrl = `/uploads/${req.file.filename}`;

    const { error } = await supabase
      .from('settings')
      .upsert({ key: 'hero_image', value: imageUrl }, { onConflict: 'key' });

    if (error) throw error;
    res.json({ key: 'hero_image', value: imageUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/settings/:key - public (single setting)
router.get('/:key', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('key', req.params.key)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Setting not found' });

    res.json({ key: data.key, value: data.value });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
