require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();

// CORS wajib diaktifin biar InfinityFree (frontend) lu diizinin ngakses Vercel (backend)
app.use(cors());
app.use(express.json());

// Konek ke Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// 1. TAMPILKAN SEMUA DATA (GET)
app.get('/api/admin/bookings', async (req, res) => {
    const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('id', { ascending: false }); 
    
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// 2. UPDATE STATUS PESANAN (POST)
app.post('/api/admin/update', async (req, res) => {
    const { id, status } = req.body;
    const { data, error } = await supabase
        .from('bookings')
        .update({ status_pesanan: status })
        .eq('id', id);
        
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true, pesan: "Status berhasil diupdate" });
});

// 3. HAPUS PESANAN (POST)
app.post('/api/admin/delete', async (req, res) => {
    const { id } = req.body;
    const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id);
        
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true, pesan: "Pesanan dihapus" });
});

// ==========================================
// KHUSUS VERCEL: Export app (Jangan pakai app.listen)
// ==========================================
module.exports = app;
