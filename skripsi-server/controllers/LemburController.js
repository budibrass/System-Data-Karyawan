const { PengajuanLembur, Karyawan } = require("../models");

class LemburController {
  static getLembur(req, res, next) {
    const { name } = req.query;

    PengajuanLembur.findAll({
      include: [{ 
        model: Karyawan
      }]
    })
    .then((data) => {
      if (!data || data.length === 0) {
        return res.status(404).json({ message: "Maaf, data pengajuan lembur masih kosong" });
      }
      res.status(200).json(data);
    })
    .catch((err) => {
        res.status(500).json({ message: "Internal server error saat memuat data lembur" });
    });
  }

  static getOneLembur(req, res, next) {
    let id = req.params.id;

    PengajuanLembur.findAll({
      where: { KaryawanId: id },
      include: [
        { model: Karyawan }
      ],
      order: [['tanggal', 'DESC']]
    })
      .then((data) => {
        if (!data || data.length === 0) {
          return res.status(404).json({ message: "Maaf, data lembur untuk karyawan ini tidak ditemukan" });
        }
        res.status(200).json(data);
      })
      .catch((err) => {
        res.status(500).json({ message: "Internal server error saat memuat data lembur karyawan" });
      });
  }

  static addLembur(req, res, next) {
    let body = {
        KaryawanId: req.body.KaryawanId,
        tanggal: req.body.tanggal,
        lamaJam: req.body.lamaJam,
        status: req.body.status,
        deskripsi: req.body.deskripsi,
    };

    PengajuanLembur.create(body)
      .then((data) => {
        res.status(201).json({
          msg: `Selamat, data pengajuan lembur telah berhasil ditambahkan`,
          data
        });
      })
      .catch((err) => {
        res.status(500).json({ message: "Gagal menambahkan data pengajuan lembur baru" });
      });
  }

  static async editLembur(req, res, next) {
    try {
      let id = req.params.id;
      let obj = {
        KaryawanId: req.body.KaryawanId,
        tanggal: req.body.tanggal,
        lamaJam: req.body.lamaJam,
        status: req.body.status,
        deskripsi: req.body.deskripsi,
      };

      const [updatedRows] = await PengajuanLembur.update(obj, { where: { id } });
      if (updatedRows > 0) {
        res.status(200).json({ msg: `Data lembur berhasil diubah` });
      } else {
        res.status(404).json({ message: "Data tidak ditemukan atau tidak ada perubahan data" });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error saat mengubah data lembur" });
    }
  }
}

module.exports = LemburController;