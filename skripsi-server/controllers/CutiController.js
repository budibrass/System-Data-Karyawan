const { Cuti, Karyawan } = require("../models");

class CutiController {
  static getCuti(req, res, next) {
    const { name } = req.query;

    Cuti.findAll({
        include: [{ 
          model: Karyawan
        }]
    })
    .then((data) => {
      if (!data || data.length === 0) {
        return res.status(444).json({ message: `maaf data anda masih kosong` });
      } else {
        res.status(200).json(data);
      }
    })
    .catch((err) => {
        res.status(500).json({ 
          message: "Gagal mengambil data cuti", 
          error: err.message || err 
        });
    });
  }

  static getOneCuti(req, res, next) {
    let id = req.params.id;

    Cuti.findOne({
      where: { id }
    })
      .then((data) => {
        if (!data) {
          return res.status(444).json({ message: `maaf id yang anda masukkan tidak di temukan` });
        } else {
          res.status(200).json(data);
        }
      })
      .catch((err) => {
        res.status(500).json({ 
          message: "Gagal mengambil detail data cuti", 
          error: err.message || err 
        });
      });
  }

  static addCuti(req, res, next) {
    let body = {
        KaryawanId: req.body.KaryawanId,
        mulaiTanggal: req.body.mulaiTanggal,
        sampaiTanggal: req.body.sampaiTanggal,
        alasan: req.body.alasan,
        status: req.body.status
    };

    Cuti.create(body)
      .then((data) => {
        res.status(201).json({
          msg: `selamat data telah berhasil ditambahkan`,
          data
        });
      })
      .catch((err) => {
        res.status(400).json({ 
          message: "Gagal menambahkan data cuti", 
          error: err.message || err 
        });
      });
  }

  static async editGaji(req, res, next) {
    try {
      let id = req.params.id;
      let obj = {
        KaryawanId: req.body.KaryawanId,
        mulaiTanggal: req.body.mulaiTanggal,
        sampaiTanggal: req.body.sampaiTanggal,
        alasan: req.body.alasan,
        status: req.body.status
      };

      const [updatedRows] = await Cuti.update(obj, { where: { id } });
      
      if (updatedRows === 0) {
        return res.status(444).json({ message: "Data tidak ditemukan atau tidak ada perubahan" });
      }
      
      res.status(200).json({ msg: `data berhasil diubah` });
    } catch (error) {
      res.status(500).json({ 
        message: "Gagal memperbarui data cuti", 
        error: error.message || error 
      });
    }
  }
}

module.exports = CutiController;