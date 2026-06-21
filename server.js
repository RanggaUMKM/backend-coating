const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();

// 1. CORS BRUTAL (Jebol Semua Gerbang)
app.use(cors());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

app.use(express.json());

// 2. CEK NYAWA SERVER (Buat ngetes)
app.get('/', (req, res) => {
    res.send("<h1>SERVER V.I.P HIDUP NORMAL! 🚀</h1><p>Kalau tulisan ini muncul, berarti Railway lu aman sentosa!</p>");
});

// 3. PENGAMAN SUPABASE (Biar nggak mati mendadak)
let supabase;
try {
    supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
    console.log("Kunci Supabase Cocok!");
} catch (err) {
    console.error("Gawat! Kunci Supabase salah/kosong:", err.message);
}

// 4. JALUR NERIMA PESANAN
app.post('/api/booking', async (req, res) => {
    try {
        if (!supabase) return res.status(500).json({ error: "Kunci Supabase belum disetting di Railway!" });
        
        const { data, error } = await supabase.from('bookings').insert([req.body]);
        if (error) return res.status(400).json({ error: error.message });
        
        res.status(200).json({ message: "BERHASIL!", data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 5. JALUR CEK STATUS
app.get('/api/status/:wa', async (req, res) => {
    try {
        const { data, error } = await supabase.from('bookings').select('*').eq('wa', req.params.wa).order('created_at', { ascending: false });
        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 6. JALUR ADMIN
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
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Mesin Anti-Badai Nyala di Port ${PORT} (0.0.0.0)`);
});
