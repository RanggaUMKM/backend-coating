const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const app = express();

// --- IZIN CORS MUTLAK UNTUK SEMUA DOMAIN ---
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

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
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/admin/bookings', async (req, res) => {
    try {
        const { data, error } = await supabase.from('bookings').select('*').order('id', { ascending: false });
        if (error) return res.status(500).json({ error: error.message });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/status/:wa', async (req, res) => {
    try {
        const { data, error } = await supabase.from('bookings').select('*').eq('wa', req.params.wa);
        if (error) return res.status(500).json({ error: error.message });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/admin/update', async (req, res) => {
    try {
        const { id, status } = req.body;
        const { error } = await supabase.from('bookings').update({ status_pesanan: status }).eq('id', id);
        if (error) return res.status(500).json({ error: error.message });
        res.status(200).json({ message: "Status Berhasil Diupdate!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/admin/delete', async (req, res) => {
    try {
        const { id } = req.body;
        const { error } = await supabase.from('bookings').delete().eq('id', id);
        if (error) return res.status(500).json({ error: error.message });
        res.status(200).json({ message: "Pesanan Berhasil Dihapus!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = app;
});

app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// (Sisa rute API /booking, /status, dll di bawahnya...)

// (Sisa rute API /booking, /status, dll biarkan seperti biasa di bawahnya...)

module.exports = app;
