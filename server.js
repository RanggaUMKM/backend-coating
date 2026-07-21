require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();

// Konfigurasi CORS Express yang ramah Vercel
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());

// Tangani manual preflight OPTIONS agar selalu balas OK (200)
app.options('*', cors());

// Konek Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// 1. BOOKING API
app.post('/api/booking', async (req, res) => {
    try {
        const { nama, wa, motor, paket, tanggal, alamat, total_harga, dp_wajib } = req.body;

        const { data: cekTanggal, error: errCek } = await supabase
            .from('bookings')
            .select('id')
            .eq('tanggal', tanggal);

        if (errCek) return res.status(500).json({ error: errCek.message });
        if (cekTanggal && cekTanggal.length > 0) {
            return res.status(400).json({ error: "FULL" });
        }

        const { data, error } = await supabase
            .from('bookings')
            .insert([{ nama, wa, motor, paket, tanggal, alamat, total_harga, dp_wajib }])
            .select();

        if (error) return res.status(500).json({ error: error.message });
        res.status(200).json({ message: "BERHASIL!", data: data[0] });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// 2. ADMIN BOOKINGS
app.get('/api/admin/bookings', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('bookings')
            .select('*')
            .order('id', { ascending: false });

        if (error) return res.status(500).json({ error: error.message });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. STATUS KONSUMEN
app.get('/api/status/:wa', async (req, res) => {
    const wa = req.params.wa;
    try {
        const { data, error } = await supabase
            .from('bookings')
            .select('*')
            .eq('wa', wa);

        if (error) return res.status(500).json({ error: error.message });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. UPDATE STATUS
app.post('/api/admin/update', async (req, res) => {
    try {
        const { id, status } = req.body;
        const { error } = await supabase
            .from('bookings')
            .update({ status_pesanan: status })
            .eq('id', id);

        if (error) return res.status(500).json({ error: error.message });
        res.status(200).json({ message: "Status Berhasil Diupdate!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 5. DELETE PESANAN
app.post('/api/admin/delete', async (req, res) => {
    try {
        const { id } = req.body;
        const { error } = await supabase
            .from('bookings')
            .delete()
            .eq('id', id);

        if (error) return res.status(500).json({ error: error.message });
        res.status(200).json({ message: "Pesanan Berhasil Dihapus!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = app;
