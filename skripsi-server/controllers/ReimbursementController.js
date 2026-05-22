const { Reimbursement, Karyawan } = require("../models");

class ReimbursementController {
  static getReimbursement(req, res, next) {
    const { name } = req.query;

    Reimbursement.findAll({
        include: [{ 
          model: Karyawan
        }]
    })
    .then((data) => {
      if (!data) {
        throw { msg: `maaf data anda masih kosong` };
      } else {
        res.status(200).json(data);
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Internal server error" });
    });
  }

  static getOneReimbursement(req, res, next) {
    let id = req.params.id;

    Reimbursement.findOne({
      where: {id}
    })
      .then((data) => {
        if (!data) {
          data=[]
        } 
        res.status(200).json(data);
      })
      .catch((err) => {
        res.status(500).json({ message: "Internal server error" });
      });
  }

  static addReimbursement(req, res, next) {
    let imagePath = "";
    if (req.file) {
        imagePath = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    let body = {
        KaryawanId: req.body.KaryawanId,
        tanggal: req.body.tanggal,
        namaReimbursement: req.body.namaReimbursement,
        jumlah: req.body.jumlah,
        imageUrl: imagePath,
        status: req.body.status
    };

    Reimbursement.create(body)
      .then((data) => {
        res.status(201).json({
          msg: `selamat data telah berhasil ditambahkan`,
          data
        });
      })
      .catch((err) => {
        res.status(500).json({ message: "Internal Server Error" });
      });
}

  static async editReimbursement(req, res, next) {
    try {
      let id = req.params.id;
      let obj = {
        KaryawanId: req.body.KaryawanId,
        tanggal: req.body.tanggal,
        namaReimbursement: req.body.namaReimbursement,
        jumlah: req.body.jumlah,
        status: req.body.status,
        imageUrl: req.body.imageUrl,
      };

      const data = await Reimbursement.update(obj, { where: { id } });
      if (data) res.status(201).json({ msg: `data berhasil diubah` });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async deleteReimbursement(req, res, next) {
    try {
      let id = +req.params.id;
      const data = await Reimbursement.destroy({ where: { id } });
      if (data) {
        res.status(201).json({ msg: `data berhasil dihapus` });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = ReimbursementController;
