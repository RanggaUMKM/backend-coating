const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const app = express();

// ==========================================
// PENDOBRAK CORS BARBAR (PASTI TEMBUS 1000%)
// ==========================================
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

app.use(express.json());

// Panggil kunci Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// 1. JALUR TERIMA PESANAN
app.post('/api/booking', async (req, res) => {
    try {
        console.log("Data masuk dari web:", req.body);
        const { data, error } = await supabase.from('bookings').insert([req.body]);
        if (error) throw error;
        res.status(200).json({ message: "BERHASIL!", data });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// 2. JALUR CEK STATUS (KONSUMEN)
app.get('/api/status/:wa', async (req, res) => {
    try {
        const { data, error } = await supabase.from('bookings').select('*').eq('wa', req.params.wa).order('created_at', { ascending: false });
        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. JALUR ADMIN
app.get('/api/admin/bookings', async (req, res) => {
    try {
        const { data, error } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Mesin V.I.P Menyala di Port ${PORT}`));
