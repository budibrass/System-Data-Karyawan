const { Gaji, Karyawan, Golongan } = require("../models");
const calculatePayroll = require("../helpers/calculatePayroll");

class GajiController {
  static getGaji(req, res, next) {
    const { name } = req.query;

    Gaji.findAll({
        include: [
          { model: Karyawan }
        ]
    })
    .then((data) => {
      if (!data || data.length === 0) {
        return res.status(404).json({ message: "Maaf, data gaji masih kosong" });
      }
      res.status(200).json(data);
    })
    .catch((err) => {
        res.status(500).json({ message: "Internal server error saat memuat data gaji" });
    });
  }

  static getOneGaji(req, res, next) {
    Gaji.findAll({
        where: { KaryawanId: req.params.id },
        include: [{ model: Karyawan, include: [Golongan] }]
    }).then(data => {
        const result = data.map(item => {
            const { gajiPokok, Karyawan, totalGajiLembur } = item;
            const { uangTransportasi, uangSkill } = Karyawan.Golongan;
            
            const calc = calculatePayroll(gajiPokok, uangTransportasi, uangSkill);
            
            const totalPotongan = Object.values(calc.potongan).reduce((a, b) => a + b, 0);
            
            return {
                ...item.toJSON(),
                potongan: [calc.potongan],
                benefit: [calc.benefit],
                totalPotongan: totalPotongan,
                totalGaji: (gajiPokok + uangTransportasi + uangSkill + totalGajiLembur) - totalPotongan
            };
        });
        res.status(200).json(result);
    });
 }

  static addGaji(req, res, next) {
    let body = {
      KaryawanId: req.body.KaryawanId,
      tanggal: req.body.tanggal,
      gajiPokok: req.body.gajiPokok,
      lembur: req.body.lembur,
      lamaLembur: req.body.lamaLembur,
      potongan: req.body.potongan,
      totalPotongan: req.body.totalPotongan,
      totalGajiLembur: req.body.totalGajiLembur,
      totalGaji: req.body.totalGaji
    };

    Gaji.create(body)
      .then((data) => {
        res.status(201).json({
          msg: `Selamat, data telah berhasil ditambahkan`,
          data
        });
      })
      .catch((err) => {
        res.status(500).json({ message: "Gagal menambahkan data gaji baru" });
      });
  }

  static async deleteGaji(req, res, next) {
    try {
      let id = +req.params.id;
      const data = await Gaji.destroy({ where: { id } });
      if (data) {
        return res.status(200).json({ msg: `Data berhasil dihapus` });
      } else {
        return res.status(404).json({ message: "Data gaji tidak ditemukan untuk dihapus" });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error saat menghapus data gaji" });
    }
  }

  static async editGaji(req, res, next) {
    try {
      let id = req.params.id;
      let obj = {
        KaryawanId: req.body.KaryawanId,
        tanggal: req.body.tanggal,
        gajiPokok: req.body.gajiPokok,
        lembur: req.body.lembur,
        lamaLembur: req.body.lamaLembur,
        potongan: req.body.potongan,
        totalPotongan: req.body.totalPotongan,
        totalGajiLembur: req.body.totalGajiLembur,
        totalGaji: req.body.totalGaji
      };

      const [updatedRows] = await Gaji.update(obj, { where: { id } });
      if (updatedRows > 0) {
        res.status(200).json({ msg: `Data berhasil diubah` });
      } else {
        res.status(404).json({ message: "Data tidak ditemukan atau tidak ada perubahan data" });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error saat mengubah data gaji" });
    }
  }
}

module.exports = GajiController;