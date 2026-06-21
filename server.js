const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

// Panggil kunci dari Environment Variables yang udah lu set di Railway
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Endpoint buat nambah data booking (Sesuaiin sama form lu)
app.get('/api/status/:wa', async (req, res) => {
    const waPelanggan = req.params.wa; // Nangkep nomor WA dari URL
    
    try {
        // Nyuruh Supabase nyari data di tabel bookings yang kolom 'wa'-nya SAMA PERSIS kayak nomor WA pelanggan
        const { data, error } = await supabase
            .from('bookings')
            .select('*')
            .eq('wa', waPelanggan) // <--- INI KUNCI BIAR NGGAK TABRAKAN!
            .order('created_at', { ascending: false }); // Urutin dari pesanan paling baru

        if (error) throw error;
        
        // Kirim datanya balik ke web status.html
        res.json(data);
    } catch (error) {
        console.error("Error ngambil status:", error);
        res.status(500).json({ error: 'Gagal mengambil data dari Supabase' });
    }
});

app.listen(3000, () => console.log('🚀 Mesin V.I.P Backend Menyala di Port 3000'));