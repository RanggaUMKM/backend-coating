const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

// Panggil kunci dari Environment Variables yang udah lu set di Railway
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// ==========================================
// 1. JALUR TERIMA PESANAN BARU DARI WEB
// ==========================================
app.post('/api/booking', async (req, res) => {
    try {
        console.log("Data masuk:", req.body);
        
        const { data, error } = await supabase
            .from('bookings')
            .insert([req.body]);

        if (error) {
            console.error("Supabase error:", error);
            return res.status(400).json({ error: error.message });
        }
        res.status(200).json({ message: "MANTAP BERHASIL MASUK!", data });
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "Terjadi kesalahan di server." });
    }
});

// ==========================================
// 2. JALUR CEK STATUS (KHUSUS 1 KONSUMEN)
// ==========================================
app.get('/api/status/:wa', async (req, res) => {
    const waPelanggan = req.params.wa; 
    try {
        const { data, error } = await supabase
            .from('bookings')
            .select('*')
            .eq('wa', waPelanggan)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error("Error ngambil status:", error);
        res.status(500).json({ error: 'Gagal mengambil data dari Supabase' });
    }
});

// ==========================================
// 3. JALUR KHUSUS ADMIN (AMBIL SEMUA PESANAN)
// ==========================================
app.get('/api/admin/bookings', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('bookings')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error("Error ngambil data admin:", error);
        res.status(500).json({ error: 'Gagal mengambil data untuk Admin' });
    }
});

// Port dinamis biar Railway nggak bingung
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Mesin V.I.P Backend Menyala di Port ${PORT}`));
