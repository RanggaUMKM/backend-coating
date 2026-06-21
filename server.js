const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors({ origin: '*', allowedHeaders: ['Content-Type'] }));
app.use(express.json());

// 1. URL Brankas Lu (Gak usah diubah, udah gw pasin!)
const supabaseUrl = 'https://reqtiazpsjmbhiztnzpc.supabase.co';

// 2. 🚨 PASTE KUNCI PANJANG LU DI BAWAH INI:
// Hapus tulisan PASTE_KUNCI_DI_SINI, lalu paste kunci lu di dalam tanda kutip!
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJlcXRpYXpwc2ptYmhpenRuenBjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIwMDgwNDksImV4cCI6MjA5NzU4NDA0OX0.mIXOJ4-AKOELzfKmovl2ZFwjzv4mLWdgZXQLVYONdW8'; 

// Nyalain Mesin Penghubung API
const supabase = createClient(supabaseUrl, supabaseKey);
console.log('✅ KONEKSI AMAN! MESIN API SUPABASE SIAP MENERIMA CUAN!');

// ==========================================
// PINTU MASUK (Menyimpan Pesanan dari Website)
// ==========================================
app.post('/pesan', async (req, res) => {
    try {
        const id_order = "VIP-" + Math.floor(Math.random() * 10000);
        
        const { error } = await supabase.from('pesanan').insert([
            {
                id_order: id_order,
                nama: req.body.nama_pemesan,
                wa: req.body.wa_pemesan,
                kendaraan: req.body.kendaraan,
                layanan: req.body.layanan,
                tanggal: req.body.tanggal,
                total: req.body.total_biaya,
                dp: req.body.dp_dibayar,
                status: "MENUNGGU DP & ALAMAT"
            }
        ]);

        if (error) throw error;

        console.log("🔥 PESANAN BARU MASUK KE DATABASE! ID: " + id_order);
        res.json({ status: "Sukses", pesan: "Data aman di Brankas Cloud Bos!" });
    } catch (error) {
        console.error("❌ Error Simpan Data:", error.message);
        res.status(500).json({ status: "Error", pesan: "Gagal nyimpen data" });
    }
});

// ==========================================
// PINTU KELUAR (Konsumen Cek Status via WA)
// ==========================================
app.get('/cek-status/:waPelanggan', async (req, res) => {
    try {
        const waDicari = req.params.waPelanggan;
        const { data, error } = await supabase.from('pesanan').select('*').eq('wa', waDicari);
        
        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error("❌ Error Cek Status:", error.message);
        res.status(500).send("Error ambil data");
    }
});

// ==========================================
// PINTU RAHASIA ADMIN (Tarik Semua Data)
// ==========================================
app.get('/admin/semua-pesanan', async (req, res) => {
    try {
        const { data, error } = await supabase.from('pesanan').select('*');
        
        if (error) throw error;
        res.json(data); 
    } catch (error) {
        console.error("❌ Error Data Admin:", error.message);
        res.status(500).send("Error ambil data admin");
    }
});

// ==========================================
// NYALAKAN MESIN BACKEND
// ==========================================
app.listen(3000, () => {
    console.log("🚀 Mesin V.I.P Backend Menyala di Port 3000.");
});