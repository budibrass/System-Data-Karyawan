function calculatePayroll(gajiPokok, transport, skill) {
    const grossSalary = gajiPokok + transport + skill;
    
    // Batas maksimal dasar perhitungan (sesuaikan angka dengan regulasi 2026)
    const MAX_BPJS_KES = 12000000;
    const MAX_JP = 10500000; // Contoh limit 2026

    // Perhitungan Karyawan (Potongan)
    const bpjsKesEmp = Math.min(grossSalary, MAX_BPJS_KES) * 0.01;
    const jhtEmp = grossSalary * 0.02;
    const jpEmp = Math.min(grossSalary, MAX_JP) * 0.01;
    
    // Perhitungan Perusahaan (Benefit)
    const jkkComp = grossSalary * 0.0024; // Contoh risiko rendah
    const jkmComp = grossSalary * 0.003;
    const jhtComp = grossSalary * 0.037;
    const jpComp = Math.min(grossSalary, MAX_JP) * 0.02;
    const bpjsKesComp = Math.min(grossSalary, MAX_BPJS_KES) * 0.04;

    // PPh 21 (Sederhana - asumsi PTKP K/0)
    const pph21 = (grossSalary * 0.05); // Contoh asumsi flat layer terendah

    return {
        potongan: {
            bpjsKesehatan: bpjsKesEmp,
            jhtEmployee: jhtEmp,
            jaminanPensiunEmployee: jpEmp,
            pph21: pph21
        },
        benefit: {
            jkk: jkkComp,
            jkm: jkmComp,
            jhtCompany: jhtComp,
            jaminanPensiunCompany: jpComp,
            bpjsKesehatanCompany: bpjsKesComp
        }
    };
}

module.exports = calculatePayroll;