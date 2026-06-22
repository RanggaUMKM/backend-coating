const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();

// Buka gerbang CORS pakai jalur resmi
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Panggil kunci Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// 1. JALUR TERIMA PESANAN
app.post('/api/booking', async (req, res) => {
    try {
        const { data, error } = await supabase.from('bookings').insert([req.body]);
        if (error) throw error;
        res.status(200).json({ message: "BERHASIL!", data });
    } catch (error) {
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

// 3. JALUR ADMIN (BACA DATA)
app.get('/api/admin/bookings', async (req, res) => {
    try {
        const { data, error } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// 4. JALUR UPDATE STATUS (TANGAN BESI BOS)
// ==========================================
app.post('/api/admin/update', async (req, res) => {
    try {
        const { id, status } = req.body;
        
        // PENTING BOS: Kalo di Supabase nama kolom lu "status_pesanan", 
        // ubah tulisan { status: status } di bawah ini jadi { status_pesanan: status }
        const { data, error } = await supabase
            .from('bookings')
            .update({ status: status }) 
            .eq('id', id);

        if (error) throw error;
        res.status(200).json({ message: "Status Berhasil Diupdate!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Port dinamis dari Railway
const PORT = process.env.PORT || 3000;

// INI KUNCI JAWABANNYA: Tambahin '0.0.0.0' biar gerbang depan kebuka buat seluruh dunia!
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Mesin V.I.P Menyala di Port ${PORT} dan Gerbang 0.0.0.0 TERBUKA!`);
});
