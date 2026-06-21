const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

// Panggil kunci dari Environment Variables yang udah lu set di Railway
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Endpoint buat nambah data booking (Sesuaiin sama form lu)
app.post('/api/booking', async (req, res) => {
    const { nama, motor, paket } = req.body;
    
    const { data, error } = await supabase
        .from('bookings') // Pastikan nama table di Supabase lu adalah 'bookings'
        .insert([{ nama, motor, paket }]);

    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Data berhasil masuk brankas Supabase!', data });
});

app.listen(3000, () => console.log('🚀 Mesin V.I.P Backend Menyala di Port 3000'));
